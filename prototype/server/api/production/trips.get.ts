import { trips, issues } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const statusFilter = query.status as string | undefined
    const search = (query.search as string || '').toLowerCase()

    let result = trips.filter(t => !t.is_duplicate_flagged)

    if (statusFilter && statusFilter !== 'ALL') {
        result = result.filter(t => t.tonnage_status === statusFilter)
    }

    if (search) {
        result = result.filter(t =>
            t.unit_id.toLowerCase().includes(search) ||
            t.trip_id.toLowerCase().includes(search)
        )
    }

    // Sort by dump_end_ts desc (newest first)
    result.sort((a, b) => new Date(b.dump_end_ts || '').getTime() - new Date(a.dump_end_ts || '').getTime())

    return result.map(t => {
        // Find anomalies for this trip
        const tripIssues = issues.filter(i => i.trip_id === t.trip_id && i.status !== 'RESOLVED')

        return {
            tripId: t.trip_id,
            unitId: t.unit_id,
            route: `${t.loading_location_name} → ${t.dumping_location_name}`,
            dumpTime: t.dump_end_ts,
            tonnage: t.tonnage_primary,
            status: t.tonnage_status, // CONFIRMED, PENDING, MANUAL
            issues: tripIssues.map(i => i.issue_type) // List of issue types
        }
    })
})
