import { units, assignments } from '~~/server/utils/store'

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
    const unitType = (q.unit_type as string) || ''
    const ownership = (q.ownership as string) || ''

    const totalHours = 12

    let filtered = [...units]
    if (unitType) filtered = filtered.filter(u => u.unit_type === unitType)
    if (ownership) filtered = filtered.filter(u => u.ownership === ownership)

    const rows = filtered.map(u => {
        let running = 0, standby = 0, breakdown = 0, delay = 0
        const activeAsn = assignments.find(a => a.unit_id === u.unit_id && (a.status === 'IN_PROGRESS' || a.status === 'ASSIGNED'))

        if (!u.is_active) {
            breakdown = totalHours
        } else if (activeAsn) {
            running = 9 + Math.random() * 2
            standby = 1 + Math.random()
            delay = Math.max(0, totalHours - running - standby - breakdown)
        } else {
            standby = totalHours * 0.7
            delay = totalHours * 0.3
        }

        const available = totalHours - breakdown
        const pa = Math.round((available / totalHours) * 100 * 10) / 10
        const ua = available > 0 ? Math.round((running / available) * 100 * 10) / 10 : 0

        return {
            unit_id: u.unit_id,
            unit_type: u.unit_type,
            ownership: u.ownership,
            status: u.is_active ? (activeAsn ? 'RUNNING' : 'STANDBY') : 'BREAKDOWN',
            running_hours: Math.round(running * 10) / 10,
            standby_hours: Math.round(standby * 10) / 10,
            breakdown_hours: Math.round(breakdown * 10) / 10,
            delay_hours: Math.round(delay * 10) / 10,
            pa_pct: pa,
            ua_pct: ua,
        }
    })

    const activeRows = rows.filter(r => r.status !== 'BREAKDOWN')
    const breakdownRows = rows.filter(r => r.status === 'BREAKDOWN')
    const runningRows = rows.filter(r => r.status === 'RUNNING')

    const avgPA = rows.length ? Math.round(rows.reduce((s, r) => s + r.pa_pct, 0) / rows.length * 10) / 10 : 0
    const avgUA = rows.length ? Math.round(rows.reduce((s, r) => s + r.ua_pct, 0) / rows.length * 10) / 10 : 0

    // PA distribution chart
    const paBuckets = [
        { label: '≥95%', count: rows.filter(r => r.pa_pct >= 95).length },
        { label: '85–94%', count: rows.filter(r => r.pa_pct >= 85 && r.pa_pct < 95).length },
        { label: '70–84%', count: rows.filter(r => r.pa_pct >= 70 && r.pa_pct < 85).length },
        { label: '<70%', count: rows.filter(r => r.pa_pct < 70).length },
    ]

    // Status breakdown chart
    const statusBreakdown = [
        { label: 'Running', count: runningRows.length },
        { label: 'Standby', count: activeRows.length - runningRows.length },
        { label: 'Breakdown', count: breakdownRows.length },
    ]

    // PA by unit_type chart
    const byType: Record<string, { sum: number; count: number }> = {}
    rows.forEach(r => {
        if (!byType[r.unit_type]) byType[r.unit_type] = { sum: 0, count: 0 }
        byType[r.unit_type].sum += r.pa_pct
        byType[r.unit_type].count++
    })
    const paByUnitType = Object.entries(byType).map(([type, d]) => ({
        unit_type: type,
        avg_pa: Math.round(d.sum / d.count * 10) / 10,
    }))

    if (q.export === 'csv') {
        const parts = [unitType, ownership].filter(Boolean).join('_') || 'all'
        return {
            csv: toCsv(rows),
            filename: `availability_report_${parts}_${new Date().toISOString().slice(0, 10)}.csv`
        }
    }

    return {
        metrics: {
            totalUnits: rows.length,
            activeUnits: activeRows.length,
            breakdownUnits: breakdownRows.length,
            runningUnits: runningRows.length,
            avgPA,
            avgUA,
        },
        charts: { paBuckets, statusBreakdown, paByUnitType },
        rows,
    }
})
