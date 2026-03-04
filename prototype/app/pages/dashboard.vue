<script setup lang="ts">
const pageTitle = inject<Ref<string>>('pageTitle')
const toolbarType = inject<Ref<string>>('toolbarType')

onMounted(() => {
  if (pageTitle) pageTitle.value = 'Dashboard'
  if (toolbarType) toolbarType.value = 'none'   // local toolbar handles its own filters
})

// ── Period preset ──────────────────────────────────────
type PeriodPreset = 'today' | 'yesterday' | 'shift_current' | 'shift_prev' | 'last7' | 'month' | 'last_month' | 'custom'
const periodPreset = ref<PeriodPreset>('today')
const showDatePicker = ref(false)
const customDateRange = ref<{ start: Date | null; end: Date | null }>({ start: null, end: null })

const periodOptions = [
  { label: 'Hari ini',          value: 'today' },
  { label: 'Kemarin',           value: 'yesterday' },
  { label: 'Shift ini',         value: 'shift_current' },
  { label: 'Shift sebelumnya',  value: 'shift_prev' },
  { label: '7 hari terakhir',   value: 'last7' },
  { label: 'Bulan ini',         value: 'month' },
  { label: 'Bulan lalu',        value: 'last_month' },
  { label: 'Kustom',            value: 'custom' },
]

const granularity = ref('daily')
const granularityOptions = [
  { label: 'Shift',    value: 'shift' },
  { label: 'Harian',   value: 'daily' },
  { label: 'Mingguan', value: 'weekly' },
  { label: 'Bulanan',  value: 'monthly' },
]

function getPresetDates(p: PeriodPreset): { start: Date; end: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const hour = now.getHours()
  const isShift1 = hour >= 6 && hour < 18
  if (p === 'today')        return { start: today, end: now }
  if (p === 'yesterday')    return { start: new Date(today.getTime() - 86400000), end: today }
  if (p === 'shift_current'){
    const s = isShift1 ? 6 : 18
    const start = new Date(today); start.setHours(s, 0, 0, 0)
    return { start, end: now }
  }
  if (p === 'shift_prev') {
    const s = isShift1 ? 18 : 6
    const prevDay = new Date(today.getTime() - (isShift1 ? 86400000 : 0))
    const start = new Date(prevDay); start.setHours(s, 0, 0, 0)
    const end = new Date(today); end.setHours(isShift1 ? 6 : 18, 0, 0, 0)
    return { start, end }
  }
  if (p === 'last7')        return { start: new Date(today.getTime() - 6 * 86400000), end: now }
  if (p === 'month')        return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: now }
  if (p === 'last_month')   return { start: new Date(today.getFullYear(), today.getMonth() - 1, 1), end: new Date(today.getFullYear(), today.getMonth(), 0) }
  return { start: today, end: now }
}

