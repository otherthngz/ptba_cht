import { trips, issues, auditLogs } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    const tripId = getRouterParam(event, 'tripId')
    const trip = trips.find(t => t.trip_id === tripId)

    if (!trip) {
        throw createError({ statusCode: 404, statusMessage: 'Trip not found' })
    }

    // Related Issues
    const tripIssues = issues.filter(i => i.trip_id === tripId)

    // Related Audit Logs
    const tripAudit = auditLogs.filter(a => a.entity_id === tripId && a.entity_type === 'TRIP')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
        trip,
        history: trip.tonnage_history.sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()),
        audit: tripAudit,
        issues: tripIssues
    }
})
