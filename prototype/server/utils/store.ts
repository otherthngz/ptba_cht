// ── Types ─────────────────────────────────────────────────────────────

export type UnitType = 'DUMP_TRUCK' | 'LOADER' | 'SUPPORT'
export type Ownership = 'OWN' | 'RENTAL'
export type TonnageStatus = 'CONFIRMED' | 'PENDING' | 'MANUAL'
export type AssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type IssueStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED'

export interface Unit {
    unit_id: string
    unit_name: string
    unit_type: UnitType
    ownership: Ownership
    vendor_name: string | null
    capacity_ton: number | null
    is_active: boolean
    notes: string | null
}

export interface Location {
    location_id: string
    location_name: string
    location_type: 'LOADING' | 'DUMPING' | 'JETTY' | 'WORKSHOP' | 'STOCKPILE'
    location_role: 'LOADING' | 'DUMPING'
    is_active: boolean
}

export interface Shift {
    shift_id: string
    shift_name: string
    start_time: string
    end_time: string
    timezone: string
    is_active: boolean
}

export interface TonnageHistory {
    source: 'IOT' | 'MANUAL_ENTRY' | 'SYSTEM_ADJUSTMENT'
    value: number | null
    status: TonnageStatus
    recorded_at: string
    actor?: string
    reason?: string
}

export interface Trip {
    trip_id: string
    unit_id: string
    unit_name: string
    assignment_id: string | null
    loading_location_id: string
    dumping_location_id: string
    loading_location_name: string
    dumping_location_name: string
    depart_load_ts: string | null
    arrive_load_ts: string | null
    load_start_ts: string | null
    load_end_ts: string | null
    depart_dump_ts: string | null
    arrive_dump_ts: string | null
    dump_start_ts: string | null
    dump_end_ts: string | null
    tonnage_primary: number | null
    tonnage_status: TonnageStatus
    tonnage_history: TonnageHistory[]
    is_duplicate_flagged: boolean
}

export interface Assignment {
    assignment_id: string
    unit_id: string
    operator_id: string | null
    shift_id: string
    start_ts: string
    end_ts: string | null
    status: AssignmentStatus
    loading_location_id: string
    dumping_location_id: string
    notes: string | null
}

export interface Issue {
    issue_id: string
    issue_type: string
    severity: IssueSeverity
    status: IssueStatus
    linked_entity_type: 'UNIT' | 'TRIP' | 'ASSIGNMENT'
    linked_entity_id: string
    unit_id: string
    unit_name: string
    trip_id: string | null
    detail: string
    evidence: Record<string, any>
    rule_threshold: string
    created_at: string
    updated_at: string
    resolved_by: string | null
    resolved_at: string | null
    resolution_note: string | null
}

export interface AuditLog {
    log_id: string
    timestamp: string
    actor: string
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TRANSITION'
    entity_type: string
    entity_id: string
    reason: string | null
    payload_before: any
    payload_after: any
}

// ── State ─────────────────────────────────────────────────────────────

export const units: Unit[] = []
export const locations: Location[] = []
export const shifts: Shift[] = []
export const trips: Trip[] = []
export const assignments: Assignment[] = []
export const issues: Issue[] = []
export const auditLogs: AuditLog[] = []

// ── Helpers ────────────────────────────────────────────────────────
const counters: Record<string, number> = {}
export function nextId(prefix: string): string {
    if (!counters[prefix]) counters[prefix] = 0
    counters[prefix]++
    return `${prefix}-${String(counters[prefix]).padStart(3, '0')}`
}

const now = new Date()
function ts(minutesOffset: number = 0): string {
    return new Date(now.getTime() + minutesOffset * 60000).toISOString()
}

// ── Simulation ────────────────────────────────────────────────────
export let tickCount = 0

