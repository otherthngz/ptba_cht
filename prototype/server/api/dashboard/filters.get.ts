import { units, locations } from '~~/server/utils/store'

export default defineEventHandler(() => {
    const areas = [...new Set(locations.map(l => l.location_area))].sort()
    const loadingLocs = locations.filter(l => l.location_role === 'LOADING').map(l => ({ id: l.location_id, name: l.location_name, area: l.location_area }))
    const dumpingLocs = locations.filter(l => l.location_role === 'DUMPING').map(l => ({ id: l.location_id, name: l.location_name, area: l.location_area }))
    const badges = [...new Set(units.map(u => u.badge))].sort()
    const specs = [...new Set(units.map(u => u.spec))].sort()
    const unitOptions = units
        .filter(u => u.unit_type === 'DUMP_TRUCK' && u.is_active)
        .map(u => ({ id: u.unit_id, name: u.unit_name, badge: u.badge, spec: u.spec }))

    return { areas, loadingLocs, dumpingLocs, badges, specs, unitOptions }
})
