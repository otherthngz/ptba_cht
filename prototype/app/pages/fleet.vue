<script setup lang="ts">
const pageTitle = inject<Ref<string>>('pageTitle')
const toolbarType = inject<Ref<string>>('toolbarType')
onMounted(() => {
  if (pageTitle) pageTitle.value = 'Fleet Board'
  if (toolbarType) toolbarType.value = 'none'
})

// ── Types ──────────────────────────────────────────────────────────
type Badge      = 'DT30' | 'DT40' | 'EX' | 'DZ' | 'SP'
type Activity   = 'HAULING' | 'LOADING' | 'DUMPING' | 'STANDBY' | 'BREAKDOWN' | 'P2H'
type DataStatus = 'OK' | 'Warning' | 'Stale' | 'Offline'
type IssueCategory = 'Breakdown' | 'Device Offline' | 'Data Stale' | 'Assignment Mismatch' | 'Other'
type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type IssueStatus   = 'OPEN' | 'IN_PROGRESS' | 'CLOSED'

interface FleetUnit {
  unit_id: string; unit_name: string; badge: Badge; unit_type: string
  ownership: 'OWN' | 'RENTAL'; vendor_name: string | null; spec: string
  location: string | null; last_activity: Activity; last_update_ts: string
}
interface UnitIssue {
  issue_id: string; unit_id: string; category: IssueCategory
  severity: IssueSeverity; status: IssueStatus; note: string
  created_at: string; closed_at: string | null; close_note: string | null
  notes: Array<{ text: string; at: string }>
}
interface UnitEvent { at: string; event: string }

// ── Helpers ────────────────────────────────────────────────────────
function minsAgo(m: number) { return new Date(Date.now() - m * 60000).toISOString() }

