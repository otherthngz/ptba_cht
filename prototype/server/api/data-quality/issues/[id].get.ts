import { issues, auditLogs } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    const id = getRouterParam(event, 'id')
    const issue = issues.find(i => i.issue_id === id)

    if (!issue) {
        throw createError({ statusCode: 404, statusMessage: 'Issue not found' })
    }

    // Related Audit Logs
    const issueAudit = auditLogs.filter(a => a.entity_id === id && a.entity_type === 'ISSUE')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return {
        issue,
        audit: issueAudit
    }
})
