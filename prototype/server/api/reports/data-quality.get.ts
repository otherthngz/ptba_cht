import { issues } from '~~/server/utils/store'

function toCsv(rows: any[]): string {
    if (!rows.length) return ''
    const headers = Object.keys(rows[0])
    const lines = [headers.join(',')]
    for (const row of rows) {
        lines.push(headers.map(h => {
            const v = row[h]
            if (v === null || v === undefined) return ''
            const s = String(v)
            return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
        }).join(','))
    }
    return lines.join('\n')
}

export default defineEventHandler((event) => {
    const q = getQuery(event)
    const severity = (q.severity as string) || ''
    const status = (q.status as string) || ''
    const unitId = (q.unit_id as string) || ''

    let filtered = [...issues]
    if (severity) filtered = filtered.filter(i => i.severity === severity)
    if (status) filtered = filtered.filter(i => i.status === status)
    if (unitId) filtered = filtered.filter(i => i.unit_id.toLowerCase().includes(unitId.toLowerCase()))

    const open = filtered.filter(i => i.status === 'OPEN')
    const inReview = filtered.filter(i => i.status === 'IN_REVIEW')
    const resolved = filtered.filter(i => i.status === 'RESOLVED')
    const critical = filtered.filter(i => i.severity === 'CRITICAL')
    const high = filtered.filter(i => i.severity === 'HIGH')

    // Issues by type chart
    const byType: Record<string, number> = {}
    filtered.forEach(i => { byType[i.issue_type] = (byType[i.issue_type] || 0) + 1 })
    const issuesByType = Object.entries(byType)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => ({ type, count }))

    // Issues by severity chart
    const bySeverity = [
        { label: 'CRITICAL', count: critical.length },
        { label: 'HIGH', count: high.length },
        { label: 'MEDIUM', count: filtered.filter(i => i.severity === 'MEDIUM').length },
        { label: 'LOW', count: filtered.filter(i => i.severity === 'LOW').length },
    ]

    // Issues by status chart
    const byStatus = [
        { label: 'OPEN', count: open.length },
        { label: 'IN_REVIEW', count: inReview.length },
        { label: 'RESOLVED', count: resolved.length },
    ]

    const rows = filtered
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map(i => ({
            issue_id: i.issue_id,
            issue_type: i.issue_type,
            severity: i.severity,
            status: i.status,
            unit_id: i.unit_id,
            detail: i.detail,
            rule_threshold: i.rule_threshold,
            created_at: i.created_at,
            resolved_at: i.resolved_at || '',
            resolved_by: i.resolved_by || '',
        }))

    if (q.export === 'csv') {
        const parts = [severity, status].filter(Boolean).join('_') || 'all'
        return {
            csv: toCsv(rows),
            filename: `data_quality_report_${parts}_${new Date().toISOString().slice(0, 10)}.csv`
        }
    }

    return {
        metrics: {
            totalIssues: filtered.length,
            openIssues: open.length,
            inReview: inReview.length,
            resolved: resolved.length,
            critical: critical.length,
            high: high.length,
        },
        charts: { issuesByType, bySeverity, byStatus },
        rows,
    }
})
