import { auditLogs, nextId, type AuditLog } from './store'

export interface AuditInput {
    actor: string
    action: AuditLog['action']
    entity_type: string
    entity_id: string
    reason?: string
    priority?: 'HIGH' | 'NORMAL' // Optional, not in core schema but useful
    payload_before?: any
    payload_after?: any
}

/**
 * Writes an entry to the central audit log.
 * Schema: id, actor, action, entityType, entityId, reason, before, after, createdAt
 */
export function writeAudit(input: AuditInput): AuditLog {
    const entry: AuditLog = {
        log_id: nextId('AUD'),
        timestamp: new Date().toISOString(),
        actor: input.actor,
        action: input.action,
        entity_type: input.entity_type,
        entity_id: input.entity_id,
        reason: input.reason ?? null,
        payload_before: input.payload_before ?? null,
        payload_after: input.payload_after ?? null
    }

    // Unshift to keep newest first
    auditLogs.unshift(entry)

    // Cap log size if needed (optional optimization, keeping implementation simple)
    if (auditLogs.length > 500) {
        auditLogs.pop()
    }

    return entry
}

/**
 * Helper to get audit trail for a specific entity
 */
export function getAuditForEntity(entityType: string, entityId: string): AuditLog[] {
    return auditLogs.filter(a => a.entity_type === entityType && a.entity_id === entityId)
}
