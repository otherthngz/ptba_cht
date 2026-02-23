import { trips, units, issues, nextId, type Issue, type IssueSeverity } from './store'
import { writeAudit } from './audit'

// ── Configuration ─────────────────────────────────────────────────────
const PENDING_TOO_LONG_MIN = 120    // 2 hours
const STALE_THRESHOLD_MIN = 30      // 30 min (for unit updates, not implemented in seed yet but rule exists)
const TONNAGE_OUTLIER_PCT = 0.2     // +/- 20%
const DUPLICATE_WINDOW_MIN = 10     // 10 min window

// ── Rule Interface ────────────────────────────────────────────────────
interface AnomalyResult {
    type: string
    severity: IssueSeverity
    unit_id: string
    unit_name: string
    trip_id: string | null
    detail: string
    rule_threshold: string
    evidence: Record<string, any>
}

// ── Rules ─────────────────────────────────────────────────────────────

function rulePendingTooLong(): AnomalyResult[] {
    const now = Date.now()
    return trips
        .filter(t => t.tonnage_status === 'PENDING' && t.dump_end_ts)
        .filter(t => (now - new Date(t.dump_end_ts!).getTime()) / 60000 > PENDING_TOO_LONG_MIN)
        .map(t => ({
            type: 'PENDING_TOO_LONG',
            severity: 'HIGH',
            unit_id: t.unit_id,
            unit_name: t.unit_name,
            trip_id: t.trip_id,
            detail: `Trip pending for >${Math.round((now - new Date(t.dump_end_ts!).getTime()) / 60000)} min`,
            rule_threshold: `${PENDING_TOO_LONG_MIN} min`,
            evidence: { dump_end: t.dump_end_ts }
        }))
}

function ruleDuplicateTrip(): AnomalyResult[] {
    const results: AnomalyResult[] = []
    // Naive O(N^2) checks acceptable for prototype (80-200 items)
    for (let i = 0; i < trips.length; i++) {
        const t = trips[i]
        if (!t.dump_end_ts) continue

        // Check against others
        const others = trips.filter((o, idx) =>
            idx !== i &&
            o.unit_id === t.unit_id &&
            o.dumping_location_id === t.dumping_location_id &&
            o.dump_end_ts &&
            Math.abs(new Date(o.dump_end_ts).getTime() - new Date(t.dump_end_ts).getTime()) / 60000 < DUPLICATE_WINDOW_MIN
        )

        if (others.length > 0) {
            results.push({
                type: 'DUPLICATE_TRIP',
                severity: 'HIGH',
                unit_id: t.unit_id,
                unit_name: t.unit_name,
                trip_id: t.trip_id,
                detail: `Potential duplicate with ${others.map(o => o.trip_id).join(', ')}`,
                rule_threshold: `${DUPLICATE_WINDOW_MIN} min`,
                evidence: { others: others.map(o => o.trip_id) }
            })
            t.is_duplicate_flagged = true // Mark in store
        }
    }
    return results
}

function ruleTonnageOutlier(): AnomalyResult[] {
    const results: AnomalyResult[] = []
    for (const t of trips) {
        if (t.tonnage_primary === null) continue
        const unit = units.find(u => u.unit_id === t.unit_id)
        if (!unit || !unit.capacity_ton) continue

        const cap = unit.capacity_ton
        const min = cap * (1 - TONNAGE_OUTLIER_PCT)
        const max = cap * (1 + TONNAGE_OUTLIER_PCT)

        if (t.tonnage_primary < min || t.tonnage_primary > max) {
            results.push({
                type: 'TONNAGE_OUTLIER',
                severity: 'HIGH',
                unit_id: t.unit_id,
                unit_name: t.unit_name,
                trip_id: t.trip_id,
                detail: `Value ${t.tonnage_primary}t is outside [${min.toFixed(1)}, ${max.toFixed(1)}]`,
                rule_threshold: `+/- 20% of ${cap}t`,
                evidence: { capacity: cap, value: t.tonnage_primary }
            })
        }
    }
    return results
}

function ruleMissingTimestamp(): AnomalyResult[] {
    return trips
        .filter(t => !t.load_start_ts || !t.dump_end_ts)
        .map(t => {
            const missing = []
            if (!t.load_start_ts) missing.push('load_start')
            if (!t.dump_end_ts) missing.push('dump_end')

            return {
                type: 'MISSING_TIMESTAMP',
                severity: 'MEDIUM',
                unit_id: t.unit_id,
                unit_name: t.unit_name,
                trip_id: t.trip_id,
                detail: `Missing: ${missing.join(', ')}`,
                rule_threshold: 'All timestamps required',
                evidence: { missing }
            }
        })
}

// Stale Update (Mocked since we check trips, not realtime unit heartbeat in `store.ts` yet)
function ruleStaleUpdate(): AnomalyResult[] {
    return []
}

// ── Engine ────────────────────────────────────────────────────────────

export function evaluateAnomalies(): Issue[] {
    const detected: AnomalyResult[] = [
        ...rulePendingTooLong(),
        ...ruleDuplicateTrip(),
        ...ruleTonnageOutlier(),
        ...ruleMissingTimestamp(),
        ...ruleStaleUpdate()
    ]

    // Dedup key: type + trip_id (or unit_id if trip is null)
    const key = (d: AnomalyResult) => `${d.type}:${d.trip_id ?? d.unit_id}`
    const existingKeys = new Set(issues.map(i => `${i.issue_type}:${i.trip_id ?? i.unit_id}`))

    for (const d of detected) {
        if (!existingKeys.has(key(d))) {
            const newIssue: Issue = {
                issue_id: nextId('ISS'),
                issue_type: d.type,
                severity: d.severity,
                status: 'OPEN',
                linked_entity_type: d.trip_id ? 'TRIP' : 'UNIT',
                linked_entity_id: d.trip_id ?? d.unit_id,
                unit_id: d.unit_id,
                unit_name: d.unit_name,
                trip_id: d.trip_id,
                detail: d.detail,
                evidence: d.evidence,
                rule_threshold: d.rule_threshold,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resolved_by: null,
                resolved_at: null,
                resolution_note: null
            }
            issues.push(newIssue)

            // Audit creation
            writeAudit({
                actor: 'System (Anomaly Engine)',
                action: 'CREATE',
                entity_type: 'ISSUE',
                entity_id: newIssue.issue_id,
                reason: 'Anomaly Detected',
                payload_after: newIssue
            })
        }
    }

    return issues
}

export function transitionIssue(issueId: string, note: string): Issue | null {
    const issue = issues.find(i => i.issue_id === issueId)
    if (!issue) return null

    const before = { ...issue }

    if (issue.status === 'OPEN') {
        issue.status = 'IN_REVIEW'
        issue.updated_at = new Date().toISOString()
    } else if (issue.status === 'IN_REVIEW') {
        issue.status = 'RESOLVED'
        issue.resolved_by = 'Supervisor'
        issue.resolved_at = new Date().toISOString()
        issue.resolution_note = note
        issue.updated_at = new Date().toISOString()
    } else {
        return issue // No change
    }

    writeAudit({
        actor: 'User', // In real app, from session
        action: 'TRANSITION',
        entity_type: 'ISSUE',
        entity_id: issue.issue_id,
        reason: `Status change to ${issue.status}`,
        payload_before: before,
        payload_after: issue
    })

    return issue
}
