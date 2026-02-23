<template>
  <UDashboardPanel id="availability">
    <template #header>
      <div class="flex items-center justify-between w-full flex-wrap gap-2">
        <div>
          <h1 class="text-xl font-bold">Availability</h1>
          <p class="text-xs text-(--ui-text-muted)">Physical Availability and Unit Availability tracking</p>
        </div>
        <div class="flex items-center gap-2">
          <USelectMenu v-model="filterShift" :items="['ALL','SHIFT-1','SHIFT-2']" size="xs" class="w-[120px]" />
        </div>
      </div>
    </template>

    <template #body>
      <!-- KPI Cards -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-6" v-if="data">
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Avg PA</div><div class="text-[28px] font-extrabold mt-1" :class="avgPA >= 85 ? 'text-green-500' : avgPA >= 70 ? 'text-amber-500' : 'text-red-500'">{{ avgPA }}%</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Avg UA</div><div class="text-[28px] font-extrabold mt-1" :class="avgUA >= 80 ? 'text-green-500' : avgUA >= 60 ? 'text-amber-500' : 'text-red-500'">{{ avgUA }}%</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Running</div><div class="text-[28px] font-extrabold mt-1">{{ totalRunning }}h</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Data Completeness</div><div class="text-[28px] font-extrabold mt-1">{{ avgCompleteness }}%</div><div class="mt-2 h-1.5 bg-(--ui-bg-accented) rounded-full overflow-hidden"><div class="h-full bg-green-500 rounded-full transition-all duration-300" :style="{ width: avgCompleteness + '%' }" /></div></div></UCard>
      </div>
      <div v-else class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-6">
        <UCard v-for="i in 4" :key="i"><USkeleton class="h-16" /></UCard>
      </div>

      <!-- Table -->
      <div v-if="!data" class="flex flex-col gap-2.5">
        <USkeleton v-for="i in 5" :key="i" class="h-9" />
      </div>

      <UAlert v-else-if="error" color="error" title="Unable to load availability" :description="error?.message" icon="i-lucide-alert-triangle" />

      <template v-else-if="data">
        <div v-if="filtered.length === 0" class="text-center py-10 text-(--ui-text-muted)">No availability data for selected shift.</div>
        <UTable v-else :data="filtered" :columns="cols">
          <template #unit_id-cell="{ row }"><span class="font-semibold">{{ row.original.unit_id }}</span></template>
          <template #running_hours-cell="{ row }"><span>{{ row.original.running_hours }}h</span></template>
          <template #standby_hours-cell="{ row }"><span>{{ row.original.standby_hours }}h</span></template>
          <template #breakdown_hours-cell="{ row }"><span :class="row.original.breakdown_hours > 2 ? 'text-red-500 font-semibold' : ''">{{ row.original.breakdown_hours }}h</span></template>
          <template #delay_hours-cell="{ row }"><span>{{ row.original.delay_hours }}h</span></template>
          <template #pa_pct-cell="{ row }"><UBadge :color="row.original.pa_pct >= 85 ? 'success' : row.original.pa_pct >= 70 ? 'warning' : 'error'" variant="solid" size="xs">{{ row.original.pa_pct }}%</UBadge></template>
          <template #ua_pct-cell="{ row }"><UBadge :color="row.original.ua_pct >= 80 ? 'success' : row.original.ua_pct >= 60 ? 'warning' : 'error'" variant="subtle" size="xs">{{ row.original.ua_pct }}%</UBadge></template>
          <template #completeness_pct-cell="{ row }">
            <div class="flex items-center gap-2">
              <div class="h-1.5 w-16 bg-(--ui-bg-accented) rounded-full overflow-hidden"><div class="h-full rounded-full transition-all duration-300" :class="row.original.completeness_pct >= 80 ? 'bg-green-500' : row.original.completeness_pct >= 60 ? 'bg-amber-500' : 'bg-red-500'" :style="{ width: row.original.completeness_pct + '%' }" /></div>
              <span class="text-xs">{{ row.original.completeness_pct }}%</span>
            </div>
          </template>
        </UTable>
      </template>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const filterShift = ref('ALL')
const { data, error } = useFetch<any[]>('/api/availability')

const cols = [
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'shift_id', header: 'Shift' },
  { accessorKey: 'running_hours', header: 'Running' },
  { accessorKey: 'standby_hours', header: 'Standby' },
  { accessorKey: 'breakdown_hours', header: 'Breakdown' },
  { accessorKey: 'delay_hours', header: 'Delay' },
  { accessorKey: 'pa_pct', header: 'PA %' },
  { accessorKey: 'ua_pct', header: 'UA %' },
  { accessorKey: 'completeness_pct', header: 'Completeness' },
]

const filtered = computed(() => {
  if (!data.value) return []
  if (filterShift.value === 'ALL') return data.value
  return data.value.filter(r => r.shift_id === filterShift.value)
})

const avgPA = computed(() => { const d = filtered.value; if (!d.length) return 0; return Math.round(d.reduce((s: number, r: any) => s + r.pa_pct, 0) / d.length) })
const avgUA = computed(() => { const d = filtered.value; if (!d.length) return 0; return Math.round(d.reduce((s: number, r: any) => s + r.ua_pct, 0) / d.length) })
const totalRunning = computed(() => { const d = filtered.value; return d.reduce((s: number, r: any) => s + r.running_hours, 0) })
const avgCompleteness = computed(() => { const d = filtered.value; if (!d.length) return 0; return Math.round(d.reduce((s: number, r: any) => s + r.completeness_pct, 0) / d.length) })
</script>
