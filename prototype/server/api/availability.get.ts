import { units, assignments } from '~~/server/utils/store'

export default defineEventHandler(() => {
    // Mock availability data matching UI_SPEC_TABLES.md
    // Since we don't have a time-series DB, we generate plausible stats based on current status.

    return units.map(u => {
        // Determine state flavor
        const isDown = !u.is_active
        const isWorking = assignments.some(a => a.unit_id === u.unit_id && (a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS'))

        // Total shift minutes (e.g. 10 hours so far)
        const totalMin = 600

        let breakdown = isDown ? 600 : 0
        let running = isWorking ? 450 : 0
        let standby = (!isDown && !isWorking) ? 500 : 50
        let delay = isWorking ? 100 : 50

        if (isDown) {
            running = 0; standby = 0; delay = 0;
        }

        // Normalize to totalMin roughly
        // This is just a mock for the prototype UI
        const pa = ((totalMin - breakdown) / totalMin) * 100
        const ua = ((running) / (totalMin - breakdown)) * 100 || 0

        return {
            unit_id: u.unit_id,
            unit_name: u.unit_name,
            running_min: running,
            standby_min: standby,
            delay_min: delay,
            breakdown_min: breakdown,
            pa_pct: Math.round(pa * 10) / 10,
            ua_pct: Math.round(ua * 10) / 10,
            completeness_pct: 95,
            completeness_label: 'HIGH',
            is_manual_adjusted: false
        }
    })
})
