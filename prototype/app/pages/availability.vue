<script setup lang="ts">
const pageTitle = inject<Ref<string>>('pageTitle')
const toolbarType = inject<Ref<string>>('toolbarType')

onMounted(() => {
  if (pageTitle) pageTitle.value = 'Availabilitas'
  if (toolbarType) toolbarType.value = 'historical'
})

// ── Filters ────────────────────────────────────────────────────────
const filterBadge  = ref('')
const filterShift  = ref('')
const filterUnit   = ref('')
const fQuery = computed(() => {
  const q: Record<string, string> = {}
  if (filterBadge.value) q.badge = filterBadge.value
  if (filterShift.value) q.shift = filterShift.value
  if (filterUnit.value)  q.unit  = filterUnit.value
  return q
})

const badgeOptions = ['DT30', 'DT40', 'EX', 'DZ']

const { data, error } = useFetch<any[]>('/api/availability', { query: fQuery })

// ── KPI aggregates ─────────────────────────────────────────────────
const dtRows = computed(() => (data.value ?? []).filter((r: any) => r.unit_type === 'DUMP_TRUCK' || r.badge === 'DT30' || r.badge === 'DT40'))
const avgPA = computed(() => { const d = dtRows.value; if (!d.length) return 0; return +(d.reduce((s: number, r: any) => s + r.pa_pct, 0) / d.length).toFixed(1) })
const avgUA = computed(() => { const d = dtRows.value; if (!d.length) return 0; return +(d.reduce((s: number, r: any) => s + r.ua_pct, 0) / d.length).toFixed(1) })
const totalRunning = computed(() => dtRows.value.reduce((s: number, r: any) => s + r.running_min, 0))
const avgCompleteness = computed(() => { const d = data.value ?? []; if (!d.length) return 0; return Math.round(d.reduce((s: number, r: any) => s + r.completeness_pct, 0) / d.length) })

// ── Activity mix colors ────────────────────────────────────────────
const activityColors: Record<string, string> = {
  LOADING:   'bg-blue-400',
  HAULING:   'bg-indigo-400',
  DUMPING:   'bg-violet-400',
  STANDBY:   'bg-neutral-300',
  BREAKDOWN: 'bg-red-400',
  DELAY:     'bg-amber-400',
  P2H:       'bg-slate-300',
}
const activityKeys = ['LOADING', 'HAULING', 'DUMPING', 'STANDBY', 'BREAKDOWN', 'DELAY', 'P2H']

function mixTotal(row: any) {
  return activityKeys.reduce((s: number, k: string) => s + (row.activity_mix?.[k] ?? 0), 0) || 1
}

// PA/UA Trend (simulated from data rows treated as hourly snapshots)
const trendData = computed(() => {
  const rows = dtRows.value.slice(0, 12)
  return rows.map((r: any, i: number) => ({
    label: r.unit_id,
    pa: r.pa_pct,
    ua: r.ua_pct,
  }))
})

