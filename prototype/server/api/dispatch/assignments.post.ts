import { assignments, units, nextId } from '~~/server/utils/store'
import { writeAudit } from '~~/server/utils/audit'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validation
    if (!body.unitId || !body.loadingLoc || !body.dumpingLoc || !body.shiftId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    const unit = units.find(u => u.unit_id === body.unitId)
    if (!unit) throw createError({ statusCode: 404, statusMessage: 'Unit not found' })

    // Create Assignment
    const newAssignment = {
        assignment_id: nextId('ASN'),
        unit_id: body.unitId,
        operator_id: body.operatorId || null,
        shift_id: body.shiftId,
        start_ts: new Date().toISOString(),
        end_ts: null,
        status: 'ASSIGNED',
        loading_location_id: body.loadingLoc,
        dumping_location_id: body.dumpingLoc
        // Note: 'notes' field is not in the store interface currently for Assignment, 
        // strictly following store.ts. If needed, we'd add it to store.ts first.
        // For M3, we will stick to store.ts schema.
    }

    // @ts-ignore - pushing matching type
    assignments.unshift(newAssignment)

    // Audit Log
    writeAudit({
        actor: 'Dispatcher', // Mock user
        action: 'CREATE',
        entity_type: 'ASSIGNMENT',
        entity_id: newAssignment.assignment_id,
        reason: 'New Dispatch',
        payload_before: null,
        payload_after: newAssignment
    })

    return { success: true, assignment: newAssignment }
})
