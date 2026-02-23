import { trips, units } from '~~/server/utils/store'

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
    const shift = (q.shift as string) || ''
    const unitType = (q.unit_type as string) || ''
    const ownership = (q.ownership as string) || ''
    const location = (q.location as string) || ''

    let filtered = [...trips]
    if (unitType) {
        const validUnits = new Set(units.filter(u => u.unit_type === unitType).map(u => u.unit_id))
        filtered = filtered.filter(t => validUnits.has(t.unit_id))
    }
    if (ownership) {
        const validUnits = new Set(units.filter(u => u.ownership === ownership).map(u => u.unit_id))
        filtered = filtered.filter(t => validUnits.has(t.unit_id))
    }
    if (location) {
        filtered = filtered.filter(t =>
            t.loading_location_name?.toLowerCase().includes(location.toLowerCase()) ||
            t.dumping_location_name?.toLowerCase().includes(location.toLowerCase())
        )
    }

    const confirmed = filtered.filter(t => t.tonnage_status === 'CONFIRMED')
    const pending = filtered.filter(t => t.tonnage_status === 'PENDING')
    const manual = filtered.filter(t => t.tonnage_status === 'MANUAL')

    const confirmedTonnage = confirmed.reduce((s, t) => s + (t.tonnage_primary ?? 0), 0)
    const manualTonnage = manual.reduce((s, t) => s + (t.tonnage_primary ?? 0), 0)
    const totalTonnage = confirmedTonnage + manualTonnage

    // Tonnage by status chart
    const tonnageByStatus = [
        { label: 'CONFIRMED', count: confirmed.length, tonnage: Math.round(confirmedTonnage) },
        { label: 'PENDING', count: pending.length, tonnage: 0 },
        { label: 'MANUAL', count: manual.length, tonnage: Math.round(manualTonnage) },
    ]

    // Trips per unit chart (top 10)
    const perUnit: Record<string, number> = {}
    filtered.forEach(t => { perUnit[t.unit_id] = (perUnit[t.unit_id] || 0) + 1 })
    const tripsPerUnit = Object.entries(perUnit)
        .sort((a, b) => b[1] - a[1]).slice(0, 10)
        .map(([unit_id, count]) => ({ unit_id, count }))

    // Tonnage by loading location chart
    const perLocation: Record<string, number> = {}
    filtered.forEach(t => {
        if (t.loading_location_name) {
            perLocation[t.loading_location_name] = (perLocation[t.loading_location_name] || 0) + (t.tonnage_primary ?? 0)
        }
    })
    const tonnageByLocation = Object.entries(perLocation)
        .sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([location, tonnage]) => ({ location, tonnage: Math.round(tonnage) }))

    const rows = filtered
        .sort((a, b) => new Date(b.dump_end_ts || '').getTime() - new Date(a.dump_end_ts || '').getTime())
        .map(t => ({
            trip_id: t.trip_id,
            unit_id: t.unit_id,
            loading_location: t.loading_location_name,
            dumping_location: t.dumping_location_name,
            departure: t.depart_load_ts || '',
            arrival: t.arrive_dump_ts || '',
            tonnage: t.tonnage_primary ?? '',
            tonnage_status: t.tonnage_status,
            source: t.tonnage_status === 'MANUAL' ? 'Manual Entry' : 'IoT',
        }))

    if (q.export === 'csv') {
        const parts = [shift, unitType, ownership].filter(Boolean).join('_') || 'all'
        return {
            csv: toCsv(rows),
            filename: `production_report_${parts}_${new Date().toISOString().slice(0, 10)}.csv`
        }
    }

    return {
        metrics: {
            totalTrips: filtered.length,
            confirmedTrips: confirmed.length,
            pendingTrips: pending.length,
            manualTrips: manual.length,
            totalTonnage: Math.round(totalTonnage),
            confirmedTonnage: Math.round(confirmedTonnage),
            manualTonnage: Math.round(manualTonnage),
        },
        charts: { tonnageByStatus, tripsPerUnit, tonnageByLocation },
        rows,
    }
})