function fmtDate(d: Date | null) {
  if (!d) return '--'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const periodLabel = computed(() => {
  if (periodPreset.value === 'custom' && customDateRange.value.start) {
    const { start, end } = customDateRange.value
    if (!end || fmtDate(start) === fmtDate(end)) return fmtDate(start)
    return `${fmtDate(start)} – ${fmtDate(end)}`
  }
  return periodOptions.find(o => o.value === periodPreset.value)?.label ?? ''
})

// ── Filters ───────────────────────────────────────────
const unitQuery = ref('')          // typeahead raw input
const unitQueryDebounced = ref('') // debounced copy sent to API
let unitDebounceTimer: ReturnType<typeof setTimeout> | null = null
watch(unitQuery, v => {
  if (unitDebounceTimer) clearTimeout(unitDebounceTimer)
  unitDebounceTimer = setTimeout(() => { unitQueryDebounced.value = v }, 300)
})

const filters = reactive({
  area: '',
  loading: '',
  dumping: '',
  unit: '',           // committed unit value (on Enter / blur)
  jenisUnit: '',      // DT30 | DT40 | EX | DZ | ''
  stage: '',
  // Filter Lanjutan
  spec: '',
  ownership: '',
  reasons: [] as string[],
  severities: [] as string[],
  ageBucket: '',      // '<15' | '15-30' | '>30' | ''
  dataSource: '',
})

function resetFilters() {
  Object.assign(filters, {
    area: '', loading: '', dumping: '', unit: '', jenisUnit: '', stage: '',
    spec: '', ownership: '', reasons: [], severities: [], ageBucket: '', dataSource: '',
  })
  unitQuery.value = ''
  periodPreset.value = 'today'
}

const filterQuery = computed(() => {
  const q: Record<string, string> = {}
  if (filters.area)       q.area    = filters.area
  if (filters.loading)    q.loading = filters.loading
  if (filters.dumping)    q.dumping = filters.dumping
  if (filters.unit)       q.unit    = filters.unit
  if (filters.jenisUnit)  q.badge   = filters.jenisUnit
  if (filters.stage)      q.stage   = filters.stage
  if (filters.spec)       q.spec    = filters.spec
  if (filters.ageBucket)  q.ageBucket = filters.ageBucket
  return q
})

// Active chips — max 4 inline, rest in +N popover
const CHIP_MAX = 4
const chipLabels: Record<string, string> = {
  area: 'Area', loading: 'Loading', dumping: 'Dumping', unit: 'Unit',
  jenisUnit: 'Jenis', stage: 'Stage', spec: 'Spec', ownership: 'Own',
  ageBucket: 'Age', dataSource: 'Src',
}
const activeChips = computed(() => {
  const chips: Array<{ key: string; label: string; value: string }> = []
  for (const [k, v] of Object.entries(filters)) {
    if (Array.isArray(v)) {
      if (v.length) chips.push({ key: k, label: chipLabels[k] ?? k, value: v.join(', ') })
    } else if (v) {
      chips.push({ key: k, label: chipLabels[k] ?? k, value: v as string })
    }
  }
  return chips
})
const visibleChips = computed(() => activeChips.value.slice(0, CHIP_MAX))
const hiddenChips  = computed(() => activeChips.value.slice(CHIP_MAX))

function removeChip(key: string) {
  const f = filters as any
  f[key] = Array.isArray(f[key]) ? [] : ''
  if (key === 'unit') unitQuery.value = ''
}

// Filter Lanjutan drawer
const showAdvancedFilter = ref(false)
// +N overflow popover
const showOverflowPopover = ref(false)

// Stage options in toolbar
const stageOptions = [
  { label: 'Assigned',          value: 'ASSIGNED' },
  { label: 'Loading',           value: 'LOADING' },
  { label: 'Hauling',           value: 'HAULING' },
  { label: 'Dumping',           value: 'DUMPING' },
  { label: 'Awaiting Confirm',  value: 'AWAITING_CONFIRM' },
  { label: 'Completed',         value: 'COMPLETED' },
  { label: 'Pending',           value: 'PENDING' },
]
const jenisUnitOptions = [
  { label: 'DT30', value: 'DT30' },
  { label: 'DT40', value: 'DT40' },
  { label: 'EX',   value: 'EX' },
  { label: 'DZ',   value: 'DZ' },
]
const reasonOptions  = ['SENSOR_TIMEOUT', 'MISSING_IOT_READING', 'AWAITING_MANUAL_ENTRY', 'SYSTEM_DELAY', 'CALIBRATION_MISMATCH']
const severityOpts   = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const dataSourceOpts = [{ label: 'Otomatis', value: 'auto' }, { label: 'Manual', value: 'manual' }]

// ── Data fetching ─────────────────────────────────────────
const { data, refresh, status } = useFetch<any>('/api/dashboard/summary', { query: filterQuery })
const { data: filterOpts } = useFetch<any>('/api/dashboard/filters')

// ── Computed helpers ───────────────────────────────────────
const kpis       = computed(() => data.value?.kpis ?? {})
const pipeline   = computed(() => data.value?.pipeline ?? [])
const cycleTrend = computed(() => data.value?.cycleTimeTrend ?? [])
const pareto     = computed(() => data.value?.reasonPareto ?? [])
const pending    = computed(() => data.value?.pendingQueue ?? [])
const openIss    = computed(() => data.value?.openIssues ?? [])
const topOff     = computed(() => data.value?.topOffenders ?? { byPendingAge: [], byLocationCycleTime: [] })

// ── Action table state ───────────────────────────────────────
const activeTab = ref('pending')
const stageFilter = ref<string | null>(null)
const reasonFilter = ref<string | null>(null)
const hourFilter = ref<string | null>(null)

const filteredPending = computed(() => {
  let list = pending.value
  if (stageFilter.value)  list = list.filter((r: any) => r.stage === stageFilter.value)
  if (reasonFilter.value) list = list.filter((r: any) => r.reason === reasonFilter.value?.replace(/_/g, ' '))
  return list
})

// ── Drawer (trip detail) ────────────────────────────────────
const showDrawer = ref(false)
const drawerTrip = ref<any>(null)

function openDrawer(row: any) { drawerTrip.value = row; showDrawer.value = true }
function acknowledge() {
  useToast().add({ title: 'Acknowledged', description: `Trip ${drawerTrip.value?.trip_id} dicatat`, color: 'success' })
  showDrawer.value = false
}
function escalate() {
  useToast().add({ title: 'Escalated', description: `Trip ${drawerTrip.value?.trip_id} dieskalasi ke Supervisor`, color: 'warning' })
  showDrawer.value = false
}

// ── Chart helpers ──────────────────────────────────────────
function maxOf(arr: any[], key: string) { return Math.max(...arr.map(r => r[key] ?? 0)) || 1 }
function slaBadgeColor(b: string)  { return b === 'critical' ? 'error' : b === 'warning' ? 'warning' : 'success' }
function severityColor(s: string)  { return s === 'CRITICAL' ? 'error' : s === 'HIGH' ? 'error' : s === 'MEDIUM' ? 'warning' : 'neutral' }
function stageLabel(s: string) {
  const m: Record<string, string> = {
    ASSIGNED: 'Ditugaskan', LOADING: 'Loading', HAULING: 'Hauling',
    DUMPING: 'Dumping', AWAITING_CONFIRM: 'Menunggu Konfirmasi', COMPLETED: 'Selesai'
  }
  return m[s] ?? s
}
function fmtAge(mins: number) { return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}j ${mins % 60}m` }
function fmtDateTime(iso: string | null) {
  if (!iso) return '--'
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// KPI card click
function onKpiClick(tab: string, filterKey?: string, filterVal?: string) {
  activeTab.value = tab
  stageFilter.value = null
  reasonFilter.value = null
  if (filterKey === 'stage') stageFilter.value = filterVal ?? null
}

// Table columns
const pendingCols = [
  { accessorKey: 'trip_id',          header: 'Trip' },
  { accessorKey: 'unit_id',          header: 'Unit' },
  { accessorKey: 'loading_location', header: 'Loading' },
  { accessorKey: 'dumping_location', header: 'Dumping' },
  { accessorKey: 'stage',            header: 'Stage' },
  { accessorKey: 'reason',           header: 'Reason' },
  { accessorKey: 'age_minutes',      header: 'Age' },
  { accessorKey: 'last_update',      header: 'Last Update' },
]
const issueCols = [
  { accessorKey: 'severity',    header: 'Sev' },
  { accessorKey: 'category',    header: 'Kategori' },
  { accessorKey: 'issue_type',  header: 'Tipe' },
  { accessorKey: 'unit_id',     header: 'Unit' },
  { accessorKey: 'age_minutes', header: 'Age' },
  { accessorKey: 'status',      header: 'Status' },
  { accessorKey: 'pic',         header: 'PIC' },
  { accessorKey: 'detail',      header: 'Detail' },
]
const offenderUnitCols = [
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'badge',   header: 'Badge' },
  { accessorKey: 'count',   header: 'Pending' },
  { accessorKey: 'maxAge',  header: 'Max Age' },
  { accessorKey: 'avgAge',  header: 'Avg Age' },
]
const offenderLocCols = [
  { accessorKey: 'location',    header: 'Lokasi' },
  { accessorKey: 'count',       header: 'Trips' },
  { accessorKey: 'avgCycleMin', header: 'Avg Cycle (mnt)' },
]
</script>

<template>
  <div class="flex flex-col w-full min-h-full min-w-0">

    <!-- ── Local Toolbar (single row) ──────────────────────────────── -->
    <div class="border-b border-(--ui-border) bg-(--ui-bg) px-3 py-1.5 flex items-center gap-1.5 min-w-0 overflow-x-auto shrink-0 sticky top-0 z-20">

      <!-- LEFT: filter controls -->
      <!-- Period preset -->
      <USelect
        v-model="periodPreset"
        :items="periodOptions"
        label-key="label" value-key="value"
        size="xs" class="w-[130px] shrink-0"
        @update:model-value="showDatePicker = periodPreset === 'custom'"
      />
      <!-- Custom date range popover -->
      <UPopover v-if="periodPreset === 'custom'" v-model:open="showDatePicker">
        <UButton
          :label="periodLabel || 'Pilih tanggal'"
          icon="i-lucide-calendar"
          size="xs" variant="outline" color="neutral"
          class="shrink-0"
        />
        <template #content>
          <div class="p-3">
            <p class="text-xs text-(--ui-text-muted) mb-2">Pilih range tanggal</p>
            <div class="flex gap-2">
              <div>
                <label class="text-[10px] text-(--ui-text-muted)">Dari</label>
                <input type="date" class="block text-xs border border-(--ui-border) rounded px-2 py-1 mt-0.5"
                  :value="customDateRange.start ? customDateRange.start.toISOString().slice(0,10) : ''"
                  @change="customDateRange.start = ($event.target as any).value ? new Date(($event.target as any).value) : null"
                />
              </div>
              <div>
                <label class="text-[10px] text-(--ui-text-muted)">Sampai</label>
                <input type="date" class="block text-xs border border-(--ui-border) rounded px-2 py-1 mt-0.5"
                  :value="customDateRange.end ? customDateRange.end.toISOString().slice(0,10) : ''"
                  @change="customDateRange.end = ($event.target as any).value ? new Date(($event.target as any).value) : null"
                />
              </div>
            </div>
            <UButton label="Terapkan" size="xs" color="primary" class="w-full mt-2" @click="showDatePicker = false" />
          </div>
        </template>
      </UPopover>

      <!-- Granularity -->
      <USelect
        v-model="granularity"
        :items="granularityOptions"
        label-key="label" value-key="value"
        size="xs" class="w-[90px] shrink-0"
      />

      <div class="w-px h-4 bg-(--ui-border) shrink-0" />

      <!-- Area/Pit -->
      <USelect
        v-model="filters.area"
        :items="(filterOpts?.areas ?? []).map((a: string) => ({ label: a, value: a }))"
        label-key="label" value-key="value"
        placeholder="Area"
        size="xs" class="w-[110px] shrink-0"
        @update:model-value="v => { if (!v) filters.area = '' }"
      />
      <!-- Loading -->
      <USelect
        v-model="filters.loading"
        :items="(filterOpts?.loadingLocs ?? []).map((l: any) => ({ label: l.name, value: l.id }))"
        label-key="label" value-key="value"
        placeholder="Loading"
        size="xs" class="w-[110px] shrink-0"
      />
      <!-- Dumping -->
      <USelect
        v-model="filters.dumping"
        :items="(filterOpts?.dumpingLocs ?? []).map((l: any) => ({ label: l.name, value: l.id }))"
        label-key="label" value-key="value"
        placeholder="Dumping"
        size="xs" class="w-[110px] shrink-0"
      />

      <div class="w-px h-4 bg-(--ui-border) shrink-0" />

      <!-- Unit typeahead -->
      <div class="relative shrink-0 w-[130px]">
        <UInput
          v-model="unitQuery"
          placeholder="Cari unit..."
          icon="i-lucide-search"
          size="xs"
          @keydown.enter="filters.unit = unitQuery"
          @blur="filters.unit = unitQuery"
        />
      </div>
      <!-- Jenis Unit -->
      <USelect
        v-model="filters.jenisUnit"
        :items="jenisUnitOptions"
        label-key="label" value-key="value"
        placeholder="Jenis"
        size="xs" class="w-[90px] shrink-0"
      />
      <!-- Stage -->
      <USelect
        v-model="filters.stage"
        :items="stageOptions"
        label-key="label" value-key="value"
        placeholder="Stage"
        size="xs" class="w-[120px] shrink-0"
      />

      <!-- RIGHT: active chips + actions -->
      <div class="ml-auto flex items-center gap-1 shrink-0">
        <!-- Loading indicator -->
        <UIcon v-if="status === 'pending'" name="i-lucide-loader" class="size-3 animate-spin text-(--ui-text-muted)" />

        <!-- Active filter chips (inline, max 4) -->
        <template v-for="chip in visibleChips" :key="chip.key">
          <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
            <span class="opacity-70">{{ chip.label }}:</span>
            <span class="max-w-[60px] truncate">{{ chip.value }}</span>
            <button class="ml-0.5 opacity-60 hover:opacity-100 leading-none" @click.stop="removeChip(chip.key)">×</button>
          </span>
        </template>

        <!-- +N overflow popover -->
        <UPopover v-if="hiddenChips.length" v-model:open="showOverflowPopover">
          <button class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            +{{ hiddenChips.length }}
          </button>
          <template #content>
            <div class="p-2 flex flex-col gap-1 min-w-[160px]">
              <span v-for="chip in hiddenChips" :key="chip.key"
                class="flex items-center justify-between gap-2 text-xs rounded px-1.5 py-1 bg-blue-50 text-blue-700">
                <span><span class="opacity-70">{{ chip.label }}:</span> {{ chip.value }}</span>
                <button class="opacity-60 hover:opacity-100" @click="removeChip(chip.key); hiddenChips.length === 1 && (showOverflowPopover = false)">×</button>
              </span>
            </div>
          </template>
        </UPopover>

        <div class="w-px h-4 bg-(--ui-border)" />

        <!-- Filter Lanjutan -->
        <UButton
          label="Filter Lanjutan"
          icon="i-lucide-sliders-horizontal"
          size="xs" variant="ghost" color="neutral"
          @click="showAdvancedFilter = true"
        />
        <!-- Refresh -->
        <UButton icon="i-lucide-refresh-cw" size="xs" variant="ghost" color="neutral" @click="refresh()" />
        <!-- Reset -->
        <UButton icon="i-lucide-rotate-ccw" size="xs" variant="ghost" color="neutral" title="Reset semua filter" @click="resetFilters" />
      </div>
    </div>

    <!-- ── Filter Lanjutan Drawer ─────────────────────────────────── -->
    <USlideover v-model:open="showAdvancedFilter" title="Filter Lanjutan" side="right" class="max-w-xs">
      <template #body>
        <div class="flex flex-col gap-4 p-1">
          <!-- Spec/Model -->
          <div>
            <label class="text-[11px] font-semibold text-(--ui-text-muted) uppercase mb-1 block">Spec / Model</label>
            <USelect
              v-model="filters.spec"
              :items="(filterOpts?.specs ?? []).map((s: string) => ({ label: s, value: s }))"
              label-key="label" value-key="value" size="sm" placeholder="Semua Spec"
            />
          </div>
          <!-- Ownership -->
          <div>
            <label class="text-[11px] font-semibold text-(--ui-text-muted) uppercase mb-1 block">Ownership</label>
            <USelect
              v-model="filters.ownership"
              :items="[{ label: 'OWN', value: 'OWN' }, { label: 'Rental', value: 'RENTAL' }]"
              label-key="label" value-key="value" size="sm" placeholder="Semua"
            />
          </div>
          <!-- Reason (multi-select via chips) -->
          <div>
            <label class="text-[11px] font-semibold text-(--ui-text-muted) uppercase mb-1 block">Reason</label>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="r in reasonOptions" :key="r"
                class="px-2 py-0.5 rounded text-xs border transition-colors"
                :class="filters.reasons.includes(r)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-transparent text-(--ui-text-muted) border-(--ui-border) hover:bg-(--ui-bg-accented)'"
                @click="filters.reasons.includes(r) ? filters.reasons.splice(filters.reasons.indexOf(r), 1) : filters.reasons.push(r)"
              >{{ r.replace(/_/g, ' ').toLowerCase() }}</button>
            </div>
          </div>
          <!-- Severity (multi-select) -->
          <div>
            <label class="text-[11px] font-semibold text-(--ui-text-muted) uppercase mb-1 block">Severity</label>
            <div class="flex gap-1 flex-wrap">
              <button
                v-for="s in severityOpts" :key="s"
                class="px-2 py-0.5 rounded text-xs border transition-colors"
                :class="filters.severities.includes(s)
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-transparent text-(--ui-text-muted) border-(--ui-border) hover:bg-(--ui-bg-accented)'"
                @click="filters.severities.includes(s) ? filters.severities.splice(filters.severities.indexOf(s), 1) : filters.severities.push(s)"
              >{{ s }}</button>
            </div>
          </div>
          <!-- Pending Age Bucket -->
          <div>
            <label class="text-[11px] font-semibold text-(--ui-text-muted) uppercase mb-1 block">Pending Age</label>
            <div class="flex gap-1">
              <button v-for="b in [{ label: '<15m', value: '<15' }, { label: '15–30m', value: '15-30' }, { label: '>30m', value: '>30' }]" :key="b.value"
                class="px-2 py-0.5 rounded text-xs border transition-colors"
                :class="filters.ageBucket === b.value
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-transparent text-(--ui-text-muted) border-(--ui-border) hover:bg-(--ui-bg-accented)'"
                @click="filters.ageBucket = filters.ageBucket === b.value ? '' : b.value"
              >{{ b.label }}</button>
            </div>
          </div>
          <!-- Data Source -->
          <div>
            <label class="text-[11px] font-semibold text-(--ui-text-muted) uppercase mb-1 block">Data Source</label>
            <USelect v-model="filters.dataSource" :items="dataSourceOpts" label-key="label" value-key="value" size="sm" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 p-4">
          <UButton label="Reset" variant="outline" color="neutral" block @click="resetFilters(); showAdvancedFilter = false" />
          <UButton label="Terapkan" color="primary" block @click="showAdvancedFilter = false" />
        </div>
      </template>
    </USlideover>

    <!-- ── Main content ─────────────────────────────────────────────── -->
    <div class="p-4 flex flex-col gap-5">

      <!-- ── KPI Groups ─────────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Operasional -->
        <div class="flex flex-col gap-2">
          <div class="text-[11px] font-bold uppercase tracking-widest text-(--ui-text-muted)">Operasional</div>
          <div class="grid grid-cols-2 gap-3">
            <UCard class="cursor-pointer hover:ring-1 hover:ring-primary transition-all" @click="onKpiClick('pending')">
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Ritase</div>
              <div class="text-2xl font-extrabold mt-0.5">{{ kpis.ritase ?? '--' }}</div>
              <div class="text-[11px] text-(--ui-text-muted)">total trip</div>
            </UCard>
            <UCard class="cursor-pointer hover:ring-1 hover:ring-primary transition-all" @click="onKpiClick('pending')">
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Tonnage</div>
              <div class="text-2xl font-extrabold mt-0.5">{{ kpis.tonnage?.toLocaleString('id-ID') ?? '--' }}</div>
              <div class="text-[11px] text-(--ui-text-muted)">ton</div>
            </UCard>
            <UCard class="cursor-pointer hover:ring-1 hover:ring-primary transition-all" @click="onKpiClick('pending', 'stage', 'ASSIGNED')">
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Penugasan Aktif</div>
              <div class="text-2xl font-extrabold mt-0.5 text-blue-500">{{ kpis.activeAssignments ?? '--' }}</div>
              <div class="text-[11px] text-(--ui-text-muted)">assignment</div>
            </UCard>
            <UCard class="cursor-pointer hover:ring-1 hover:ring-primary transition-all" @click="onKpiClick('pending', 'stage', 'COMPLETED')">
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Trip Selesai</div>
              <div class="text-2xl font-extrabold mt-0.5 text-green-500">{{ kpis.completedTrips ?? '--' }}</div>
              <div class="text-[11px] text-(--ui-text-muted)">hari ini</div>
            </UCard>
          </div>
        </div>

        <!-- Performa -->
        <div class="flex flex-col gap-2">
          <div class="text-[11px] font-bold uppercase tracking-widest text-(--ui-text-muted)">Performa</div>
          <div class="grid grid-cols-2 gap-3 h-full">
            <UCard class="col-span-1">
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">PA</div>
              <div class="text-2xl font-extrabold mt-0.5" :class="(kpis.paPercent ?? 0) >= 85 ? 'text-green-500' : (kpis.paPercent ?? 0) >= 70 ? 'text-amber-500' : 'text-red-500'">
                {{ kpis.paPercent ?? '--' }}%
              </div>
              <div class="mt-2 h-1.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :class="(kpis.paPercent ?? 0) >= 85 ? 'bg-green-500' : (kpis.paPercent ?? 0) >= 70 ? 'bg-amber-500' : 'bg-red-500'" :style="{ width: (kpis.paPercent ?? 0) + '%' }" />
              </div>
              <div class="text-[11px] text-(--ui-text-muted) mt-1">target 85%</div>
            </UCard>
            <UCard class="col-span-1">
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">UA</div>
              <div class="text-2xl font-extrabold mt-0.5" :class="(kpis.uaPercent ?? 0) >= 80 ? 'text-green-500' : (kpis.uaPercent ?? 0) >= 75 ? 'text-amber-500' : 'text-red-500'">
                {{ kpis.uaPercent ?? '--' }}%
              </div>
              <div class="mt-2 h-1.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :class="(kpis.uaPercent ?? 0) >= 80 ? 'bg-green-500' : (kpis.uaPercent ?? 0) >= 75 ? 'bg-amber-500' : 'bg-red-500'" :style="{ width: (kpis.uaPercent ?? 0) + '%' }" />
              </div>
              <div class="text-[11px] text-(--ui-text-muted) mt-1">target 80%</div>
            </UCard>
            <UCard class="col-span-2">
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Unit Aktif</div>
              <div class="flex items-end gap-2 mt-0.5">
                <span class="text-2xl font-extrabold">{{ kpis.activeUnits ?? '--' }}</span>
                <span class="text-(--ui-text-muted) text-sm mb-0.5">/ {{ kpis.totalUnits ?? '--' }} unit</span>
              </div>
              <div class="mt-2 h-1.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full transition-all duration-500" :style="{ width: kpis.totalUnits ? (kpis.activeUnits / kpis.totalUnits * 100) + '%' : '0%' }" />
              </div>
            </UCard>
          </div>
        </div>

        <!-- Exception -->
        <div class="flex flex-col gap-2">
          <div class="text-[11px] font-bold uppercase tracking-widest text-(--ui-text-muted)">Exception</div>
          <div class="grid grid-cols-1 gap-3">
            <!-- Pending + SLA buckets -->
            <UCard class="cursor-pointer hover:ring-1 hover:ring-amber-400 transition-all" @click="onKpiClick('pending')">
              <div class="flex items-center justify-between mb-2">
                <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Pending Trips</div>
                <span class="text-2xl font-extrabold text-amber-500">{{ kpis.pendingTrips ?? '--' }}</span>
              </div>
              <div class="flex gap-2 flex-wrap">
                <UBadge color="success" variant="subtle" size="xs">
                  &lt;15m: {{ kpis.pendingBySLA?.lt15 ?? 0 }}
                </UBadge>
                <UBadge color="warning" variant="solid" size="xs">
                  15–30m: {{ kpis.pendingBySLA?.m15to30 ?? 0 }}
                </UBadge>
                <UBadge color="error" variant="solid" size="xs">
                  &gt;30m: {{ kpis.pendingBySLA?.gt30 ?? 0 }}
                </UBadge>
              </div>
            </UCard>
            <div class="grid grid-cols-2 gap-3">
              <UCard class="cursor-pointer hover:ring-1 hover:ring-red-400 transition-all" @click="onKpiClick('issues')">
                <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Open Issues</div>
                <div class="text-2xl font-extrabold mt-0.5">{{ kpis.openIssues ?? '--' }}</div>
                <div class="text-[11px] mt-1">
                  <span class="text-red-500 font-bold">{{ kpis.criticalIssues ?? 0 }} kritis</span>
                </div>
              </UCard>
              <UCard class="cursor-pointer hover:ring-1 hover:ring-orange-400 transition-all" @click="onKpiClick('pending')">
                <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Manual Entry</div>
                <div class="text-2xl font-extrabold mt-0.5 text-orange-500">{{ kpis.manualEntries ?? '--' }}</div>
                <div class="text-[11px] text-(--ui-text-muted) mt-1">trip</div>
              </UCard>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Charts Row ─────────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Trip Pipeline -->
        <UCard>
          <template #header>
            <div class="text-sm font-bold">Trip Pipeline</div>
          </template>
          <div class="flex flex-col gap-2">
            <div
              v-for="stage in pipeline"
              :key="stage.stage"
              class="cursor-pointer group"
              @click="stageFilter = stageFilter === stage.stage ? null : stage.stage; activeTab = 'pending'"
            >
              <div class="flex justify-between text-xs mb-1">
                <span :class="stageFilter === stage.stage ? 'text-primary font-bold' : 'text-(--ui-text)'">{{ stage.label }}</span>
                <span class="font-semibold">
                  {{ stage.count }}
                  <span v-if="stage.avgMinutes" class="text-(--ui-text-muted) font-normal"> · {{ stage.avgMinutes }}m avg</span>
                </span>
              </div>
              <div class="h-5 bg-(--ui-bg-accented) rounded overflow-hidden">
                <div
                  class="h-full rounded transition-all duration-500 flex items-center pl-2"
                  :class="[
                    stageFilter === stage.stage ? 'bg-primary' :
                    stage.stage === 'COMPLETED' ? 'bg-green-500' :
                    stage.stage === 'AWAITING_CONFIRM' ? 'bg-amber-400' :
                    stage.stage === 'LOADING' ? 'bg-blue-400' :
                    stage.stage === 'HAULING' ? 'bg-indigo-400' :
                    stage.stage === 'DUMPING' ? 'bg-violet-400' : 'bg-neutral-400'
                  ]"
                  :style="{ width: Math.max(4, Math.round(stage.count / (Math.max(...pipeline.map((p: any) => p.count)) || 1) * 100)) + '%' }"
                >
                  <span v-if="stage.count > 3" class="text-[10px] text-white font-bold">{{ stage.count }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="stageFilter" class="mt-3 pt-3 border-t border-(--ui-border) flex items-center gap-2 text-xs text-(--ui-text-muted)">
            <UIcon name="i-lucide-filter" class="size-3" />
            Filter: {{ stageLabel(stageFilter) }}
            <UButton label="Hapus" size="xs" variant="link" @click="stageFilter = null" />
          </div>
        </UCard>

        <!-- Cycle Time Trend -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="text-sm font-bold">Cycle Time Trend</div>
              <div class="flex items-center gap-3 text-[11px] text-(--ui-text-muted)">
                <span class="flex items-center gap-1"><span class="inline-block w-3 h-1.5 rounded bg-neutral-400"></span> Aktual</span>
                <span class="flex items-center gap-1"><span class="inline-block w-3 h-0.5 border-t-2 border-dashed border-amber-400"></span> Target 45m</span>
              </div>
            </div>
          </template>
          <div v-if="!cycleTrend.length" class="h-32 flex items-center justify-center text-xs text-(--ui-text-muted)">
            <UIcon name="i-lucide-bar-chart-2" class="size-5 mr-2 opacity-40" /> Belum ada data cycle time
          </div>
          <!-- Chart container: position-relative so the target line can overlay all bars -->
          <div v-else class="relative h-32 flex items-end gap-[2px]">
            <!-- Target line at 56.25% from bottom (45/80*100) —absolute across container -->
            <div
              class="absolute left-0 right-0 border-t-2 border-dashed border-amber-400 pointer-events-none z-10"
              :style="{ bottom: '56%' }"
            />
            <div
              v-for="h in cycleTrend"
              :key="h.hour"
              class="flex-1 h-full flex flex-col justify-end items-center cursor-pointer group"
              @click="hourFilter = hourFilter === h.hour ? null : h.hour; activeTab = 'pending'"
            >
              <!-- bar: height as % of parent h-full which = h-32 = 128px -->
              <div
                class="w-full rounded-t transition-all duration-300"
                :class="hourFilter === h.hour ? 'bg-primary' : h.avgCycleMin > 45 ? 'bg-red-400' : 'bg-blue-300'"
                :style="{ height: Math.max(4, Math.round(h.avgCycleMin / 80 * 100)) + '%' }"
                :title="h.hour + ': ' + h.avgCycleMin + 'm'"
              />
              <div class="text-[9px] text-(--ui-text-muted) whitespace-nowrap mt-0.5">{{ h.hour }}</div>
            </div>
          </div>
          <div v-if="hourFilter" class="mt-3 pt-2 border-t border-(--ui-border) flex items-center gap-2 text-xs text-(--ui-text-muted)">
            <UIcon name="i-lucide-filter" class="size-3" />
            Filter jam: {{ hourFilter }}
            <UButton label="Hapus" size="xs" variant="link" @click="hourFilter = null" />
          </div>
        </UCard>

        <!-- Reason Pareto -->
        <UCard>
          <template #header>
            <div class="text-sm font-bold">Reason Breakdown</div>
          </template>
          <div class="flex flex-col gap-2">
            <div
              v-for="r in pareto"
              :key="r.reason"
              class="cursor-pointer group"
              @click="reasonFilter = reasonFilter === r.reason ? null : r.reason; activeTab = 'pending'"
            >
              <div class="flex justify-between text-xs mb-1">
                <span :class="reasonFilter === r.reason ? 'text-primary font-bold' : ''" class="truncate max-w-[60%]">{{ r.reason.replace(/_/g, ' ') }}</span>
                <span class="text-(--ui-text-muted)">{{ r.count }} · <span class="font-semibold">{{ r.cumulativePct }}%</span></span>
              </div>
              <div class="h-3 bg-(--ui-bg-accented) rounded overflow-hidden relative">
                <div
                  class="h-full rounded transition-all duration-500"
                  :class="reasonFilter === r.reason ? 'bg-primary' : 'bg-neutral-400'"
                  :style="{ width: maxOf(pareto, 'count') ? Math.round(r.count / maxOf(pareto, 'count') * 100) + '%' : '0%' }"
                />
                <!-- cumulative % overlay -->
                <div
                  class="absolute inset-0 border-r-2 border-amber-500 pointer-events-none"
                  :style="{ width: r.cumulativePct + '%' }"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- ── Action Table ────────────────────────────────────────── -->
      <UCard>
        <!-- Tabs + meta always visible in body above the table -->
        <div class="flex items-center gap-2 flex-wrap mb-3">
          <div class="text-sm font-bold shrink-0">Action Table</div>
          <!-- Tab buttons: use explicit class for active state to avoid color rendering issues -->
          <div class="flex gap-1">
            <button
              v-for="{ id, label, icon: tabIcon } in [
                { id: 'pending', label: 'Pending Queue', icon: 'i-lucide-clock' },
                { id: 'issues',  label: 'Open Issues',   icon: 'i-lucide-alert-triangle' },
                { id: 'top',     label: 'Top Offender',  icon: 'i-lucide-trending-up' },
              ]"
              :key="id"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors"
              :class="activeTab === id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-transparent text-(--ui-text-muted) border-(--ui-border) hover:bg-(--ui-bg-accented)'"
              @click="activeTab = id"
            >
              <UIcon :name="tabIcon" class="size-3" />
              {{ label }}
            </button>
          </div>
          <div v-if="activeTab === 'pending' && (stageFilter || reasonFilter)" class="flex items-center gap-1 text-xs text-(--ui-text-muted)">
            <UIcon name="i-lucide-filter" class="size-3" />
            {{ filteredPending.length }} dari {{ pending.length }}
            <UButton label="Reset" size="xs" variant="link" @click="stageFilter = null; reasonFilter = null" />
          </div>
          <div v-if="activeTab === 'pending'" class="ms-auto text-xs text-(--ui-text-muted)">Default: umur terlama ↓</div>
        </div>

        <!-- Tab Pending Queue -->
        <template v-if="activeTab === 'pending'">
          <div v-if="!data" class="p-6 flex flex-col gap-2">
            <USkeleton v-for="i in 6" :key="i" class="h-9" />
          </div>
          <div v-else-if="filteredPending.length === 0" class="py-12 text-center text-(--ui-text-muted)">
            <UIcon name="i-lucide-check-circle" class="size-8 text-green-500 mb-2 mx-auto" />
            <p class="text-sm">Tidak ada pending trip yang memenuhi filter.</p>
          </div>
          <div v-else class="overflow-auto max-h-[400px]">
            <UTable :data="filteredPending" :columns="pendingCols">
              <template #trip_id-cell="{ row }">
                <UButton :label="(row.original as any).trip_id" size="xs" variant="link" @click="openDrawer(row.original as any)" />
              </template>
              <template #unit_id-cell="{ row }">
                <div>
                  <span class="font-semibold">{{ (row.original as any).unit_id }}</span>
                  <UBadge :label="(row.original as any).badge" color="neutral" variant="outline" size="xs" class="ml-1" />
                </div>
              </template>
              <template #stage-cell="{ row }">
                <UBadge :label="stageLabel((row.original as any).stage)" color="neutral" variant="subtle" size="xs" />
              </template>
              <template #reason-cell="{ row }">
                <span class="text-xs text-(--ui-text-muted)">{{ (row.original as any).reason }}</span>
              </template>
              <template #age_minutes-cell="{ row }">
                <UBadge
                  :label="fmtAge((row.original as any).age_minutes)"
                  :color="slaBadgeColor((row.original as any).sla_bucket)"
                  :variant="(row.original as any).sla_bucket === 'critical' ? 'solid' : (row.original as any).sla_bucket === 'warning' ? 'solid' : 'subtle'"
                  size="xs"
                />
              </template>
              <template #last_update-cell="{ row }">
                <span class="text-xs text-(--ui-text-muted)">{{ fmtDateTime((row.original as any).last_update) }}</span>
              </template>
            </UTable>
          </div>
        </template>

        <!-- Tab Open Issues -->
        <template v-else-if="activeTab === 'issues'">
          <div v-if="openIss.length === 0" class="py-12 text-center text-(--ui-text-muted)">
            <UIcon name="i-lucide-check-circle" class="size-8 text-green-500 mb-2 mx-auto" />
            <p class="text-sm">Tidak ada open issue saat ini.</p>
          </div>
          <div v-else class="overflow-auto max-h-[400px]">
            <UTable :data="openIss" :columns="issueCols">
              <template #severity-cell="{ row }">
                <UBadge :label="(row.original as any).severity" :color="severityColor((row.original as any).severity)" variant="solid" size="xs" />
              </template>
              <template #status-cell="{ row }">
                <UBadge :label="(row.original as any).status" :color="(row.original as any).status === 'OPEN' ? 'error' : 'warning'" variant="subtle" size="xs" />
              </template>
              <template #age_minutes-cell="{ row }">
                <span class="text-xs" :class="(row.original as any).age_minutes > 30 ? 'text-red-500 font-semibold' : ''">{{ fmtAge((row.original as any).age_minutes) }}</span>
              </template>
              <template #pic-cell="{ row }">
                <span class="text-xs text-(--ui-text-muted)">{{ (row.original as any).pic ?? '—' }}</span>
              </template>
              <template #detail-cell="{ row }">
                <span class="text-xs text-(--ui-text-muted)">{{ (row.original as any).detail }}</span>
              </template>
            </UTable>
          </div>
        </template>

        <!-- Tab Top Offenders -->
        <template v-else-if="activeTab === 'top'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
            <div>
              <div class="text-sm font-bold mb-3 flex items-center gap-1.5">
                <UIcon name="i-lucide-clock" class="size-4 text-amber-500" /> Top Unit by Pending Age
              </div>
              <UTable :data="topOff.byPendingAge" :columns="offenderUnitCols">
                <template #badge-cell="{ row }">
                  <UBadge :label="(row.original as any).badge" color="neutral" variant="outline" size="xs" />
                </template>
                <template #maxAge-cell="{ row }">
                  <UBadge :label="fmtAge((row.original as any).maxAge)" :color="(row.original as any).maxAge > 30 ? 'error' : (row.original as any).maxAge > 15 ? 'warning' : 'success'" size="xs" />
                </template>
                <template #avgAge-cell="{ row }">
                  <span class="text-xs">{{ fmtAge((row.original as any).avgAge) }}</span>
                </template>
              </UTable>
            </div>
            <div>
              <div class="text-sm font-bold mb-3 flex items-center gap-1.5">
                <UIcon name="i-lucide-map-pin" class="size-4 text-blue-500" /> Top Lokasi by Cycle Time
              </div>
              <UTable :data="topOff.byLocationCycleTime" :columns="offenderLocCols">
                <template #avgCycleMin-cell="{ row }">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-(--ui-bg-accented) rounded overflow-hidden">
                      <div class="h-full rounded" :class="(row.original as any).avgCycleMin > 45 ? 'bg-red-400' : 'bg-green-400'" :style="{ width: Math.min(100, Math.round((row.original as any).avgCycleMin / 80 * 100)) + '%' }" />
                    </div>
                    <span :class="(row.original as any).avgCycleMin > 45 ? 'text-red-500 font-bold' : 'text-green-600'">{{ (row.original as any).avgCycleMin }}m</span>
                  </div>
                </template>
              </UTable>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>

  <!-- ── Trip Detail Drawer ─────────────────────────────────────── -->
  <USlideover v-model:open="showDrawer" title="Detail Trip" side="right" class="max-w-lg">
    <template #body>
      <div v-if="drawerTrip" class="flex flex-col gap-5 p-1">
        <!-- Header info -->
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-xs text-(--ui-text-muted)">Trip ID</div>
            <div class="font-mono font-bold text-lg">{{ drawerTrip.trip_id }}</div>
          </div>
          <UBadge :label="drawerTrip.sla_bucket === 'critical' ? 'KRITIS' : drawerTrip.sla_bucket === 'warning' ? 'PERINGATAN' : 'NORMAL'" :color="slaBadgeColor(drawerTrip.sla_bucket)" variant="solid" />
        </div>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <div><div class="text-[11px] text-(--ui-text-muted) uppercase">Unit</div><div class="font-semibold">{{ drawerTrip.unit_id }}</div></div>
          <div><div class="text-[11px] text-(--ui-text-muted) uppercase">Badge</div><UBadge :label="drawerTrip.badge" color="neutral" variant="outline" size="sm" /></div>
          <div><div class="text-[11px] text-(--ui-text-muted) uppercase">Loading</div><div>{{ drawerTrip.loading_location }}</div></div>
          <div><div class="text-[11px] text-(--ui-text-muted) uppercase">Dumping</div><div>{{ drawerTrip.dumping_location }}</div></div>
          <div><div class="text-[11px] text-(--ui-text-muted) uppercase">Age</div><div class="font-bold">{{ fmtAge(drawerTrip.age_minutes) }}</div></div>
          <div><div class="text-[11px] text-(--ui-text-muted) uppercase">Reason</div><div class="text-amber-600 font-medium">{{ drawerTrip.reason }}</div></div>
        </div>

        <!-- Stage timeline -->
        <div>
          <div class="text-xs font-bold uppercase text-(--ui-text-muted) mb-3">Timeline Stage</div>
          <div class="flex flex-col gap-2">
            <div v-for="(ts, label) in {
              'Berangkat Load': drawerTrip.timestamps?.depart_load,
              'Tiba Load':      drawerTrip.timestamps?.arrive_load,
              'Mulai Loading':  drawerTrip.timestamps?.load_start,
              'Selesai Loading':drawerTrip.timestamps?.load_end,
              'Berangkat Dump': drawerTrip.timestamps?.depart_dump,
              'Tiba Dump':      drawerTrip.timestamps?.arrive_dump,
              'Mulai Dump':     drawerTrip.timestamps?.dump_start,
              'Selesai Dump':   drawerTrip.timestamps?.dump_end,
            }" :key="label" class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full shrink-0" :class="ts ? 'bg-green-500' : 'bg-(--ui-bg-accented)'" />
              <div class="text-xs text-(--ui-text-muted) w-36 shrink-0">{{ label }}</div>
              <div class="text-xs font-mono">{{ ts ? fmtDateTime(ts) : '—' }}</div>
            </div>
          </div>
        </div>

        <!-- Tonnage data source -->
        <div v-if="drawerTrip.tonnage_history?.length">
          <div class="text-xs font-bold uppercase text-(--ui-text-muted) mb-2">Riwayat Tonnage</div>
          <div class="flex flex-col gap-2">
            <div v-for="(th, i) in drawerTrip.tonnage_history" :key="i" class="flex items-center gap-2 text-xs">
              <UBadge :label="th.source ?? 'UNKNOWN'" color="neutral" variant="outline" size="xs" />
              <span class="font-semibold">{{ th.value != null ? th.value + 't' : '—' }}</span>
              <UBadge :label="th.status" :color="th.status === 'CONFIRMED' ? 'success' : th.status === 'MANUAL' ? 'warning' : 'neutral'" variant="subtle" size="xs" />
              <span class="text-(--ui-text-muted)">{{ fmtDateTime(th.recorded_at) }}</span>
              <span v-if="th.reason" class="text-(--ui-text-muted) italic">· {{ th.reason }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-3 p-4">
        <UButton label="Acknowledge" icon="i-lucide-check" class="flex-1" color="success" @click="acknowledge()" />
        <UButton label="Eskalasi" icon="i-lucide-alert-triangle" class="flex-1" color="warning" variant="outline" @click="escalate()" />
      </div>
    </template>
  </USlideover>
</template>

<style scoped>
.slide-x-enter-active,
.slide-x-leave-active {
  transition: all 0.2s ease;
}
.slide-x-enter-from,
.slide-x-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
