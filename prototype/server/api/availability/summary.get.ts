import { units, assignments } from '~~/server/utils/store'

export default defineEventHandler(() => {
    // Mock parameters for shift duration
    const totalHours = 12

    let totalPa = 0
    let totalUa = 0
    let totalRun = 0
    let totalDown = 0
    let totalStandby = 0
    let activeUnitCount = 0

    const rows = units.map(u => {
        // 1. Determine State Hours (Mocked logic based on current state)
        // In real app, this comes from an event log summation.
        // Here we project current state over the 12h shift for demonstration.

        let running = 0
        let breakdown = 0
        let standby = 0

        const activeAsn = assignments.find(a => a.unit_id === u.unit_id && a.status === 'IN_PROGRESS')

        if (!u.is_active) {
            // Unit is down (Breakdown)
            breakdown = totalHours
        } else if (activeAsn) {
            // Unit is working
            running = 10 // Assume mostly working
            standby = 2  // Some delays
        } else {
            // Unit is active but no assignment (Standby)
            standby = totalHours
        }

        // 2. Calculate PA / UA
        // PA = (Total - Breakdown) / Total
        // UA = Running / (Total - Breakdown)
        const available = totalHours - breakdown
        const pa = (available / totalHours) * 100
        const ua = available > 0 ? (running / available) * 100 : 0

        // 3. Data Completeness (Mock logic)
        // High: Active + Recent Assignment
        // Medium: Active + No Assignment
        // Low: Inactive or missing generic fields
        let completeness = 'HIGH'
        if (!activeAsn && u.is_active) completeness = 'MEDIUM'
        if (!u.is_active && !u.notes) completeness = 'LOW' // Down without notes is bad data

        // Aggregation
        if (u.unit_type === 'DUMP_TRUCK') { // Only aggregate DTs for main KPIs usually? Or all? Let's do all for prototype.
            totalRun += running
            totalDown += breakdown
            totalStandby += standby
            totalPa += pa
            totalUa += ua
            activeUnitCount++
        }

        return {
            unitId: u.unit_id,
            unitName: u.unit_name,
            type: u.unit_type,
            paLike: Math.round(pa * 10) / 10,
            uaLike: Math.round(ua * 10) / 10,
            runningHours: running,
            breakdownHours: breakdown,
            standbyHours: standby,
            dataCompleteness: completeness
        }
    })

    // KPI Averages
    const avgPa = activeUnitCount ? totalPa / activeUnitCount : 0
    const avgUa = activeUnitCount ? totalUa / activeUnitCount : 0

    // Completeness Aggregate
    const highCount = rows.filter(r => r.dataCompleteness === 'HIGH').length
    const completenessScore = Math.round((highCount / rows.length) * 100)

    return {
        aggregate: {
            paLike: Math.round(avgPa * 10) / 10,
            uaLike: Math.round(avgUa * 10) / 10,
            runningHours: totalRun,
            breakdownHours: totalDown,
            standbyHours: totalStandby,
            dataCompleteness: completenessScore
        },
        rows
    }
})
