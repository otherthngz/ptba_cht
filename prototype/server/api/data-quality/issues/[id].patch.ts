import { issues } from '~~/server/utils/store'
import { writeAudit } from '~~/server/utils/audit'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    const issue = issues.find(i => i.issue_id === id)
    if (!issue) {
        throw createError({ statusCode: 404, statusMessage: 'Issue not found' })
    }

    if (!body.status || !body.reason || !body.actor) {
        throw createError({ statusCode: 400, statusMessage: 'status, reason, and actor are required' })
    }

    const previousStatus = issue.status

    // Update Issue
    issue.status = body.status
    issue.updated_at = new Date().toISOString()

    if (body.status === 'RESOLVED') {
        issue.resolved_at = new Date().toISOString()
        issue.resolved_by = body.actor
        issue.resolution_note = body.reason
    } else {
        // Reopening or other status change
        issue.resolved_at = null
        issue.resolved_by = null
    }

    // Audit Log
    writeAudit({
        actor: body.actor,
        action: 'TRANSITION',
        entity_type: 'ISSUE',
        entity_id: issue.issue_id,
        reason: body.reason,
        payload_before: { status: previousStatus },
        payload_after: { status: issue.status, note: body.reason }
    })

    return { success: true, issue }
})