export function simulateTick() {
    tickCount++
    const n = new Date()

    // 1. Complete a random active assignment every 3 ticks
    const activeAsn = assignments.filter(a => a.status === 'IN_PROGRESS')
    if (activeAsn.length > 2 && tickCount % 3 === 0) {
        const a = activeAsn[tickCount % activeAsn.length]!
        a.status = 'COMPLETED'
        a.end_ts = n.toISOString()
    }

    // 2. Resolve a pending tonnage every 2 ticks
    const pendingTrips = trips.filter(t => t.tonnage_status === 'PENDING')
    if (pendingTrips.length > 0 && tickCount % 2 === 0) {
        const t = pendingTrips[tickCount % pendingTrips.length]!
        t.tonnage_status = 'CONFIRMED'
        t.tonnage_primary = Number((25 + Math.random() * 10).toFixed(2))
        t.tonnage_history.push({ source: 'IOT', value: t.tonnage_primary, status: 'CONFIRMED', recorded_at: n.toISOString() })
    }

    // 3. Create occasional anomaly every 5 ticks
    if (tickCount % 5 === 0 && issues.length < 60) {
        const types = ['PENDING_TOO_LONG', 'DUPLICATE_TRIP', 'TONNAGE_OUTLIER', 'MISSING_TIMESTAMP', 'STALE_UPDATE']
        const sevs: IssueSeverity[] = ['HIGH', 'MEDIUM', 'LOW']
        const u = units[tickCount % units.length]!
        issues.push({
            issue_id: nextId('ISS'), issue_type: types[tickCount % types.length]!,
            severity: sevs[tickCount % sevs.length]!, status: 'OPEN',
            linked_entity_type: 'UNIT', linked_entity_id: u.unit_id,
            unit_id: u.unit_id, unit_name: u.unit_name, trip_id: null,
            detail: `Auto-detected anomaly for ${u.unit_id}`,
            evidence: { tick: tickCount }, rule_threshold: 'Auto',
            created_at: n.toISOString(), updated_at: n.toISOString(),
            resolved_by: null, resolved_at: null, resolution_note: null
        })
    }

    return { tick: tickCount, pendingResolved: tickCount % 2 === 0 ? 1 : 0 }
}

// ── Seeding ───────────────────────────────────────────────────────────

