import { trips, issues } from '~~/server/utils/store'
import { writeAudit } from '~~/server/utils/audit'
import { evaluateAnomalies } from '~~/server/utils/anomalies'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Strict Input Validation
    if (!body.tripId || !body.tonnage || !body.reason || !body.actor) {
        throw createError({ statusCode: 400, statusMessage: 'tripId, tonnage, reason, and actor are required' })
    }

    const trip = trips.find(t => t.trip_id === body.tripId)
    if (!trip) throw createError({ statusCode: 404, statusMessage: 'Trip not found' })

    const previousTonnage = trip.tonnage_primary
    const previousStatus = trip.tonnage_status

    // Update State
    trip.tonnage_primary = Number(body.tonnage)
    trip.tonnage_status = 'MANUAL'

    // Add History
    trip.tonnage_history.push({
        source: 'MANUAL_ENTRY',
        value: Number(body.tonnage),
        status: 'MANUAL',
        recorded_at: new Date().toISOString(),
        actor: body.actor,
        reason: body.reason
    })

    // Audit Log
    writeAudit({
        actor: body.actor,
        action: 'UPDATE',
        entity_type: 'TRIP',
        entity_id: trip.trip_id,
        reason: body.reason,
        payload_before: { tonnage: previousTonnage, status: previousStatus },
        payload_after: { tonnage: trip.tonnage_primary, status: trip.tonnage_status }
    })

    // Re-evaluate anomalies for this trip (e.g., check if outlier)
    // In a real app we might optimize this to only check relevant rules, 
    // but here we re-run the engine which is fast enough for mock data.
    evaluateAnomalies()

    return { success: true, tripId: trip.trip_id }
})
