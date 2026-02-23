import { auditLogs } from '~~/server/utils/store'

export default defineEventHandler((event) => {
    let csv = 'LogID,Timestamp,Actor,Action,Entity,EntityID,Reason,Changes\n'

    const sorted = [...auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    for (const log of sorted) {
        const line = [
            log.log_id,
            log.timestamp,
            log.actor,
            log.action,
            log.entity_type,
            log.entity_id,
            log.reason || '',
            `Changed ${Object.keys(log.payload_after || {}).join(', ')}`
        ].map(v => `"${v}"`).join(',')

        csv += line + '\n'
    }

    setResponseHeader(event, 'Content-Type', 'text/csv')
    setResponseHeader(event, 'Content-Disposition', 'attachment; filename="audit_log.csv"')
    return csv
})