function seed() {
    // 1. Units (20 DT + 3 LD + 1 SP)
    for (let i = 1; i <= 10; i++) {
        units.push({ unit_id: `DT-0${i < 10 ? '0' + i : i}`, unit_name: `DT-${i < 10 ? '0' + i : i}`, unit_type: 'DUMP_TRUCK', ownership: 'OWN', vendor_name: null, capacity_ton: 30 + (i % 2) * 5, is_active: true, notes: null })
    }
    for (let i = 11; i <= 20; i++) {
        units.push({ unit_id: `DT-${i}`, unit_name: `DT-${i}`, unit_type: 'DUMP_TRUCK', ownership: 'RENTAL', vendor_name: i % 2 === 0 ? 'Vendor A' : 'Vendor B', capacity_ton: 30, is_active: true, notes: null })
    }
    units.push(
        { unit_id: 'LD-001', unit_name: 'LD-001', unit_type: 'LOADER', ownership: 'OWN', vendor_name: null, capacity_ton: null, is_active: true, notes: null },
        { unit_id: 'LD-002', unit_name: 'LD-002', unit_type: 'LOADER', ownership: 'OWN', vendor_name: null, capacity_ton: null, is_active: true, notes: null },
        { unit_id: 'LD-003', unit_name: 'LD-003', unit_type: 'LOADER', ownership: 'RENTAL', vendor_name: 'Vendor A', capacity_ton: null, is_active: true, notes: null },
        { unit_id: 'SP-001', unit_name: 'SP-001', unit_type: 'SUPPORT', ownership: 'OWN', vendor_name: null, capacity_ton: null, is_active: true, notes: 'Fuel Truck' }
    )

    // 2. Locations (6 Loading + 2 Jetty + 10 ROM)
    for (let i = 1; i <= 6; i++) {
        locations.push({ location_id: `PIT-0${i}`, location_name: `Pit Block ${String.fromCharCode(64 + i)}`, location_type: 'LOADING', location_role: 'LOADING', is_active: true })
    }
    locations.push(
        { location_id: 'JETTY-01', location_name: 'Jetty Point A', location_type: 'JETTY', location_role: 'DUMPING', is_active: true },
        { location_id: 'JETTY-02', location_name: 'Jetty Point B', location_type: 'JETTY', location_role: 'DUMPING', is_active: true }
    )
    for (let i = 1; i <= 10; i++) {
        locations.push({ location_id: `ROM-0${i < 10 ? i : i}`, location_name: `ROM Stockpile ${i}`, location_type: 'STOCKPILE', location_role: 'DUMPING', is_active: true })
    }

    // 3. Shifts
    shifts.push(
        { shift_id: 'SHIFT-1', shift_name: 'Shift 1 (Day)', start_time: '06:00', end_time: '18:00', timezone: 'Asia/Jakarta', is_active: true },
        { shift_id: 'SHIFT-2', shift_name: 'Shift 2 (Night)', start_time: '18:00', end_time: '06:00', timezone: 'Asia/Jakarta', is_active: true }
    )

    // 4. Assignments
    units.filter(u => u.unit_type === 'DUMP_TRUCK').forEach((u, idx) => {
        assignments.push({
            assignment_id: nextId('ASN'), unit_id: u.unit_id, operator_id: `OP-${100 + idx}`,
            shift_id: 'SHIFT-1', start_ts: ts(-480), end_ts: null,
            status: idx < 15 ? 'IN_PROGRESS' : 'ASSIGNED',
            loading_location_id: locations[idx % 6]!.location_id,
            dumping_location_id: locations[6 + (idx % 10)]!.location_id,
            notes: idx % 4 === 0 ? 'Priority load' : null
        })
    })

    // 5. Trips (120)
    let tCount = 0
    while (tCount < 120) {
        const unit = units[tCount % 20]!
        if (unit.unit_type !== 'DUMP_TRUCK') { tCount++; continue }
        const loadLoc = locations[Math.floor(Math.random() * 6)]!
        const dumpLoc = locations[6 + Math.floor(Math.random() * 10)]!
        const duration = 30 + Math.random() * 30
        const finishOffset = -(tCount * 2)
        const startOffset = finishOffset - duration
        const tonnageVal = 25 + Math.random() * 10
        const rand = Math.random()
        let tStatus: TonnageStatus = 'CONFIRMED'
        let tPrimary: number | null = Number(tonnageVal.toFixed(2))
        const tHistory: TonnageHistory[] = []

        if (rand > 0.9) {
            tStatus = 'MANUAL'
            tHistory.push({ source: 'MANUAL_ENTRY', value: tPrimary, status: 'MANUAL', recorded_at: ts(finishOffset), actor: 'Dispatcher', reason: 'Sensor Offline' })
        } else if (rand > 0.7) {
            tStatus = 'PENDING'; tPrimary = null
            tHistory.push({ source: 'IOT', value: null, status: 'PENDING', recorded_at: ts(finishOffset) })
        } else {
            tHistory.push({ source: 'IOT', value: tPrimary, status: 'PENDING', recorded_at: ts(finishOffset - 5) })
            tHistory.push({ source: 'IOT', value: tPrimary, status: 'CONFIRMED', recorded_at: ts(finishOffset) })
        }

        trips.push({
            trip_id: nextId('TRP'), unit_id: unit.unit_id, unit_name: unit.unit_name, assignment_id: null,
            loading_location_id: loadLoc.location_id, dumping_location_id: dumpLoc.location_id,
            loading_location_name: loadLoc.location_name, dumping_location_name: dumpLoc.location_name,
            depart_load_ts: ts(startOffset), arrive_load_ts: ts(startOffset + 5),
            load_start_ts: ts(startOffset + 6), load_end_ts: ts(startOffset + 10),
            depart_dump_ts: ts(startOffset + 12), arrive_dump_ts: ts(finishOffset - 5),
            dump_start_ts: ts(finishOffset - 4), dump_end_ts: ts(finishOffset),
            tonnage_primary: tPrimary, tonnage_status: tStatus, tonnage_history: tHistory, is_duplicate_flagged: false
        })
        tCount++
    }

    // 6. Issues (25)
    const issueTypes = ['PENDING_TOO_LONG', 'DUPLICATE_TRIP', 'TONNAGE_OUTLIER', 'MISSING_TIMESTAMP', 'STALE_UPDATE']
    const severities: IssueSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
    const issStatuses: IssueStatus[] = ['OPEN', 'OPEN', 'OPEN', 'IN_REVIEW', 'IN_REVIEW', 'RESOLVED']
    for (let i = 0; i < 25; i++) {
        const u = units[i % units.length]!
        const t = trips[i % trips.length]!
        const it = issueTypes[i % issueTypes.length]!
        const sv = severities[i % severities.length]!
        const st = issStatuses[i % issStatuses.length]!
        issues.push({
            issue_id: nextId('ISS'), issue_type: it, severity: sv, status: st,
            linked_entity_type: it === 'STALE_UPDATE' ? 'UNIT' : 'TRIP',
            linked_entity_id: it === 'STALE_UPDATE' ? u.unit_id : t.trip_id,
            unit_id: u.unit_id, unit_name: u.unit_name,
            trip_id: it === 'STALE_UPDATE' ? null : t.trip_id,
            detail: `${it.replace(/_/g, ' ')} detected for ${u.unit_id}`,
            evidence: { value: 40 + i, threshold: 38 },
            rule_threshold: it === 'TONNAGE_OUTLIER' ? '2 std dev' : '30 min',
            created_at: ts(-(i * 15)), updated_at: ts(-(i * 10)),
            resolved_by: st === 'RESOLVED' ? 'Supervisor' : null,
            resolved_at: st === 'RESOLVED' ? ts(-(i * 5)) : null,
            resolution_note: st === 'RESOLVED' ? 'Verified and cleared' : null
        })
    }

    // 7. Audit Logs (35+)
    const actors = ['Dispatcher', 'Supervisor', 'System', 'Checker']
    for (let i = 0; i < 10; i++) {
        const a = assignments[i % assignments.length]!
        auditLogs.push({ log_id: nextId('AUD'), timestamp: ts(-(i * 20)), actor: actors[i % 4]!, action: i < 5 ? 'CREATE' : 'UPDATE', entity_type: 'ASSIGNMENT', entity_id: a.assignment_id, reason: i < 5 ? 'New dispatch' : 'Status update', payload_before: i < 5 ? null : { status: 'ASSIGNED' }, payload_after: { status: i < 5 ? 'ASSIGNED' : 'IN_PROGRESS' } })
    }
    const manualTrips = trips.filter(t => t.tonnage_status === 'MANUAL')
    for (let i = 0; i < Math.min(8, manualTrips.length); i++) {
        const t = manualTrips[i]!
        auditLogs.push({ log_id: nextId('AUD'), timestamp: ts(-(i * 25)), actor: 'Checker', action: 'UPDATE', entity_type: 'TRIP', entity_id: t.trip_id, reason: 'Manual tonnage - sensor offline', payload_before: { tonnage_status: 'PENDING', tonnage_primary: null }, payload_after: { tonnage_status: 'MANUAL', tonnage_primary: t.tonnage_primary } })
    }
    const resolved = issues.filter(i => i.status === 'RESOLVED')
    for (let i = 0; i < Math.min(7, resolved.length); i++) {
        const iss = resolved[i]!
        auditLogs.push({ log_id: nextId('AUD'), timestamp: ts(-(i * 30)), actor: 'Supervisor', action: 'TRANSITION', entity_type: 'ISSUE', entity_id: iss.issue_id, reason: 'Issue resolved', payload_before: { status: 'IN_REVIEW' }, payload_after: { status: 'RESOLVED' } })
    }
    const confirmed = trips.filter(t => t.tonnage_status === 'CONFIRMED').slice(0, 10)
    for (let i = 0; i < confirmed.length; i++) {
        const t = confirmed[i]!
        auditLogs.push({ log_id: nextId('AUD'), timestamp: ts(-(i * 12)), actor: 'System', action: 'UPDATE', entity_type: 'TRIP', entity_id: t.trip_id, reason: 'IOT confirmed', payload_before: { tonnage_status: 'PENDING' }, payload_after: { tonnage_status: 'CONFIRMED', tonnage_primary: t.tonnage_primary } })
    }
    auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    console.log(`[Store] Seeded ${units.length} units, ${locations.length} locations, ${trips.length} trips, ${issues.length} issues, ${auditLogs.length} audit logs.`)
}

seed()
