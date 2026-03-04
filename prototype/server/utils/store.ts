// ── Types ─────────────────────────────────────────────────────────────

export type UnitType = 'DUMP_TRUCK' | 'LOADER' | 'EXCAVATOR' | 'DOZER' | 'SUPPORT'
export type UnitBadge = 'DT30' | 'DT40' | 'EX' | 'DZ' | 'SP'
export type Ownership = 'OWN' | 'RENTAL'
export type TonnageStatus = 'CONFIRMED' | 'PENDING' | 'MANUAL'
export type AssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type IssueStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED'
export type TripStage = 'ASSIGNED' | 'LOADING' | 'HAULING' | 'DUMPING' | 'AWAITING_CONFIRM' | 'COMPLETED'

export interface Unit {
    unit_id: string
    unit_name: string
    unit_type: UnitType
    badge: UnitBadge
    spec: string
    ownership: Ownership
    vendor_name: string | null
    capacity_ton: number | null
    is_active: boolean
    notes: string | null
}

export interface Location {
    location_id: string
    location_name: string
    location_area: string
    location_type: 'LOADING' | 'DUMPING' | 'JETTY' | 'WORKSHOP' | 'STOCKPILE'
    location_role: 'LOADING' | 'DUMPING'
    is_active: boolean
}

export interface Shift {
    shift_id: string
    shift_name: string
    start_time: string
    end_time: string
    timezone: string
    is_active: boolean
}

export interface TonnageHistory {
    source: 'IOT' | 'MANUAL_ENTRY' | 'SYSTEM_ADJUSTMENT'
    value: number | null
    status: TonnageStatus
    recorded_at: string
    actor?: string
    reason?: string
}

export interface Trip {
    trip_id: string
    unit_id: string
    unit_name: string
    badge: UnitBadge
    spec: string
    assignment_id: string | null
    loading_location_id: string
    dumping_location_id: string
    loading_location_name: string
    dumping_location_name: string
    loading_area: string
    dumping_area: string
    shift_id: string
    depart_load_ts: string | null
    arrive_load_ts: string | null
    load_start_ts: string | null
    load_end_ts: string | null
    depart_dump_ts: string | null
    arrive_dump_ts: string | null
    dump_start_ts: string | null
    dump_end_ts: string | null
    tonnage_primary: number | null
    tonnage_status: TonnageStatus
    tonnage_history: TonnageHistory[]
    is_duplicate_flagged: boolean
    stage: TripStage
    pending_since: string | null
    pending_reason: string | null
}

export interface Assignment {
    assignment_id: string
    unit_id: string
    operator_id: string | null
    shift_id: string
    start_ts: string
    end_ts: string | null
    status: AssignmentStatus
    loading_location_id: string
    dumping_location_id: string
    notes: string | null
}

export interface Issue {
    issue_id: string
    issue_type: string
    category: string
    severity: IssueSeverity
    status: IssueStatus
    linked_entity_type: 'UNIT' | 'TRIP' | 'ASSIGNMENT'
    linked_entity_id: string
    unit_id: string
    unit_name: string
    trip_id: string | null
    detail: string
    evidence: Record<string, any>
    rule_threshold: string
    created_at: string
    updated_at: string
    resolved_by: string | null
    resolved_at: string | null
    resolution_note: string | null
    pic: string | null
}

export interface AuditLog {
    log_id: string
    timestamp: string
    actor: string
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TRANSITION'
    entity_type: string
    entity_id: string
    reason: string | null
    payload_before: any
    payload_after: any
}

// ── State ─────────────────────────────────────────────────────────────

export const units: Unit[] = []
export const locations: Location[] = []
export const shifts: Shift[] = []
export const trips: Trip[] = []
export const assignments: Assignment[] = []
export const issues: Issue[] = []
export const auditLogs: AuditLog[] = []

// ── Helpers ────────────────────────────────────────────────────────
const counters: Record<string, number> = {}
export function nextId(prefix: string): string {
    if (!counters[prefix]) counters[prefix] = 0
    counters[prefix]++
    return `${prefix}-${String(counters[prefix]).padStart(3, '0')}`
}

const seedNow = new Date()
function ts(minutesOffset: number = 0): string {
    return new Date(seedNow.getTime() + minutesOffset * 60000).toISOString()
}

