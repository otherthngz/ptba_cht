import { assignments, locations } from '~~/server/utils/store'

export default defineEventHandler(() => {
    return assignments.map(a => {
        const dumpLoc = locations.find(l => l.location_id === a.dumping_location_id)
        const loadLoc = locations.find(l => l.location_id === a.loading_location_id)
        return {
            assignment_id: a.assignment_id,
            unit_id: a.unit_id,
            operator_id: a.operator_id,
            shift_id: a.shift_id,
            start_ts: a.start_ts,
            end_ts: a.end_ts,
            status: a.status,
            loading_location_id: a.loading_location_id,
            dumping_location_id: a.dumping_location_id,
            loading_location_name: loadLoc?.location_name ?? null,
            dumping_location_name: dumpLoc?.location_name ?? null,
            notes: a.notes ?? null,
        }
    })
})