// ── Mock Units (32) ────────────────────────────────────────────────
const MOCK_UNITS: FleetUnit[] = [
  // DT30 (12)
  { unit_id:'DT30-001', unit_name:'DT30-001', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX420', location:'Jetty Point A',  last_activity:'HAULING',   last_update_ts: minsAgo(1)   },
  { unit_id:'DT30-002', unit_name:'DT30-002', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX420', location:'Jetty Point A',  last_activity:'LOADING',   last_update_ts: minsAgo(1.5) },
  { unit_id:'DT30-003', unit_name:'DT30-003', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX420', location:'Jetty Point B',  last_activity:'HAULING',   last_update_ts: minsAgo(3)   },
  { unit_id:'DT30-004', unit_name:'DT30-004', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX420', location:'Jetty Point B',  last_activity:'DUMPING',   last_update_ts: minsAgo(4.5) },
  { unit_id:'DT30-005', unit_name:'DT30-005', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'RENTAL', vendor_name:'Vendor A', spec:'Volvo FMX460', location:'ROM Stockpile 1', last_activity:'HAULING',   last_update_ts: minsAgo(7)   },
  { unit_id:'DT30-006', unit_name:'DT30-006', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'RENTAL', vendor_name:'Vendor A', spec:'Volvo FMX460', location:'ROM Stockpile 1', last_activity:'STANDBY',   last_update_ts: minsAgo(20)  },
  { unit_id:'DT30-007', unit_name:'DT30-007', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX420', location:'ROM Stockpile 2', last_activity:'HAULING',   last_update_ts: minsAgo(1)   },
  { unit_id:'DT30-008', unit_name:'DT30-008', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX420', location:'ROM Stockpile 2', last_activity:'LOADING',   last_update_ts: minsAgo(3.5) },
  { unit_id:'DT30-009', unit_name:'DT30-009', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX420', location:'Pit A Face 1',   last_activity:'HAULING',   last_update_ts: minsAgo(8)   },
  { unit_id:'DT30-010', unit_name:'DT30-010', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX420', location:'Pit A Face 1',   last_activity:'DUMPING',   last_update_ts: minsAgo(1.5) },
  { unit_id:'DT30-011', unit_name:'DT30-011', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'RENTAL', vendor_name:'Vendor B', spec:'Volvo FMX460', location:null,             last_activity:'STANDBY',   last_update_ts: minsAgo(30)  },
  { unit_id:'DT30-012', unit_name:'DT30-012', badge:'DT30', unit_type:'DUMP_TRUCK', ownership:'RENTAL', vendor_name:'Vendor B', spec:'Volvo FMX460', location:'Pit A Face 2',   last_activity:'P2H',       last_update_ts: minsAgo(2.5) },
  // DT40 (10)
  { unit_id:'DT40-001', unit_name:'DT40-001', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX460', location:'Jetty Point A',  last_activity:'HAULING',   last_update_ts: minsAgo(1)   },
  { unit_id:'DT40-002', unit_name:'DT40-002', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX460', location:'Jetty Point A',  last_activity:'LOADING',   last_update_ts: minsAgo(4)   },
  { unit_id:'DT40-003', unit_name:'DT40-003', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX460', location:'Jetty Point B',  last_activity:'HAULING',   last_update_ts: minsAgo(1)   },
  { unit_id:'DT40-004', unit_name:'DT40-004', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'RENTAL', vendor_name:'Vendor C', spec:'Volvo FMX460', location:'Pit A Face 2',   last_activity:'DUMPING',   last_update_ts: minsAgo(6.5) },
  { unit_id:'DT40-005', unit_name:'DT40-005', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'RENTAL', vendor_name:'Vendor C', spec:'Volvo FMX460', location:'Pit B Face 1',   last_activity:'HAULING',   last_update_ts: minsAgo(2)   },
  { unit_id:'DT40-006', unit_name:'DT40-006', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX460', location:'Pit B Face 1',   last_activity:'LOADING',   last_update_ts: minsAgo(9)   },
  { unit_id:'DT40-007', unit_name:'DT40-007', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX460', location:'Pit B Face 2',   last_activity:'HAULING',   last_update_ts: minsAgo(1)   },
  { unit_id:'DT40-008', unit_name:'DT40-008', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX460', location:'Pit B Face 2',   last_activity:'STANDBY',   last_update_ts: minsAgo(25)  },
  { unit_id:'DT40-009', unit_name:'DT40-009', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'OWN',    vendor_name:null,       spec:'Volvo FMX460', location:null,             last_activity:'BREAKDOWN', last_update_ts: minsAgo(45)  },
  { unit_id:'DT40-010', unit_name:'DT40-010', badge:'DT40', unit_type:'DUMP_TRUCK', ownership:'RENTAL', vendor_name:'Vendor C', spec:'Volvo FMX460', location:'ROM Stockpile 1', last_activity:'HAULING',   last_update_ts: minsAgo(1.5) },
  // EX (4)
  { unit_id:'EX-001', unit_name:'EX-001', badge:'EX', unit_type:'EXCAVATOR', ownership:'OWN', vendor_name:null, spec:'Volvo EC480DL', location:'Pit A Face 1',  last_activity:'LOADING',  last_update_ts: minsAgo(1)   },
  { unit_id:'EX-002', unit_name:'EX-002', badge:'EX', unit_type:'EXCAVATOR', ownership:'OWN', vendor_name:null, spec:'Volvo EC480DL', location:'Pit A Face 2',  last_activity:'LOADING',  last_update_ts: minsAgo(3)   },
  { unit_id:'EX-003', unit_name:'EX-003', badge:'EX', unit_type:'EXCAVATOR', ownership:'OWN', vendor_name:null, spec:'Komatsu PC500', location:'Pit B Face 1',  last_activity:'LOADING',  last_update_ts: minsAgo(12)  },
  { unit_id:'EX-004', unit_name:'EX-004', badge:'EX', unit_type:'EXCAVATOR', ownership:'OWN', vendor_name:null, spec:'Komatsu PC500', location:'Pit B Face 2',  last_activity:'STANDBY',  last_update_ts: minsAgo(2)   },
  // DZ (3)
  { unit_id:'DZ-001', unit_name:'DZ-001', badge:'DZ', unit_type:'DOZER', ownership:'OWN', vendor_name:null, spec:'CAT D6R', location:'Pit A Face 1',   last_activity:'STANDBY', last_update_ts: minsAgo(1)   },
  { unit_id:'DZ-002', unit_name:'DZ-002', badge:'DZ', unit_type:'DOZER', ownership:'OWN', vendor_name:null, spec:'CAT D6R', location:'ROM Stockpile 2', last_activity:'STANDBY', last_update_ts: minsAgo(18)  },
  { unit_id:'DZ-003', unit_name:'DZ-003', badge:'DZ', unit_type:'DOZER', ownership:'OWN', vendor_name:null, spec:'CAT D6R', location:null,             last_activity:'P2H',     last_update_ts: minsAgo(2)   },
  // SP (3)
  { unit_id:'SP-001', unit_name:'SP-001', badge:'SP', unit_type:'SUPPORT', ownership:'OWN', vendor_name:null, spec:'Fuel Truck',    location:'Jetty Point A', last_activity:'STANDBY',   last_update_ts: minsAgo(1)   },
  { unit_id:'SP-002', unit_name:'SP-002', badge:'SP', unit_type:'SUPPORT', ownership:'OWN', vendor_name:null, spec:'Water Tank',    location:'Pit A Face 1',  last_activity:'STANDBY',   last_update_ts: minsAgo(4)   },
  { unit_id:'SP-003', unit_name:'SP-003', badge:'SP', unit_type:'SUPPORT', ownership:'OWN', vendor_name:null, spec:'Service Truck', location:null,            last_activity:'BREAKDOWN', last_update_ts: minsAgo(35)  },
]

// ── Reactive issues ──────────────────────────────────────────────
let _issCounter = 8
const issues = ref<UnitIssue[]>([
  { issue_id:'ISS-001', unit_id:'DT30-006', category:'Device Offline',  severity:'CRITICAL', status:'OPEN',        note:'Tidak ada sinyal GPS > 20 mnt',           created_at:minsAgo(20),  closed_at:null,        close_note:null, notes:[] },
  { issue_id:'ISS-002', unit_id:'DT40-009', category:'Breakdown',       severity:'HIGH',     status:'OPEN',        note:'Operator lapor transmisi bermasalah',      created_at:minsAgo(45),  closed_at:null,        close_note:null, notes:[{text:'Menunggu tim mekanik', at:minsAgo(30)}] },
  { issue_id:'ISS-003', unit_id:'DT30-005', category:'Data Stale',      severity:'MEDIUM',   status:'OPEN',        note:'Update data > 5 mnt tertunda',             created_at:minsAgo(10),  closed_at:null,        close_note:null, notes:[] },
  { issue_id:'ISS-004', unit_id:'DT40-008', category:'Device Offline',  severity:'HIGH',     status:'IN_PROGRESS', note:'Modem IoT mati, tim IT investigasi',        created_at:minsAgo(30),  closed_at:null,        close_note:null, notes:[{text:'Tim IT sedang on-site', at:minsAgo(15)}] },
  { issue_id:'ISS-005', unit_id:'EX-003',   category:'Data Stale',      severity:'MEDIUM',   status:'OPEN',        note:'Sensor timeout berulang',                   created_at:minsAgo(15),  closed_at:null,        close_note:null, notes:[] },
  { issue_id:'ISS-006', unit_id:'DZ-002',   category:'Device Offline',  severity:'HIGH',     status:'OPEN',        note:'Tidak ada sinyal > 18 mnt',                 created_at:minsAgo(18),  closed_at:null,        close_note:null, notes:[] },
  { issue_id:'ISS-007', unit_id:'DT30-001', category:'Assignment Mismatch', severity:'LOW',  status:'CLOSED',      note:'Lokasi assignment tidak sesuai GPS',        created_at:minsAgo(120), closed_at:minsAgo(60), close_note:'Sudah dikoreksi', notes:[] },
  { issue_id:'ISS-008', unit_id:'DT40-003', category:'Other',           severity:'LOW',      status:'CLOSED',      note:'Catatan manual dari operator',               created_at:minsAgo(180), closed_at:minsAgo(90), close_note:'Tidak ada tindak lanjut', notes:[] },
])

// ── Event logs ────────────────────────────────────────────────────
const ACT_SEQ: Activity[] = ['HAULING','LOADING','DUMPING','HAULING','P2H','HAULING','LOADING','DUMPING','HAULING','STANDBY']
const eventLogs: Record<string, UnitEvent[]> = {}
MOCK_UNITS.forEach(u => {
  eventLogs[u.unit_id] = ACT_SEQ.map((a, i) => ({
    at: minsAgo((i + 1) * 10),
    event: i === 4 ? `P2H — ${u.unit_id} preflight check` : `Activity: ${a}`
  }))
})

// ── Reactive clock ────────────────────────────────────────────────
const now = ref(Date.now())

// ── Data status ───────────────────────────────────────────────────
function dataStatus(u: FleetUnit): DataStatus {
  const m = (now.value - new Date(u.last_update_ts).getTime()) / 60000
  if (m > 15) return 'Offline'
  if (m > 5)  return 'Stale'
  if (m > 2)  return 'Warning'
  return 'OK'
}

// ── Auto-refresh + error simulation ──────────────────────────────
const autoRefresh     = ref(true)
const lastRefreshTime = ref(new Date().toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit',second:'2-digit'}))
const hasError        = ref(false)

function scheduleError() {
  setTimeout(() => {
    hasError.value = true
    setTimeout(() => { hasError.value = false; scheduleError() }, 5000)
  }, 90000 + Math.random() * 30000)
}

let _rt: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  _rt = setInterval(() => {
    now.value = Date.now()
    if (autoRefresh.value) lastRefreshTime.value = new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
  }, 15000)
  scheduleError()
})
onUnmounted(() => { if (_rt) clearInterval(_rt) })

// ── View ──────────────────────────────────────────────────────────
const view = ref<'kanban'|'table'>('kanban')

// ── Filters ───────────────────────────────────────────────────────
const search          = ref('')
const filterType      = ref('')
const filterOwnership = ref('')
const filterLocation  = ref('')
const filterStatus    = ref('')
const filterActivity  = ref('')

const typeOpts     = [{label:'Dump Truck',value:'DUMP_TRUCK'},{label:'Excavator',value:'EXCAVATOR'},{label:'Dozer',value:'DOZER'},{label:'Support',value:'SUPPORT'}]
const ownerOpts    = [{label:'OWN',value:'OWN'},{label:'RENTAL',value:'RENTAL'}]
const statusOpts   = [{label:'OK',value:'OK'},{label:'Warning',value:'Warning'},{label:'Stale',value:'Stale'},{label:'Offline',value:'Offline'}]
const activityOpts = ['HAULING','LOADING','DUMPING','STANDBY','BREAKDOWN','P2H'].map(a => ({label:a,value:a}))
const locationOpts = computed(() => {
  const locs = [...new Set(MOCK_UNITS.map(u => u.location).filter(Boolean) as string[])].sort()
  return [{label:'Tidak Ada Assignment',value:'__none__'},...locs.map(l=>({label:l,value:l}))]
})

const anyFilter = computed(() => !!(search.value||filterType.value||filterOwnership.value||filterLocation.value||filterStatus.value||filterActivity.value))
function resetFilters() { search.value=''; filterType.value=''; filterOwnership.value=''; filterLocation.value=''; filterStatus.value=''; filterActivity.value='' }

// ── Filtered list ─────────────────────────────────────────────────
const filtered = computed(() => MOCK_UNITS.filter(u => {
  const q = search.value.toLowerCase()
  if (q && !u.unit_id.toLowerCase().includes(q) && !u.unit_name.toLowerCase().includes(q)) return false
  if (filterType.value      && u.unit_type  !== filterType.value) return false
  if (filterOwnership.value && u.ownership  !== filterOwnership.value) return false
  if (filterLocation.value) {
    if (filterLocation.value === '__none__') { if (u.location) return false }
    else if (u.location !== filterLocation.value) return false
  }
  if (filterStatus.value   && dataStatus(u) !== filterStatus.value)   return false
  if (filterActivity.value && u.last_activity !== filterActivity.value) return false
  return true
}))

// ── KPI ───────────────────────────────────────────────────────────
const kpiActive     = computed(() => MOCK_UNITS.filter(u => { const s=dataStatus(u); return s==='OK'||s==='Warning' }).length)
const kpiStale      = computed(() => MOCK_UNITS.filter(u => dataStatus(u)==='Stale').length)
const kpiOffline    = computed(() => MOCK_UNITS.filter(u => dataStatus(u)==='Offline').length)
const kpiOpenIssues = computed(() => issues.value.filter(i => i.status==='OPEN'||i.status==='IN_PROGRESS').length)

// ── Kanban ────────────────────────────────────────────────────────
const LOC_ORDER = ['Jetty Point A','Jetty Point B','ROM Stockpile 1','ROM Stockpile 2','Pit A Face 1','Pit A Face 2','Pit B Face 1','Pit B Face 2']
const kanbanCols = computed(() => {
  const rows: Array<{label:string;loc:string|null;units:FleetUnit[]}> = []
  for (const loc of LOC_ORDER)
    rows.push({label:loc, loc, units:filtered.value.filter(u=>u.location===loc)})
  const extra = [...new Set(filtered.value.map(u=>u.location).filter(Boolean) as string[])].filter(l=>!LOC_ORDER.includes(l))
  for (const loc of extra)
    rows.push({label:loc, loc, units:filtered.value.filter(u=>u.location===loc)})
  rows.push({label:'Tidak Ada Assignment', loc:null, units:filtered.value.filter(u=>!u.location)})
  return rows
})

// ── Table ─────────────────────────────────────────────────────────
const PAGE_SIZE = 10
const tablePage = ref(1)
const sOrd: Record<DataStatus,number> = {Offline:0,Stale:1,Warning:2,OK:3}
const tableSorted = computed(() => [...filtered.value].sort((a,b)=>{
  const d = sOrd[dataStatus(a)] - sOrd[dataStatus(b)]
  if (d!==0) return d
  return new Date(b.last_update_ts).getTime() - new Date(a.last_update_ts).getTime()
}))
const totalPages  = computed(() => Math.max(1, Math.ceil(tableSorted.value.length / PAGE_SIZE)))
const paged       = computed(() => tableSorted.value.slice((tablePage.value-1)*PAGE_SIZE, tablePage.value*PAGE_SIZE))
watch([search,filterType,filterOwnership,filterLocation,filterStatus,filterActivity], () => { tablePage.value=1 })

const tableCols = [
  {accessorKey:'unit_id',    header:'Unit Code'},
  {accessorKey:'badge',      header:'Badge'},
  {accessorKey:'unit_type',  header:'Type'},
  {accessorKey:'ownership',  header:'Ownership'},
  {accessorKey:'location',   header:'Lokasi'},
  {accessorKey:'last_activity', header:'Activity'},
  {accessorKey:'last_update_ts',header:'Last Update'},
  {accessorKey:'_status',    header:'Status'},
  {accessorKey:'_actions',   header:''},
]

// ── Drawer ────────────────────────────────────────────────────────
const drawerOpen = ref(false)
const drawerUnit = ref<FleetUnit|null>(null)
const drawerIssues = computed(() => {
  if (!drawerUnit.value) return {open:[], closed:[]}
  const all = issues.value.filter(i=>i.unit_id===drawerUnit.value!.unit_id)
  return { open: all.filter(i=>i.status!=='CLOSED'), closed: all.filter(i=>i.status==='CLOSED').slice(0,3) }
})
const drawerEvents = computed(() => drawerUnit.value ? (eventLogs[drawerUnit.value.unit_id]??[]) : [])

function openDrawer(u: FleetUnit) {
  drawerUnit.value = u; drawerOpen.value = true
  createOpen.value = false; closeTarget.value = null; noteTarget.value = null
}

// ── Create Issue ──────────────────────────────────────────────────
const createOpen = ref(false)
const issForm = reactive({ category:'' as IssueCategory|'', severity:'' as IssueSeverity|'', note:'' })
const issueCats: IssueCategory[] = ['Breakdown','Device Offline','Data Stale','Assignment Mismatch','Other']
const issueSevs: IssueSeverity[] = ['CRITICAL','HIGH','MEDIUM','LOW']

const dedupError = computed(() => {
  if (!issForm.category || !drawerUnit.value) return ''
  const exists = issues.value.some(i=>i.unit_id===drawerUnit.value!.unit_id && i.category===issForm.category && i.status!=='CLOSED')
  return exists ? `Issue "${issForm.category}" sudah open untuk unit ini.` : ''
})

function submitCreate() {
  if (!drawerUnit.value || !issForm.category || !issForm.severity || dedupError.value) return
  _issCounter++
  issues.value.push({
    issue_id: `ISS-${String(_issCounter).padStart(3,'0')}`,
    unit_id: drawerUnit.value.unit_id, category: issForm.category as IssueCategory,
    severity: issForm.severity as IssueSeverity, status: 'OPEN', note: issForm.note,
    created_at: new Date().toISOString(), closed_at:null, close_note:null, notes:[],
  })
  createOpen.value = false; Object.assign(issForm,{category:'',severity:'',note:''})
}

// ── Close Issue ───────────────────────────────────────────────────
const closeTarget   = ref<string|null>(null)
const closeNoteText = ref('')
function doClose(id: string) {
  const i = issues.value.find(x=>x.issue_id===id); if (!i) return
  i.status='CLOSED'; i.closed_at=new Date().toISOString(); i.close_note=closeNoteText.value
  closeTarget.value=null; closeNoteText.value=''
}

// ── Add Note ──────────────────────────────────────────────────────
const noteTarget = ref<string|null>(null)
const noteText   = ref('')
function doAddNote(id: string) {
  const i = issues.value.find(x=>x.issue_id===id); if (!i||!noteText.value.trim()) return
  i.notes.push({text:noteText.value, at:new Date().toISOString()})
  noteTarget.value=null; noteText.value=''
}

// ── Display helpers ───────────────────────────────────────────────
function timeAgo(iso: string) {
  const d = Math.floor((now.value - new Date(iso).getTime())/60000)
  if (d<1) return 'Baru saja'; if (d<60) return `${d} mnt lalu`; return `${Math.floor(d/60)}j ${d%60}m lalu`
}
function badgeCol(b: Badge)     { const m={DT30:'primary',DT40:'info',EX:'warning',DZ:'success',SP:'neutral'} as const; return m[b] }
function actCol(a: Activity)    { const m={HAULING:'primary',LOADING:'info',DUMPING:'success',STANDBY:'neutral',BREAKDOWN:'error',P2H:'warning'} as const; return m[a] }
function statCol(s: DataStatus) { return s==='OK'?'success':s==='Warning'?'warning':s==='Stale'?'warning':'error' }
function sevCol(s: IssueSeverity){ return s==='CRITICAL'||s==='HIGH'?'error':s==='MEDIUM'?'warning':'neutral' }
function cardBorder(u: FleetUnit){ const s=dataStatus(u); return s==='Offline'?'border-l-[3px] border-l-red-500':s==='Stale'?'border-l-[3px] border-l-amber-400':'' }
function typeLabel(t: string)   { const m:Record<string,string>={DUMP_TRUCK:'DT',EXCAVATOR:'EX',DOZER:'DZ',SUPPORT:'SP',LOADER:'LD'}; return m[t]??t }
</script>

<template>
  <div class="flex flex-col min-h-full">

    <!-- Error Banner -->
    <div v-if="hasError" class="sticky top-0 z-30 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-sm text-amber-800">
      <UIcon name="i-lucide-wifi-off" class="size-4 shrink-0" />
      Data tidak ter-update. Mencoba ulang…
    </div>

    <div class="p-4 flex flex-col gap-4">

      <!-- ── KPI Cards ──────────────────────────────────────────── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <UCard>
          <div class="flex items-start justify-between">
            <div>
              <div class="text-[11px] font-bold tracking-wider uppercase text-(--ui-text-muted)">Active Units</div>
              <div class="text-3xl font-extrabold text-green-500 mt-1">{{ kpiActive }}</div>
              <div class="text-[11px] text-(--ui-text-muted) mt-0.5">OK + Warning (≤5 mnt)</div>
            </div>
            <UIcon name="i-lucide-check-circle-2" class="size-6 text-green-400" />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-start justify-between">
            <div>
              <div class="text-[11px] font-bold tracking-wider uppercase text-(--ui-text-muted)">Stale Units</div>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-3xl font-extrabold text-amber-500">{{ kpiStale }}</span>
                <UBadge v-if="kpiOffline>0" color="error" variant="solid" size="xs">{{ kpiOffline }} Offline</UBadge>
              </div>
              <div class="text-[11px] text-(--ui-text-muted) mt-0.5">update >5 mnt</div>
            </div>
            <UIcon name="i-lucide-clock-alert" class="size-6 text-amber-400" />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-start justify-between">
            <div>
              <div class="text-[11px] font-bold tracking-wider uppercase text-(--ui-text-muted)">Open Issues</div>
              <div class="text-3xl font-extrabold text-red-500 mt-1">{{ kpiOpenIssues }}</div>
              <div class="text-[11px] text-(--ui-text-muted) mt-0.5">Open + In Progress</div>
            </div>
            <UIcon name="i-lucide-alert-triangle" class="size-6 text-red-400" />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-start justify-between">
            <div>
              <div class="text-[11px] font-bold tracking-wider uppercase text-(--ui-text-muted)">Last Refresh</div>
              <div class="text-lg font-bold font-mono mt-1">{{ lastRefreshTime }}</div>
              <div class="text-[11px] text-(--ui-text-muted) mt-0.5">Auto-refresh 15s</div>
            </div>
            <USwitch v-model="autoRefresh" size="sm" />
          </div>
        </UCard>

      </div>

      <!-- ── Filter Bar + View Toggle ───────────────────────────── -->
      <div class="flex items-center gap-2 flex-wrap">
        <UInput v-model="search" placeholder="Cari unit…" icon="i-lucide-search" size="sm" class="w-[150px]" />
        <USelect v-model="filterType"      :items="typeOpts"      label-key="label" value-key="value" placeholder="Type"     size="sm" class="w-[120px]" />
        <USelect v-model="filterOwnership" :items="ownerOpts"     label-key="label" value-key="value" placeholder="Owner"    size="sm" class="w-[100px]" />
        <USelect v-model="filterLocation"  :items="locationOpts"  label-key="label" value-key="value" placeholder="Lokasi"   size="sm" class="w-[160px]" />
        <USelect v-model="filterStatus"    :items="statusOpts"    label-key="label" value-key="value" placeholder="Status"   size="sm" class="w-[110px]" />
        <USelect v-model="filterActivity"  :items="activityOpts"  label-key="label" value-key="value" placeholder="Activity" size="sm" class="w-[120px]" />
        <UButton v-if="anyFilter" label="Reset" icon="i-lucide-x" size="sm" variant="ghost" color="neutral" @click="resetFilters" />

        <!-- View Toggle -->
        <div class="ml-auto flex items-center gap-0.5 rounded-lg border border-(--ui-border) p-0.5">
          <UButton icon="i-lucide-layout-grid" size="xs" :variant="view==='kanban'?'solid':'ghost'" :color="view==='kanban'?'primary':'neutral'" @click="view='kanban'" title="Kanban" />
          <UButton icon="i-lucide-list"        size="xs" :variant="view==='table' ?'solid':'ghost'" :color="view==='table' ?'primary':'neutral'" @click="view='table'"  title="Table" />
        </div>
      </div>

      <!-- ── KANBAN VIEW ────────────────────────────────────────── -->
      <div v-if="view==='kanban'" class="overflow-x-auto pb-3 -mx-1 px-1">
        <div class="flex gap-3" style="min-width:max-content">
          <div v-for="col in kanbanCols" :key="col.label" class="w-56 shrink-0 flex flex-col gap-2">

            <!-- Column header -->
            <div class="flex items-center justify-between px-0.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-(--ui-text-muted) truncate leading-tight">{{ col.label }}</span>
              <UBadge color="neutral" variant="outline" size="xs">{{ col.units.length }}</UBadge>
            </div>

            <!-- Empty column -->
            <div v-if="col.units.length===0" class="rounded-lg border border-dashed border-(--ui-border) py-5 text-center text-xs text-(--ui-text-muted)">
              Tidak ada unit di lokasi ini
            </div>

            <!-- Unit cards -->
            <div
              v-for="u in col.units" :key="u.unit_id"
              class="bg-(--ui-bg) rounded-lg border border-(--ui-border) p-2.5 cursor-pointer hover:shadow-md transition-all select-none"
              :class="cardBorder(u)"
              @click="openDrawer(u)"
            >
              <div class="flex items-start justify-between gap-1 mb-1.5">
                <span class="font-bold font-mono text-sm leading-tight">{{ u.unit_id }}</span>
                <div class="flex items-center gap-0.5 shrink-0">
                  <UBadge :color="badgeCol(u.badge)" variant="solid" size="xs">{{ u.badge }}</UBadge>
                  <UBadge :color="u.ownership==='OWN'?'info':'neutral'" variant="outline" size="xs">{{ u.ownership }}</UBadge>
                </div>
              </div>
              <div class="mb-1.5">
                <UBadge :color="actCol(u.last_activity)" variant="subtle" size="xs">{{ u.last_activity }}</UBadge>
              </div>
              <div class="flex items-center justify-between">
                <UBadge :color="statCol(dataStatus(u))" variant="solid" size="xs">{{ dataStatus(u) }}</UBadge>
                <span class="text-[10px] text-(--ui-text-muted)">{{ timeAgo(u.last_update_ts) }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ── TABLE VIEW ─────────────────────────────────────────── -->
      <template v-else>
        <div v-if="tableSorted.length===0" class="py-14 flex flex-col items-center gap-2 text-(--ui-text-muted)">
          <UIcon name="i-lucide-search-x" class="size-8 opacity-40" />
          <p class="text-sm">Tidak ada unit yang sesuai filter.</p>
          <UButton label="Reset Filter" size="xs" variant="link" @click="resetFilters" />
        </div>
        <template v-else>
          <UTable :data="paged" :columns="tableCols">
            <template #unit_id-cell="{ row }">
              <span class="font-bold font-mono text-sm">{{ (row.original as any).unit_id }}</span>
            </template>
            <template #badge-cell="{ row }">
              <UBadge :color="badgeCol((row.original as any).badge)" variant="solid" size="xs">{{ (row.original as any).badge }}</UBadge>
            </template>
            <template #unit_type-cell="{ row }">
              <span class="text-xs text-(--ui-text-muted)">{{ typeLabel((row.original as any).unit_type) }}</span>
            </template>
            <template #ownership-cell="{ row }">
              <UBadge :color="(row.original as any).ownership==='OWN'?'info':'neutral'" variant="outline" size="xs">{{ (row.original as any).ownership }}</UBadge>
            </template>
            <template #location-cell="{ row }">
              <span v-if="(row.original as any).location" class="text-xs">{{ (row.original as any).location }}</span>
              <span v-else class="text-xs italic text-(--ui-text-muted)">—</span>
            </template>
            <template #last_activity-cell="{ row }">
              <UBadge :color="actCol((row.original as any).last_activity)" variant="subtle" size="xs">{{ (row.original as any).last_activity }}</UBadge>
            </template>
            <template #last_update_ts-cell="{ row }">
              <span class="text-xs">{{ timeAgo((row.original as any).last_update_ts) }}</span>
            </template>
            <template #_status-cell="{ row }">
              <UBadge :color="statCol(dataStatus(row.original as any))" variant="solid" size="xs">{{ dataStatus(row.original as any) }}</UBadge>
            </template>
            <template #_actions-cell="{ row }">
              <div class="flex items-center gap-0.5">
                <UButton icon="i-lucide-panel-right-open" size="xs" variant="ghost" color="neutral" title="Detail" @click.stop="openDrawer(row.original as any)" />
                <UButton icon="i-lucide-circle-alert"    size="xs" variant="ghost" color="neutral" title="Buat Issue" @click.stop="openDrawer(row.original as any); createOpen=true" />
              </div>
            </template>
          </UTable>
          <div v-if="totalPages>1" class="flex justify-center mt-3">
            <UPagination v-model:page="tablePage" :total="tableSorted.length" :items-per-page="PAGE_SIZE" />
          </div>
        </template>
      </template>

    </div>

    <!-- ── UNIT DETAIL DRAWER ────────────────────────────────────── -->
    <USlideover v-model:open="drawerOpen" title="Detail Unit" side="right" class="max-w-md">
      <template #body>
        <div v-if="drawerUnit" class="flex flex-col gap-5 p-1">

          <!-- Header -->
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="font-mono font-bold text-xl">{{ drawerUnit.unit_id }}</div>
              <div class="flex items-center gap-1.5 mt-1">
                <UBadge :color="badgeCol(drawerUnit.badge)" variant="solid">{{ drawerUnit.badge }}</UBadge>
                <UBadge :color="statCol(dataStatus(drawerUnit))" variant="solid">{{ dataStatus(drawerUnit) }}</UBadge>
              </div>
            </div>
            <span class="text-sm text-(--ui-text-muted) shrink-0">{{ timeAgo(drawerUnit.last_update_ts) }}</span>
          </div>

          <!-- Identitas -->
          <div>
            <div class="text-[11px] font-bold uppercase text-(--ui-text-muted) mb-2">Identitas</div>
            <dl class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <dt class="text-(--ui-text-muted)">Type</dt>       <dd>{{ typeLabel(drawerUnit.unit_type) }}</dd>
              <dt class="text-(--ui-text-muted)">Ownership</dt>  <dd><UBadge :color="drawerUnit.ownership==='OWN'?'info':'neutral'" variant="outline" size="xs">{{ drawerUnit.ownership }}</UBadge></dd>
              <dt class="text-(--ui-text-muted)">Spec</dt>       <dd class="text-xs">{{ drawerUnit.spec }}</dd>
              <template v-if="drawerUnit.vendor_name">
                <dt class="text-(--ui-text-muted)">Vendor</dt>   <dd>{{ drawerUnit.vendor_name }}</dd>
              </template>
            </dl>
          </div>

          <!-- Status -->
          <div>
            <div class="text-[11px] font-bold uppercase text-(--ui-text-muted) mb-2">Status Sekarang</div>
            <dl class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <dt class="text-(--ui-text-muted)">Last Activity</dt> <dd><UBadge :color="actCol(drawerUnit.last_activity)" variant="subtle" size="xs">{{ drawerUnit.last_activity }}</UBadge></dd>
              <dt class="text-(--ui-text-muted)">Lokasi</dt>        <dd class="text-xs">{{ drawerUnit.location ?? '—' }}</dd>
              <dt class="text-(--ui-text-muted)">Last Update</dt>   <dd class="text-xs">{{ timeAgo(drawerUnit.last_update_ts) }}</dd>
            </dl>
          </div>

          <!-- Event Log -->
          <div>
            <div class="text-[11px] font-bold uppercase text-(--ui-text-muted) mb-2">10 Event Terakhir</div>
            <div class="flex flex-col gap-1.5">
              <div v-for="(ev,i) in drawerEvents" :key="i" class="flex items-start gap-2 text-xs">
                <span class="font-mono text-(--ui-text-muted) shrink-0 w-20">{{ timeAgo(ev.at) }}</span>
                <span>{{ ev.event }}</span>
              </div>
            </div>
          </div>

          <!-- Issues section -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="text-[11px] font-bold uppercase text-(--ui-text-muted)">Issues</div>
              <UButton v-if="!createOpen" label="Buat Issue" icon="i-lucide-plus" size="xs" color="primary" variant="soft" @click="createOpen=true" />
            </div>

            <!-- Create Issue form -->
            <div v-if="createOpen" class="border border-(--ui-border) rounded-lg p-3 mb-3 flex flex-col gap-2">
              <div class="text-xs font-semibold">Buat Issue Baru</div>
              <USelect v-model="issForm.category" :items="issueCats.map(c=>({label:c,value:c}))" label-key="label" value-key="value" placeholder="Category" size="sm" />
              <USelect v-model="issForm.severity" :items="issueSevs.map(s=>({label:s,value:s}))" label-key="label" value-key="value" placeholder="Severity" size="sm" />
              <UTextarea v-model="issForm.note" placeholder="Catatan (opsional)" size="sm" :rows="2" />
              <p v-if="dedupError" class="text-xs text-red-500">{{ dedupError }}</p>
              <div class="flex gap-2">
                <UButton label="Submit" size="xs" color="primary" :disabled="!issForm.category||!issForm.severity||!!dedupError" @click="submitCreate" />
                <UButton label="Batal"  size="xs" variant="ghost" color="neutral" @click="createOpen=false" />
              </div>
            </div>

            <!-- Empty -->
            <p v-if="drawerIssues.open.length===0&&drawerIssues.closed.length===0" class="text-xs italic text-(--ui-text-muted) py-1">Tidak ada issue untuk unit ini.</p>

            <!-- Open/In-Progress issues -->
            <div v-if="drawerIssues.open.length>0" class="flex flex-col gap-2 mb-4">
              <div class="text-[10px] font-semibold uppercase text-(--ui-text-muted)">Open / In Progress</div>
              <div v-for="iss in drawerIssues.open" :key="iss.issue_id" class="rounded-lg border border-(--ui-border) p-2.5 flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <UBadge :color="sevCol(iss.severity)" variant="solid" size="xs">{{ iss.severity }}</UBadge>
                    <span class="text-xs font-semibold">{{ iss.category }}</span>
                  </div>
                  <span class="text-[10px] text-(--ui-text-muted)">{{ timeAgo(iss.created_at) }}</span>
                </div>
                <p class="text-xs text-(--ui-text-muted)">{{ iss.note }}</p>
                <!-- Notes list -->
                <div v-if="iss.notes.length" class="flex flex-col gap-0.5">
                  <div v-for="(n,ni) in iss.notes" :key="ni" class="text-[10px] text-(--ui-text-muted)">
                    <span class="font-mono">{{ timeAgo(n.at) }}</span>: {{ n.text }}
                  </div>
                </div>
                <!-- Add note inline -->
                <div v-if="noteTarget===iss.issue_id" class="flex gap-1">
                  <UInput v-model="noteText" placeholder="Catatan…" size="xs" class="flex-1" />
                  <UButton label="OK" size="xs" color="primary" @click="doAddNote(iss.issue_id)" />
                  <UButton icon="i-lucide-x" size="xs" variant="ghost" @click="noteTarget=null" />
                </div>
                <!-- Close inline -->
                <div v-if="closeTarget===iss.issue_id" class="flex gap-1">
                  <UInput v-model="closeNoteText" placeholder="Catatan penutupan…" size="xs" class="flex-1" />
                  <UButton label="Tutup" size="xs" color="error" @click="doClose(iss.issue_id)" />
                  <UButton icon="i-lucide-x" size="xs" variant="ghost" @click="closeTarget=null" />
                </div>
                <!-- Action buttons -->
                <div class="flex gap-1.5 pt-0.5">
                  <UButton label="Tutup Issue" size="xs" variant="outline" color="error" @click="closeTarget=iss.issue_id;noteTarget=null" />
                  <UButton label="+ Catatan"   size="xs" variant="ghost"   color="neutral" @click="noteTarget=iss.issue_id;closeTarget=null" />
                </div>
              </div>
            </div>

            <!-- Closed issues (3 recent) -->
            <div v-if="drawerIssues.closed.length>0" class="flex flex-col gap-2">
              <div class="text-[10px] font-semibold uppercase text-(--ui-text-muted)">Closed (3 terbaru)</div>
              <div v-for="iss in drawerIssues.closed" :key="iss.issue_id" class="rounded-lg border border-dashed border-(--ui-border) p-2.5 opacity-70">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <UBadge :color="sevCol(iss.severity)" variant="outline" size="xs">{{ iss.severity }}</UBadge>
                    <span class="text-xs">{{ iss.category }}</span>
                  </div>
                  <span class="text-[10px] text-(--ui-text-muted)">{{ iss.closed_at ? timeAgo(iss.closed_at) : '' }}</span>
                </div>
                <p v-if="iss.close_note" class="text-[10px] italic text-(--ui-text-muted) mt-0.5">{{ iss.close_note }}</p>
              </div>
            </div>

          </div>
        </div>
      </template>
    </USlideover>

  </div>
</template>
