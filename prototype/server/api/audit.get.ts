import { auditLogs } from '~~/server/utils/store'

export default defineEventHandler(() => {
    return {
        items: auditLogs,
        total: auditLogs.length
    }
})
