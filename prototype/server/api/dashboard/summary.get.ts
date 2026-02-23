import { units, trips, assignments, issues, auditLogs } from '~~/server/utils/store'
import { evaluateAnomalies } from '~~/server/utils/anomalies'

export default defineEventHandler(() => {
    evaluateAnomalies()

    const now = new Date()

    // ── KPIs ──
    const activeUnits = units.filter(u => u.is_active).length
    const totalUnits = units.length
    const pendingTrips = trips.filter(t => t.tonnage_status === 'PENDING').length
    const confirmedTrips = trips.filter(t => t.tonnage_status === 'CONFIRMED').length
    const manualTrips = trips.filter(t => t.tonnage_status === 'MANUAL').length
    const totalTrips = trips.length
    const openIssues = issues.filter(i => i.status === 'OPEN').length
    const criticalIssues = issues.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length
    const activeAssignments = assignments.filter(a => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS').length
    const completedAssignments = assignments.filter(a => a.status === 'COMPLETED').length

    const confirmedTonnage = trips
        .filter(t => t.tonnage_status === 'CONFIRMED' && t.tonnage_primary != null)
        .reduce((s, t) => s + (t.tonnage_primary ?? 0), 0)
    const pendingTonnage = trips
        .filter(t => t.tonnage_status === 'PENDING' && t.tonnage_primary != null)
        .reduce((s, t) => s + (t.tonnage_primary ?? 0), 0)
    const manualTonnage = trips
        .filter(t => t.tonnage_status === 'MANUAL' && t.tonnage_primary != null)
        .reduce((s, t) => s + (t.tonnage_primary ?? 0), 0)

    const kpis = {
        activeUnits,
        totalUnits,
        pendingTrips,
        confirmedTrips,
        manualTrips,
        totalTrips,
        openIssues,
        criticalIssues,
        activeAssignments,
        completedAssignments,
        confirmedTonnage: Math.round(confirmedTonnage),
        pendingTonnage: Math.round(pendingTonnage),
        manualTonnage: Math.round(manualTonnage),
        totalTonnage: Math.round(confirmedTonnage + pendingTonnage + manualTonnage),
    }

    // ── Pending Trend (last 7 intervals) ──
    const pendingTrend: { label: string; count: number; avgAge: number }[] = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now)
        d.setHours(d.getHours() - i * 4)
        const label = `${String(d.getHours()).padStart(2, '0')}:00`

        // Simulate realistic pending counts that fluctuate
        const baseCount = pendingTrips
        const noise = Math.floor(Math.random() * 6) - 3
        const count = Math.max(0, baseCount + noise + (6 - i))

        // Avg pending age in minutes — older entries earlier in day
        const avgAge = Math.round(15 + (6 - i) * 8 + Math.random() * 10)

        pendingTrend.push({ label, count, avgAge })
    }

    // ── Pending Breakdown by reason ──
    const reasonCounts: Record<string, number> = {}
    const pendingReasons = [
        'MISSING_IOT_READING',
        'SENSOR_TIMEOUT',
        'AWAITING_MANUAL_ENTRY',
        'SYSTEM_DELAY',
        'CALIBRATION_MISMATCH'
    ]
    // Distribute pending trips across reasons realistically
    const pendingList = trips.filter(t => t.tonnage_status === 'PENDING')
    pendingList.forEach((t, idx) => {
        const reason = pendingReasons[idx % pendingReasons.length]
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1
    })
    // Add a few more for variety if count is low
    if (Object.keys(reasonCounts).length === 0) {
        pendingReasons.forEach((r, i) => { reasonCounts[r] = 3 + i * 2 })
    }

    const pendingBreakdown = Object.entries(reasonCounts)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)

    // ── Tab data: Pending Queue (top 15) ──
    const pendingQueue = pendingList.slice(0, 15).map((t, idx) => ({
        trip_id: t.trip_id,
        unit_id: t.unit_id,
        loading_location: t.loading_location_name || t.loading_location_id,
        dumping_location: t.dumping_location_name || t.dumping_location_id,
        tonnage_value: t.tonnage_primary,
        pending_reason: pendingReasons[idx % pendingReasons.length],
        pending_since: new Date(now.getTime() - (10 + idx * 12) * 60000).toISOString(),
        age_minutes: 10 + idx * 12,
    }))

    // ── Tab data: Open Issues (top 15) ──
    const openIssuesList = issues
        .filter(i => i.status === 'OPEN')
        .sort((a, b) => {
            const sevOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
            return (sevOrder[a.severity] ?? 4) - (sevOrder[b.severity] ?? 4)
        })
        .slice(0, 15)
        .map(i => ({
            issue_id: i.issue_id,
            issue_type: i.issue_type,
            severity: i.severity,
            unit_id: i.unit_id,
            detail: i.detail.length > 60 ? i.detail.slice(0, 60) + '...' : i.detail,
            created_at: i.created_at,
        }))

    // ── Tab data: Latest Audits (top 15) ──
    const latestAudits = [...auditLogs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15)
        .map(a => ({
            log_id: a.log_id,
            action: a.action,
            entity_type: a.entity_type,
            entity_id: a.entity_id,
            actor: a.actor,
            reason: a.reason,
            timestamp: a.timestamp,
        }))

    // ── Tab data: Top Units by trip count ──
    const unitTripCounts: Record<string, { count: number; tonnage: number }> = {}
    trips.forEach(t => {
        if (!unitTripCounts[t.unit_id]) unitTripCounts[t.unit_id] = { count: 0, tonnage: 0 }
        unitTripCounts[t.unit_id].count++
        unitTripCounts[t.unit_id].tonnage += (t.tonnage_primary ?? 0)
    })
    const topUnits = Object.entries(unitTripCounts)
        .map(([unit_id, data]) => ({
            unit_id,
            trip_count: data.count,
            total_tonnage: Math.round(data.tonnage),
            unit_type: units.find(u => u.unit_id === unit_id)?.unit_type ?? 'UNKNOWN',
            ownership: units.find(u => u.unit_id === unit_id)?.ownership ?? 'UNKNOWN',
        }))
        .sort((a, b) => b.trip_count - a.trip_count)
        .slice(0, 15)

    return {
        kpis,
        pendingTrend,
        pendingBreakdown,
        pendingQueue,
        openIssues: openIssuesList,
        latestAudits,
        topUnits,
    }
})
