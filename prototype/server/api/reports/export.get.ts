import { trips, issues, auditLogs } from '~~/server/utils/store'

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
    const query = getQuery(event)
    const type = (query.type as string) ?? 'trips'
    let data: any[]
    switch (type) {
        case 'trips': data = trips; break
        case 'issues': data = issues; break
        case 'audit': data = auditLogs; break
        default: data = trips
    }
    return toCsv(data)
})
