import { trips, issues, units, assignments } from '~~/server/utils/store'

export default defineEventHandler(() => {
    // Tonnage by status
    const confirmed = trips.filter(t => t.tonnage_status === 'CONFIRMED')
    const pending = trips.filter(t => t.tonnage_status === 'PENDING')
    const manual = trips.filter(t => t.tonnage_status === 'MANUAL')

    const tonnageByStatus = {
        confirmed: { count: confirmed.length, total: confirmed.reduce((s, t) => s + (t.tonnage_primary ?? 0), 0) },
        pending: { count: pending.length, total: 0 },
        manual: { count: manual.length, total: manual.reduce((s, t) => s + (t.tonnage_primary ?? 0), 0) }
    }

    // Issues by type
    const issuesByType: Record<string, number> = {}
    issues.forEach(i => { issuesByType[i.issue_type] = (issuesByType[i.issue_type] || 0) + 1 })

    // Availability breakdown (mock summary)
    const activeUnits = units.filter(u => u.is_active && u.unit_type === 'DUMP_TRUCK').length
    const totalDT = units.filter(u => u.unit_type === 'DUMP_TRUCK').length
    const availabilityBreakdown = {
        running: Math.round(activeUnits * 0.65),
        standby: Math.round(activeUnits * 0.15),
        breakdown: Math.round(totalDT * 0.1),
        delay: Math.round(totalDT * 0.1)
    }

    // Assignments summary
    const asnActive = assignments.filter(a => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS').length
    const asnCompleted = assignments.filter(a => a.status === 'COMPLETED').length

    return {
        tonnageByStatus,
        issuesByType,
        availabilityBreakdown,
        assignmentSummary: { active: asnActive, completed: asnCompleted, total: assignments.length },
        totalTrips: trips.length,
        totalUnits: units.length
    }
})
