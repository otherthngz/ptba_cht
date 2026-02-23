import { units, assignments, trips, issues } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    const unitId = getRouterParam(event, 'unitId')
    const unit = units.find(u => u.unit_id === unitId)

    if (!unit) {
        throw createError({ statusCode: 404, statusMessage: 'Unit not found' })
    }

    // Recent trips (last 5)
    const unitTrips = trips
        .filter(t => t.unit_id === unitId)
        .sort((a, b) => new Date(b.dump_end_ts || '').getTime() - new Date(a.dump_end_ts || '').getTime())
        .slice(0, 5)

    // Active Issues
    const unitIssues = issues.filter(i => i.unit_id === unitId && i.status !== 'RESOLVED')

    // Timeline (Mocked from assignments + status changes)
    // In real app, this comes from a dedicated event log.
    const timeline = [
        { time: new Date().toISOString(), label: 'System Check', status: 'OK' },
        ...unitTrips.map(t => ({
            time: t.dump_end_ts,
            label: `Trip Completed: ${t.tonnage_value}t`,
            status: 'COMPLETED'
        }))
    ].slice(0, 5)

    return {
        unit,
        timeline,
        recentTrips: unitTrips,
        openIssues: unitIssues
    }
})
