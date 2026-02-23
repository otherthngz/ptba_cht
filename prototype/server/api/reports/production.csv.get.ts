import { trips } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    // CSV Header
    let csv = 'TripID,Unit,Loading,Dumping,Departure,Arrival,Tonnage,Status,Source\n'

    // Sort Newest First
    const sorted = [...trips].sort((a, b) => new Date(b.dump_end_ts || '').getTime() - new Date(a.dump_end_ts || '').getTime())

    for (const t of sorted) {
        const line = [
            t.trip_id,
            t.unit_id,
            t.loading_location_name,
            t.dumping_location_name,
            t.depart_load_ts || '',
            t.arrive_dump_ts || '',
            t.tonnage_primary || 0,
            t.tonnage_status,
            t.tonnage_status === 'MANUAL' ? 'Manual Entry' : 'IoT'
        ].map(v => `"${v}"`).join(',')

        csv += line + '\n'
    }

    setResponseHeader(event, 'Content-Type', 'text/csv')
    setResponseHeader(event, 'Content-Disposition', 'attachment; filename="production_report.csv"')
    return csv
})
