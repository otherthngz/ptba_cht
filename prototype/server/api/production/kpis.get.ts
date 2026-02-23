import { trips } from '~~/server/utils/store'

export default defineEventHandler(() => {
    // Filter out duplicates (using snake_case properties from store.ts)
    const valid = trips.filter(t => !t.is_duplicate_flagged)

    const confirmed = valid.filter(t => t.tonnage_status === 'CONFIRMED')
    const pending = valid.filter(t => t.tonnage_status === 'PENDING')
    const manual = valid.filter(t => t.tonnage_status === 'MANUAL')

    const totalConfirmed = confirmed.reduce((sum: number, t) => sum + (t.tonnage_primary || 0), 0)
    const totalManual = manual.reduce((sum: number, t) => sum + (t.tonnage_primary || 0), 0)
    const totalPending = pending.reduce((sum: number, t) => sum + (t.tonnage_primary || 0), 0)

    const withTonnageCount = confirmed.length + manual.length
    const coveragePct = valid.length ? Math.round((withTonnageCount / valid.length) * 1000) / 10 : 0

    return {
        total_trips: valid.length,
        tonnage: {
            confirmed: totalConfirmed,
            manual: totalManual,
            pending: totalPending,
            total: totalConfirmed + totalManual // Pending doesn't count towards 'actual' moved yet usually
        },
        coverage: {
            percent: coveragePct,
            description: `${withTonnageCount} of ${valid.length} trips have tonnage`
        }
    }
})
