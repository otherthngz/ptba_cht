import { auditLogs } from '~~/server/utils/store'

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
    const action = (q.action as string) || ''
    const actor = (q.actor as string) || ''
    const entityType = (q.entity_type as string) || ''

    let filtered = [...auditLogs]
    if (action) filtered = filtered.filter(l => l.action === action)
    if (actor) filtered = filtered.filter(l => l.actor.toLowerCase().includes(actor.toLowerCase()))
    if (entityType) filtered = filtered.filter(l => l.entity_type.toLowerCase().includes(entityType.toLowerCase()))

    // By action chart
    const byAction: Record<string, number> = {}
    filtered.forEach(l => { byAction[l.action] = (byAction[l.action] || 0) + 1 })
    const logsByAction = Object.entries(byAction)
        .sort((a, b) => b[1] - a[1])
        .map(([action, count]) => ({ action, count }))

    // By entity_type chart
    const byEntity: Record<string, number> = {}
    filtered.forEach(l => { byEntity[l.entity_type] = (byEntity[l.entity_type] || 0) + 1 })
    const logsByEntity = Object.entries(byEntity)
        .sort((a, b) => b[1] - a[1])
        .map(([entity_type, count]) => ({ entity_type, count }))

    // By actor chart (top 8)
    const byActor: Record<string, number> = {}
    filtered.forEach(l => { byActor[l.actor] = (byActor[l.actor] || 0) + 1 })
    const logsByActor = Object.entries(byActor)
        .sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([actor, count]) => ({ actor, count }))

    const sorted = [...filtered].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const rows = sorted.map(l => ({
        log_id: l.log_id,
        timestamp: l.timestamp,
        actor: l.actor,
        action: l.action,
        entity_type: l.entity_type,
        entity_id: l.entity_id,
        reason: l.reason || '',
    }))

    if (q.export === 'csv') {
        const parts = [action, actor, entityType].filter(Boolean).join('_') || 'all'
        return {
            csv: toCsv(rows),
            filename: `audit_log_${parts}_${new Date().toISOString().slice(0, 10)}.csv`
        }
    }

    return {
        metrics: {
            totalLogs: filtered.length,
            creates: filtered.filter(l => l.action === 'CREATE').length,
            updates: filtered.filter(l => l.action === 'UPDATE').length,
            deletes: filtered.filter(l => l.action === 'DELETE').length,
            transitions: filtered.filter(l => l.action === 'TRANSITION').length,
        },
        charts: { logsByAction, logsByEntity, logsByActor },
        rows,
    }
})
