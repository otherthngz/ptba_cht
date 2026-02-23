import { auditLogs } from '~~/server/utils/store'

export default defineEventHandler(() => {
    return auditLogs
})
