import { units, assignments, locations } from '~~/server/utils/store'

export default defineEventHandler(() => {
    const now = new Date()

    const unitRows = units.map(u => {
        // Find active assignment
        const activeAsn = assignments.find(a => a.unit_id === u.unit_id && (a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS'))

        // Stale logic
        const isStale = !u.is_active && parseInt(u.unit_id.replace(/\D/g, '')) > 18

        // Build current_assignment object matching template expectation
        let current_assignment: { dumping_location_name: string } | null = null
        if (activeAsn) {
            const dumpLoc = locations.find(l => l.location_id === activeAsn.dumping_location_id)?.location_name || activeAsn.dumping_location_id
            current_assignment = { dumping_location_name: dumpLoc }
        }

        // Derive data_status
        const data_status = isStale ? 'STALE' : (u.is_active ? 'OK' : 'NO_DATA')

        return {
            unit_id: u.unit_id,
            unit_name: u.unit_name,
            unit_type: u.unit_type,
            ownership: u.ownership,
            last_activity: activeAsn ? 'HAULING' : (u.is_active ? 'IDLE' : 'STANDBY'),
            last_update_ts: activeAsn ? now.toISOString() : new Date(now.getTime() - 1000 * 60 * (isStale ? 20 : 5)).toISOString(),
            current_assignment,
            data_status,
        }
    })

    return unitRows
})
