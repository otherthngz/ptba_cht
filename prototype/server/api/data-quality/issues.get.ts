import { issues } from '~~/server/utils/store'
import { evaluateAnomalies } from '~~/server/utils/anomalies'
// Note: importing from anomalies triggers engine run if needed, but evaluateAnomalies is key.
// Actually we should import `issues` from store, but ensure engine runs.
// `anomalies.ts` auto-runs on load.

export default defineEventHandler(() => {
    // Re-evaluate on every request? Naive but ensures freshness.
    evaluateAnomalies()

    // Sort by created desc
    const sorted = [...issues].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return {
        items: sorted,
        total: sorted.length
    }
})
