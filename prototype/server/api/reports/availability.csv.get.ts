import { units, assignments } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    // Re-using summary logic for CSV
    // Ideally we'd factor this out, but for prototype we duplicate the simple logic or call the internal function if possible.
    // Duplicating for speed/isolation.

    let csv = 'UnitID,CurrentStatus,MetricsPA (Approx),MetricsUA (Approx)\n'
    const totalHours = 12

    for (const u of units) {
        let running = 0
        let breakdown = 0
        const activeAsn = assignments.find(a => a.unit_id === u.unit_id && a.status === 'IN_PROGRESS')

        if (!u.is_active) {
            breakdown = totalHours
        } else if (activeAsn) {
            running = 10
        }

        const available = totalHours - breakdown
        const pa = (available / totalHours) * 100
        const ua = available > 0 ? (running / available) * 100 : 0

        const line = [
            u.unit_id,
            u.is_active ? 'Active' : 'Breakdown',
            Math.round(pa * 10) / 10 + '%',
            Math.round(ua * 10) / 10 + '%'
        ].map(v => `"${v}"`).join(',')

        csv += line + '\n'
    }

    setResponseHeader(event, 'Content-Type', 'text/csv')
    setResponseHeader(event, 'Content-Disposition', 'attachment; filename="availability_report.csv"')
    return csv
})
