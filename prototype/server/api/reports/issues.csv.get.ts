import { issues } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    let csv = 'IssueID,Type,Severity,Status,Detail,LinkedEntity,Created,ResolvedBy\n'

    // Sort Newest First
    const sorted = [...issues].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    for (const i of sorted) {
        const line = [
            i.issue_id,
            i.issue_type,
            i.severity,
            i.status,
            i.detail,
            `${i.linked_entity_type}:${i.linked_entity_id}`,
            i.created_at,
            i.resolved_by || ''
        ].map(v => `"${v}"`).join(',')

        csv += line + '\n'
    }

    setResponseHeader(event, 'Content-Type', 'text/csv')
    setResponseHeader(event, 'Content-Disposition', 'attachment; filename="issues_report.csv"')
    return csv
})
