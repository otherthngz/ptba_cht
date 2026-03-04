import { units, trips, assignments } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const fBadge = query.badge as string | undefined
    const fShift = query.shift as string | undefined
    const fUnit = query.unit as string | undefined

    const targetUnits = units.filter(u =>
        (!fBadge || u.badge === fBadge) &&
        (!fUnit || u.unit_id === fUnit)
    )

    return targetUnits.map(u => {
        const isDown = !u.is_active
        const isWorking = assignments.some(a => a.unit_id === u.unit_id && (a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS'))
        const unitTrips = trips.filter(t => t.unit_id === u.unit_id && (!fShift || t.shift_id === fShift))
        const tripCount = unitTrips.length

        // Simulate 10-hour shift minutes
        const totalMin = 600
        const loadingMin = isWorking ? tripCount * 12 : 0
        const haulingMin = isWorking ? tripCount * 18 : 0
        const dumpingMin = isWorking ? tripCount * 8 : 0
        const p2hMin = isDown ? 0 : 30
        const breakdownMin = isDown ? 400 : (Math.random() > 0.85 ? 60 : 0)
        const delayMin = isWorking ? 60 : 30
        const standbyMin = isDown ? 0 : Math.max(0, totalMin - loadingMin - haulingMin - dumpingMin - breakdownMin - delayMin - p2hMin)

        const availableMin = totalMin - breakdownMin
        const runningMin = loadingMin + haulingMin + dumpingMin
        const pa = availableMin > 0 ? (availableMin / totalMin) * 100 : 0
        const ua = availableMin > 0 ? (runningMin / availableMin) * 100 : 0

        return {
            unit_id: u.unit_id,
            unit_name: u.unit_name,
            unit_type: u.unit_type,
            badge: u.badge,
            spec: u.spec,
            ownership: u.ownership,
            is_active: u.is_active,
            trip_count: tripCount,
            pa_pct: Math.round(Math.min(100, pa) * 10) / 10,
            ua_pct: Math.round(Math.min(100, ua) * 10) / 10,
            running_min: Math.round(runningMin),
            standby_min: Math.round(standbyMin),
            delay_min: Math.round(delayMin),
            breakdown_min: Math.round(breakdownMin),
            p2h_min: Math.round(p2hMin),
            loading_min: Math.round(loadingMin),
            hauling_min: Math.round(haulingMin),
            dumping_min: Math.round(dumpingMin),
            activity_mix: {
                LOADING: Math.round(loadingMin),
                HAULING: Math.round(haulingMin),
                DUMPING: Math.round(dumpingMin),
                STANDBY: Math.round(standbyMin),
                BREAKDOWN: Math.round(breakdownMin),
                DELAY: Math.round(delayMin),
                P2H: Math.round(p2hMin),
            },
            completeness_pct: 95,
        }
    })
})
