import { assignments } from '~~/server/utils/store'
import { writeAudit } from '~~/server/utils/audit'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    const assignment = assignments.find(a => a.assignment_id === id)
    if (!assignment) {
        throw createError({ statusCode: 404, statusMessage: 'Assignment not found' })
    }

    // Capture State Before
    const payloadBefore = { ...assignment }

    // Update Fields
    if (body.status) assignment.status = body.status
    if (body.dumpingLoc) assignment.dumping_location_id = body.dumpingLoc
    if (body.loadingLoc) assignment.loading_location_id = body.loadingLoc

    // If completing, set end time
    if (body.status === 'COMPLETED' && !assignment.end_ts) {
        assignment.end_ts = new Date().toISOString()
    }

    // Audit Log
    writeAudit({
        actor: 'Dispatcher',
        action: 'UPDATE',
        entity_type: 'ASSIGNMENT',
        entity_id: assignment.assignment_id,
        reason: body.note || 'Status/Location Update',
        payload_before: payloadBefore,
        payload_after: assignment
    })

    return { success: true, assignment }
})