const cols = [
  { accessorKey: 'unit_id',       header: 'Unit' },
  { accessorKey: 'badge',         header: 'Badge' },
  { accessorKey: 'spec',          header: 'Spec' },
  { accessorKey: 'pa_pct',        header: 'PA %' },
  { accessorKey: 'ua_pct',        header: 'UA %' },
  { accessorKey: 'activity_mix',  header: 'Activity Mix' },
  { accessorKey: 'running_min',   header: 'Running (m)' },
  { accessorKey: 'breakdown_min', header: 'Breakdown (m)' },
  { accessorKey: 'completeness_pct', header: 'Completeness' },
]
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <!-- Filter bar -->
    <div class="flex items-center gap-3 flex-wrap">
      <!-- Badge filter chips -->
      <div class="flex gap-1">
        <UButton
          v-for="b in badgeOptions"
          :key="b"
          :label="b"
          size="xs"
          :color="filterBadge === b ? 'primary' : 'neutral'"
          :variant="filterBadge === b ? 'solid' : 'outline'"
          @click="filterBadge = filterBadge === b ? '' : b"
        />
      </div>
      <USelect
        v-model="filterShift"
        :items="[{ label: 'Semua Shift', value: '' }, { label: 'Shift 1 (Pagi)', value: 'SHIFT-1' }, { label: 'Shift 2 (Malam)', value: 'SHIFT-2' }]"
        label-key="label" value-key="value"
        size="sm" class="w-[160px]"
      />
      <div v-if="filterBadge || filterShift" class="flex items-center gap-1 ml-auto">
        <UBadge color="primary" variant="subtle" size="xs">{{ filterBadge || 'Semua Badge' }} · {{ filterShift || 'Semua Shift' }}</UBadge>
        <UButton label="Reset" size="xs" variant="link" @click="filterBadge = ''; filterShift = ''" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4" v-if="data">
      <UCard>
        <div class="text-center">
          <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Avg PA</div>
          <div class="text-3xl font-extrabold mt-1" :class="avgPA >= 85 ? 'text-green-500' : avgPA >= 70 ? 'text-amber-500' : 'text-red-500'">{{ avgPA }}%</div>
          <div class="mt-2 h-1.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
            <div class="h-full rounded-full" :class="avgPA >= 85 ? 'bg-green-500' : avgPA >= 70 ? 'bg-amber-500' : 'bg-red-500'" :style="{ width: avgPA + '%' }" />
          </div>
          <div class="text-[11px] text-(--ui-text-muted) mt-1">target 85%</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Avg UA</div>
          <div class="text-3xl font-extrabold mt-1" :class="avgUA >= 80 ? 'text-green-500' : avgUA >= 60 ? 'text-amber-500' : 'text-red-500'">{{ avgUA }}%</div>
          <div class="mt-2 h-1.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
            <div class="h-full rounded-full" :class="avgUA >= 80 ? 'bg-green-500' : avgUA >= 60 ? 'bg-amber-500' : 'bg-red-500'" :style="{ width: avgUA + '%' }" />
          </div>
          <div class="text-[11px] text-(--ui-text-muted) mt-1">target 80%</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Running</div>
          <div class="text-3xl font-extrabold mt-1">{{ Math.round(totalRunning / 60) }}<span class="text-base text-(--ui-text-muted) font-normal">j</span></div>
          <div class="text-[11px] text-(--ui-text-muted) mt-1">{{ totalRunning }}m total</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Data Completeness</div>
          <div class="text-3xl font-extrabold mt-1 text-green-500">{{ avgCompleteness }}%</div>
          <div class="mt-2 h-1.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
            <div class="h-full bg-green-500 rounded-full" :style="{ width: avgCompleteness + '%' }" />
          </div>
        </div>
      </UCard>
    </div>
    <div v-else class="grid grid-cols-4 gap-4">
      <UCard v-for="i in 4" :key="i"><USkeleton class="h-16" /></UCard>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-3 flex-wrap text-[11px]">
      <span class="text-(--ui-text-muted) font-semibold">Activity Mix:</span>
      <div v-for="k in activityKeys" :key="k" class="flex items-center gap-1">
        <span class="inline-block w-3 h-2 rounded" :class="activityColors[k]" />
        <span class="text-(--ui-text-muted)">{{ k }}</span>
      </div>
    </div>

    <!-- Skeletons -->
    <div v-if="!data" class="flex flex-col gap-2.5">
      <USkeleton v-for="i in 8" :key="i" class="h-9" />
    </div>

    <UAlert v-else-if="error" color="error" title="Gagal memuat data availabilitas" :description="error?.message" icon="i-lucide-alert-triangle" />

    <template v-else>
      <div v-if="(data ?? []).length === 0" class="text-center py-10 text-(--ui-text-muted)">Tidak ada data untuk filter yang dipilih.</div>
      <UTable v-else :data="data ?? []" :columns="cols">
        <template #unit_id-cell="{ row }">
          <span class="font-semibold font-mono">{{ row.original.unit_id }}</span>
        </template>
        <template #badge-cell="{ row }">
          <UBadge
            :label="row.original.badge"
            :color="row.original.badge === 'DT30' ? 'primary' : row.original.badge === 'DT40' ? 'info' : row.original.badge === 'EX' ? 'warning' : 'neutral'"
            variant="solid" size="xs"
          />
        </template>
        <template #spec-cell="{ row }">
          <span class="text-xs text-(--ui-text-muted)">{{ row.original.spec }}</span>
        </template>
        <template #pa_pct-cell="{ row }">
          <UBadge :color="row.original.pa_pct >= 85 ? 'success' : row.original.pa_pct >= 70 ? 'warning' : 'error'" variant="solid" size="xs">{{ row.original.pa_pct }}%</UBadge>
        </template>
        <template #ua_pct-cell="{ row }">
          <UBadge :color="row.original.ua_pct >= 80 ? 'success' : row.original.ua_pct >= 60 ? 'warning' : 'error'" variant="subtle" size="xs">{{ row.original.ua_pct }}%</UBadge>
        </template>

        <!-- Activity Mix stacked bar -->
        <template #activity_mix-cell="{ row }">
          <div class="flex h-4 rounded overflow-hidden w-40 gap-px" :title="activityKeys.map(k => `${k}: ${row.original.activity_mix?.[k] ?? 0}m`).join(', ')">
            <div
              v-for="k in activityKeys"
              :key="k"
              :class="activityColors[k]"
              :style="{ width: ((row.original.activity_mix?.[k] ?? 0) / mixTotal(row.original) * 100) + '%' }"
              :title="`${k}: ${row.original.activity_mix?.[k] ?? 0}m`"
            />
          </div>
        </template>

        <template #running_min-cell="{ row }">
          <span class="text-xs">{{ row.original.running_min }}m</span>
        </template>
        <template #breakdown_min-cell="{ row }">
          <span class="text-xs" :class="row.original.breakdown_min > 30 ? 'text-red-500 font-semibold' : ''">{{ row.original.breakdown_min }}m</span>
        </template>
        <template #completeness_pct-cell="{ row }">
          <div class="flex items-center gap-2">
            <div class="h-1.5 w-12 bg-(--ui-bg-accented) rounded-full overflow-hidden">
              <div class="h-full rounded-full" :class="row.original.completeness_pct >= 80 ? 'bg-green-500' : 'bg-amber-500'" :style="{ width: row.original.completeness_pct + '%' }" />
            </div>
            <span class="text-xs">{{ row.original.completeness_pct }}%</span>
          </div>
        </template>
      </UTable>
    </template>
  </div>
</template>
