import { trips } from '~~/server/utils/store'
import { writeAudit } from '~~/server/utils/audit'

export default defineEventHandler(async (event) => {
    // Simulates an incoming message from the Weighbridge system
    const body = await readBody(event)

    if (!body.tripId || !body.confirmedTonnage) {
        throw createError({ statusCode: 400, statusMessage: 'tripId and confirmedTonnage required' })
    }

    const trip = trips.find(t => t.trip_id === body.tripId)
    if (!trip) throw createError({ statusCode: 404, statusMessage: 'Trip not found' })

    const previousTonnage = trip.tonnage_primary
    const previousStatus = trip.tonnage_status

    // Reconcile Rule: Confirmed ALWAYS overrides Manual for the primary status
    trip.tonnage_primary = Number(body.confirmedTonnage)
    trip.tonnage_status = 'CONFIRMED'

    // Add to History (Source: IOT matches spec)
    trip.tonnage_history.push({
        source: 'IOT',
        value: Number(body.confirmedTonnage),
        status: 'CONFIRMED',
        recorded_at: new Date().toISOString(),
        actor: 'SYSTEM',
        reason: 'Weighbridge Confirmation'
    })

    // Audit Log
    writeAudit({
        actor: 'SYSTEM',
        action: 'UPDATE',
        entity_type: 'TRIP',
        entity_id: trip.trip_id,
        reason: 'Confirmed Feed Reconcilliation',
        payload_before: { tonnage: previousTonnage, status: previousStatus },
        payload_after: { tonnage: trip.tonnage_primary, status: trip.tonnage_status }
    })

    return { success: true, tripId: trip.trip_id, status: 'CONFIRMED' }
})