function rnd(min: number, max: number) { return min + Math.random() * (max - min) }
function rndInt(min: number, max: number) { return Math.floor(rnd(min, max + 1)) }

// ── Simulation ────────────────────────────────────────────────────
export let tickCount = 0

export function simulateTick() {
    tickCount++
    const n = new Date()

    const activeAsn = assignments.filter(a => a.status === 'IN_PROGRESS')
    if (activeAsn.length > 2 && tickCount % 3 === 0) {
        const a = activeAsn[tickCount % activeAsn.length]!
        a.status = 'COMPLETED'
        a.end_ts = n.toISOString()
    }

    const pendingTrips = trips.filter(t => t.tonnage_status === 'PENDING')
    if (pendingTrips.length > 0 && tickCount % 2 === 0) {
        const t = pendingTrips[tickCount % pendingTrips.length]!
        t.tonnage_status = 'CONFIRMED'
        t.tonnage_primary = Number((25 + Math.random() * 15).toFixed(2))
        t.stage = 'COMPLETED'
        t.tonnage_history.push({ source: 'IOT', value: t.tonnage_primary, status: 'CONFIRMED', recorded_at: n.toISOString() })
    }

    if (tickCount % 5 === 0 && issues.length < 80) {
        const types = ['PENDING_TOO_LONG', 'DUPLICATE_TRIP', 'TONNAGE_OUTLIER', 'MISSING_TIMESTAMP', 'STALE_UPDATE']
        const cats = ['TONNAGE', 'TIMING', 'DATA', 'SYSTEM']
        const sevs: IssueSeverity[] = ['HIGH', 'MEDIUM', 'LOW']
        const u = units[tickCount % units.length]!
        issues.push({
            issue_id: nextId('ISS'), issue_type: types[tickCount % types.length]!,
            category: cats[tickCount % cats.length]!,
            severity: sevs[tickCount % sevs.length]!, status: 'OPEN',
            linked_entity_type: 'UNIT', linked_entity_id: u.unit_id,
            unit_id: u.unit_id, unit_name: u.unit_name, trip_id: null,
            detail: `Auto-detected anomaly for ${u.unit_id}`,
            evidence: { tick: tickCount }, rule_threshold: 'Auto',
            created_at: n.toISOString(), updated_at: n.toISOString(),
            resolved_by: null, resolved_at: null, resolution_note: null,
            pic: null
        })
    }

    return { tick: tickCount, pendingResolved: tickCount % 2 === 0 ? 1 : 0 }
}

// ── Seeding ───────────────────────────────────────────────────────────

function seed() {
    // ── 1. Units (89 total) ──
    // DT30 badge: 30T dump trucks, spec FMX420 (own) or FMX460 (rental) — 45 units
    for (let i = 1; i <= 30; i++) {
        const own = i <= 20
        units.push({
            unit_id: `DT30-${String(i).padStart(3, '0')}`,
            unit_name: `DT30-${String(i).padStart(3, '0')}`,
            unit_type: 'DUMP_TRUCK', badge: 'DT30',
            spec: own ? 'Volvo FMX420' : 'Volvo FMX460',
            ownership: own ? 'OWN' : 'RENTAL',
            vendor_name: own ? null : (i % 2 === 0 ? 'Vendor A' : 'Vendor B'),
            capacity_ton: 30, is_active: i <= 27, notes: null
        })
    }
    // DT40 badge: 40T dump trucks, spec FMX460 — 32 units
    for (let i = 1; i <= 32; i++) {
        const own = i <= 18
        units.push({
            unit_id: `DT40-${String(i).padStart(3, '0')}`,
            unit_name: `DT40-${String(i).padStart(3, '0')}`,
            unit_type: 'DUMP_TRUCK', badge: 'DT40',
            spec: 'Volvo FMX460',
            ownership: own ? 'OWN' : 'RENTAL',
            vendor_name: own ? null : (i % 2 === 0 ? 'Vendor A' : 'Vendor C'),
            capacity_ton: 40, is_active: i <= 30, notes: null
        })
    }
    // EX badge: Excavator — EC480DL and PC500 — 6 units
    const exSpecs = ['Volvo EC480DL', 'Komatsu PC500']
    for (let i = 1; i <= 6; i++) {
        units.push({
            unit_id: `EX-${String(i).padStart(3, '0')}`,
            unit_name: `EX-${String(i).padStart(3, '0')}`,
            unit_type: 'EXCAVATOR', badge: 'EX',
            spec: exSpecs[(i - 1) % 2]!,
            ownership: 'OWN', vendor_name: null,
            capacity_ton: null, is_active: i <= 5, notes: null
        })
    }
    // DZ badge: Dozer — D6R — 6 units
    for (let i = 1; i <= 6; i++) {
        units.push({
            unit_id: `DZ-${String(i).padStart(3, '0')}`,
            unit_name: `DZ-${String(i).padStart(3, '0')}`,
            unit_type: 'DOZER', badge: 'DZ',
            spec: 'CAT D6R',
            ownership: 'OWN', vendor_name: null,
            capacity_ton: null, is_active: true, notes: null
        })
    }
    // SP: Support — Fuel Truck, Water Tank — 15 units (to reach 89 total: 30+32+6+6+15=89)
    const spSpecs = ['Fuel Truck', 'Water Tank', 'Service Truck']
    for (let i = 1; i <= 15; i++) {
        units.push({
            unit_id: `SP-${String(i).padStart(3, '0')}`,
            unit_name: `SP-${String(i).padStart(3, '0')}`,
            unit_type: 'SUPPORT', badge: 'SP',
            spec: spSpecs[(i - 1) % 3]!,
            ownership: 'OWN', vendor_name: null,
            capacity_ton: null, is_active: i <= 12, notes: null
        })
    }

    // ── 2. Locations ──
    const areas = ['Pit A', 'Pit B', 'Pit C', 'ROM', 'Jetty']
    // 8 loading pits across 3 areas
    const pitDefs = [
        { id: 'PIT-A1', name: 'Pit A – Face 1', area: 'Pit A' },
        { id: 'PIT-A2', name: 'Pit A – Face 2', area: 'Pit A' },
        { id: 'PIT-A3', name: 'Pit A – Face 3', area: 'Pit A' },
        { id: 'PIT-B1', name: 'Pit B – Face 1', area: 'Pit B' },
        { id: 'PIT-B2', name: 'Pit B – Face 2', area: 'Pit B' },
        { id: 'PIT-C1', name: 'Pit C – Face 1', area: 'Pit C' },
        { id: 'PIT-C2', name: 'Pit C – Face 2', area: 'Pit C' },
        { id: 'PIT-C3', name: 'Pit C – Face 3', area: 'Pit C' },
    ]
    pitDefs.forEach(p => locations.push({ location_id: p.id, location_name: p.name, location_area: p.area, location_type: 'LOADING', location_role: 'LOADING', is_active: true }))

    // 2 jetties
    locations.push(
        { location_id: 'JETTY-01', location_name: 'Jetty Point A', location_area: 'Jetty', location_type: 'JETTY', location_role: 'DUMPING', is_active: true },
        { location_id: 'JETTY-02', location_name: 'Jetty Point B', location_area: 'Jetty', location_type: 'JETTY', location_role: 'DUMPING', is_active: true }
    )
    // 10 ROM stockpiles
    for (let i = 1; i <= 10; i++) {
        locations.push({ location_id: `ROM-${String(i).padStart(2, '0')}`, location_name: `ROM Stockpile ${i}`, location_area: 'ROM', location_type: 'STOCKPILE', location_role: 'DUMPING', is_active: true })
    }

    // ── 3. Shifts ──
    shifts.push(
        { shift_id: 'SHIFT-1', shift_name: 'Shift 1 (Pagi)', start_time: '06:00', end_time: '18:00', timezone: 'Asia/Jakarta', is_active: true },
        { shift_id: 'SHIFT-2', shift_name: 'Shift 2 (Malam)', start_time: '18:00', end_time: '06:00', timezone: 'Asia/Jakarta', is_active: true }
    )

    // ── 4. Assignments (DT units only) ──
    const dtUnits = units.filter(u => u.unit_type === 'DUMP_TRUCK' && u.is_active)
    const loadLocs = locations.filter(l => l.location_role === 'LOADING')
    const dumpLocs = locations.filter(l => l.location_role === 'DUMPING')

    dtUnits.forEach((u, idx) => {
        const shiftId = idx % 2 === 0 ? 'SHIFT-1' : 'SHIFT-2'
        assignments.push({
            assignment_id: nextId('ASN'), unit_id: u.unit_id, operator_id: `OP-${100 + idx}`,
            shift_id: shiftId, start_ts: ts(-480), end_ts: null,
            status: idx < Math.floor(dtUnits.length * 0.6) ? 'IN_PROGRESS' : 'ASSIGNED',
            loading_location_id: loadLocs[idx % loadLocs.length]!.location_id,
            dumping_location_id: dumpLocs[idx % dumpLocs.length]!.location_id,
            notes: idx % 5 === 0 ? 'Priority load' : null
        })
    })

    // ── 5. Trips (250) with stage data ──
    const pendingReasons = [
        'MISSING_IOT_READING', 'SENSOR_TIMEOUT', 'AWAITING_MANUAL_ENTRY',
        'SYSTEM_DELAY', 'CALIBRATION_MISMATCH'
    ]
    const dtAll = units.filter(u => u.unit_type === 'DUMP_TRUCK')
    let tCount = 0
    while (tCount < 250) {
        const unit = dtAll[tCount % dtAll.length]!
        const loadLoc = loadLocs[rndInt(0, loadLocs.length - 1)]!
        const dumpLoc = dumpLocs[rndInt(0, dumpLocs.length - 1)]!
        const shiftId = tCount % 2 === 0 ? 'SHIFT-1' : 'SHIFT-2'

        // Timestamps in minutes offset from now
        const tripEnd = -(tCount * 1.5)
        const loadStart = tripEnd - rnd(15, 25)
        const loadDur = rnd(8, 15)
        const haulDur = rnd(10, 20)
        const dumpDur = rnd(5, 10)

        const rand = Math.random()
        let tStatus: TonnageStatus = 'CONFIRMED'
        let tPrimary: number | null = Number(rnd(unit.capacity_ton! * 0.8, unit.capacity_ton! * 1.0).toFixed(2))
        const tHistory: TonnageHistory[] = []
        let stage: TripStage = 'COMPLETED'
        let pendingSince: string | null = null
        let pendingReason: string | null = null

        if (rand > 0.88) {
            tStatus = 'MANUAL'
            stage = 'COMPLETED'
            tHistory.push({ source: 'MANUAL_ENTRY', value: tPrimary, status: 'MANUAL', recorded_at: ts(tripEnd), actor: 'Checker', reason: 'Sensor offline' })
        } else if (rand > 0.72) {
            tStatus = 'PENDING'; tPrimary = null
            stage = 'AWAITING_CONFIRM'
            pendingSince = ts(tripEnd)
            pendingReason = pendingReasons[tCount % pendingReasons.length]!
            tHistory.push({ source: 'IOT', value: null, status: 'PENDING', recorded_at: ts(tripEnd) })
        } else {
            tHistory.push({ source: 'IOT', value: tPrimary, status: 'CONFIRMED', recorded_at: ts(tripEnd) })
        }

        trips.push({
            trip_id: nextId('TRP'),
            unit_id: unit.unit_id, unit_name: unit.unit_name,
            badge: unit.badge, spec: unit.spec,
            assignment_id: null, shift_id: shiftId,
            loading_location_id: loadLoc.location_id,
            dumping_location_id: dumpLoc.location_id,
            loading_location_name: loadLoc.location_name,
            dumping_location_name: dumpLoc.location_name,
            loading_area: loadLoc.location_area,
            dumping_area: dumpLoc.location_area,
            depart_load_ts: ts(loadStart),
            arrive_load_ts: ts(loadStart + 4),
            load_start_ts: ts(loadStart + 5),
            load_end_ts: ts(loadStart + 5 + loadDur),
            depart_dump_ts: ts(loadStart + 5 + loadDur + 2),
            arrive_dump_ts: ts(tripEnd - dumpDur - 2),
            dump_start_ts: ts(tripEnd - dumpDur),
            dump_end_ts: ts(tripEnd),
            tonnage_primary: tPrimary,
            tonnage_status: tStatus,
            tonnage_history: tHistory,
            is_duplicate_flagged: false,
            stage, pending_since: pendingSince, pending_reason: pendingReason
        })
        tCount++
    }

    // ── 6. Issues (40) with category + pic ──
    const issueTypes = ['PENDING_TOO_LONG', 'DUPLICATE_TRIP', 'TONNAGE_OUTLIER', 'MISSING_TIMESTAMP', 'STALE_UPDATE']
    const issueCategories = ['TONNAGE', 'TIMING', 'DATA', 'SYSTEM']
    const severities: IssueSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
    const issStatuses: IssueStatus[] = ['OPEN', 'OPEN', 'OPEN', 'IN_REVIEW', 'IN_REVIEW', 'RESOLVED']
    const pics = ['Ahmad R.', 'Budi S.', 'Citra W.', 'Dewi A.', null]

    for (let i = 0; i < 40; i++) {
        const u = units[i % units.length]!
        const t = trips[i % trips.length]!
        const it = issueTypes[i % issueTypes.length]!
        const sv = severities[i % severities.length]!
        const st = issStatuses[i % issStatuses.length]!
        const cat = issueCategories[i % issueCategories.length]!
        issues.push({
            issue_id: nextId('ISS'), issue_type: it, category: cat, severity: sv, status: st,
            linked_entity_type: it === 'STALE_UPDATE' ? 'UNIT' : 'TRIP',
            linked_entity_id: it === 'STALE_UPDATE' ? u.unit_id : t.trip_id,
            unit_id: u.unit_id, unit_name: u.unit_name,
            trip_id: it === 'STALE_UPDATE' ? null : t.trip_id,
            detail: `${it.replace(/_/g, ' ')} terdeteksi untuk ${u.unit_id}`,
            evidence: { value: 40 + i, threshold: 38 },
            rule_threshold: it === 'TONNAGE_OUTLIER' ? '2 std dev' : '30 menit',
            created_at: ts(-(i * 15)), updated_at: ts(-(i * 10)),
            resolved_by: st === 'RESOLVED' ? 'Supervisor' : null,
            resolved_at: st === 'RESOLVED' ? ts(-(i * 5)) : null,
            resolution_note: st === 'RESOLVED' ? 'Diverifikasi dan ditutup' : null,
            pic: pics[i % pics.length] ?? null
        })
    }

    // ── 7. Audit Logs ──
    const actors = ['Dispatcher', 'Supervisor', 'System', 'Checker']
    for (let i = 0; i < 15; i++) {
        const a = assignments[i % assignments.length]!
        auditLogs.push({ log_id: nextId('AUD'), timestamp: ts(-(i * 20)), actor: actors[i % 4]!, action: i < 8 ? 'CREATE' : 'UPDATE', entity_type: 'ASSIGNMENT', entity_id: a.assignment_id, reason: i < 8 ? 'Dispatch baru' : 'Update status', payload_before: i < 8 ? null : { status: 'ASSIGNED' }, payload_after: { status: i < 8 ? 'ASSIGNED' : 'IN_PROGRESS' } })
    }
    const manualTrps = trips.filter(t => t.tonnage_status === 'MANUAL')
    for (let i = 0; i < Math.min(12, manualTrps.length); i++) {
        const t = manualTrps[i]!
        auditLogs.push({ log_id: nextId('AUD'), timestamp: ts(-(i * 25)), actor: 'Checker', action: 'UPDATE', entity_type: 'TRIP', entity_id: t.trip_id, reason: 'Manual tonnage — sensor offline', payload_before: { tonnage_status: 'PENDING', tonnage_primary: null }, payload_after: { tonnage_status: 'MANUAL', tonnage_primary: t.tonnage_primary } })
    }
    const resolvedIss = issues.filter(i => i.status === 'RESOLVED')
    for (let i = 0; i < Math.min(10, resolvedIss.length); i++) {
        const iss = resolvedIss[i]!
        auditLogs.push({ log_id: nextId('AUD'), timestamp: ts(-(i * 30)), actor: 'Supervisor', action: 'TRANSITION', entity_type: 'ISSUE', entity_id: iss.issue_id, reason: 'Isu diselesaikan', payload_before: { status: 'IN_REVIEW' }, payload_after: { status: 'RESOLVED' } })
    }
    auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    console.log(`[Store] Seeded ${units.length} units, ${locations.length} locations, ${trips.length} trips, ${assignments.length} assignments, ${issues.length} issues, ${auditLogs.length} audit logs.`)
}

seed()
