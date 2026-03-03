<script setup lang="ts">
const pageTitle = inject<Ref<string>>('pageTitle')
const showToolbar = inject<Ref<boolean>>('showToolbar')

onMounted(() => {
  if (pageTitle) pageTitle.value = 'Produksi'
  if (showToolbar) showToolbar.value = false
})

const filterTonnage = ref('ALL')
const tripSearch = ref('')
const showTrip = ref(false)
const selectedTrip = ref<any>(null)
const manualTonnage = ref<number | null>(null)
const manualReason = ref('')
const submitting = ref(false)
const manualError = ref('')

const { data: kpis, refresh: refreshKpis } = useFetch<any>('/api/production/kpis')
const { data: tripsData, refresh: refreshTrips } = useFetch<any[]>('/api/production/trips')

const tripCols = [
  { accessorKey: 'trip_id', header: 'Trip' },
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'loading_location', header: 'Loading' },
  { accessorKey: 'dumping_location', header: 'Dumping' },
  { accessorKey: 'tonnage_value', header: 'Tonnes' },
  { accessorKey: 'tonnage_status', header: 'Status' },
  { accessorKey: 'tonnage_source', header: 'Source' },
]

const filteredTrips = computed(() => {
  if (!tripsData.value) return []
  return tripsData.value.filter(t => {
    if (filterTonnage.value !== 'ALL' && t.tonnage_status !== filterTonnage.value) return false
    if (tripSearch.value && !t.unit_id.toLowerCase().includes(tripSearch.value.toLowerCase())) return false
    return true
  })
})

function tonnageColor(s: string) { return s === 'CONFIRMED' ? 'success' : s === 'MANUAL' ? 'warning' : 'neutral' }

function openTrip(t: any) {
  selectedTrip.value = { ...t }; manualTonnage.value = null; manualReason.value = ''; manualError.value = ''
  showTrip.value = true
}

async function submitManual() {
  manualError.value = ''
  if (!manualTonnage.value || !manualReason.value) { manualError.value = 'Tonnage and reason are required.'; return }
  submitting.value = true
  try {
    await $fetch('/api/production/manual-tonnage', { method: 'POST', body: { trip_id: selectedTrip.value.trip_id, tonnage: manualTonnage.value, reason: manualReason.value } })
    showTrip.value = false
    await Promise.all([refreshKpis(), refreshTrips()])
  } catch (e: any) { manualError.value = e.data?.statusMessage ?? 'Submission failed.' }
  submitting.value = false
}
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <!-- Filter bar -->
    <div class="flex gap-2 items-center flex-wrap">
      <USelectMenu v-model="filterTonnage" :items="['ALL','CONFIRMED','PENDING','MANUAL']" size="xs" class="w-[130px]" />
      <UInput v-model="tripSearch" placeholder="Search unit..." size="xs" icon="i-lucide-search" class="w-[160px]" />
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4" v-if="kpis">
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Ritase (Trips)</div><div class="text-[28px] font-extrabold mt-1">{{ kpis.total_trips }}</div></div></UCard>
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Confirmed Tonnage</div><div class="text-[28px] font-extrabold mt-1 text-green-500">{{ kpis.tonnage_confirmed_total.toFixed(1) }}t</div><div class="text-xs text-(--ui-text-muted)">{{ kpis.tonnage_confirmed_trips }} trips</div></div></UCard>
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Manual Tonnage</div><div class="text-[28px] font-extrabold mt-1 text-amber-500">{{ kpis.tonnage_manual_total.toFixed(1) }}t</div><div class="text-xs text-(--ui-text-muted)">{{ kpis.tonnage_manual_trips }} trips</div></div></UCard>
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Pending</div><div class="text-[28px] font-extrabold mt-1">{{ kpis.tonnage_pending_trips }}</div><div class="text-xs text-(--ui-text-muted)">trips</div></div></UCard>
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Coverage</div><div class="text-[28px] font-extrabold mt-1">{{ kpis.tonnage_coverage_pct }}%</div><div class="text-xs text-(--ui-text-muted)">{{ kpis.tonnage_coverage_label }}</div><div class="mt-2 h-1.5 bg-(--ui-bg-accented) rounded-full overflow-hidden"><div class="h-full bg-green-500 rounded-full transition-all duration-300" :style="{ width: kpis.tonnage_coverage_pct + '%' }" /></div></div></UCard>
    </div>
    <div v-else class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
      <UCard v-for="i in 5" :key="i"><USkeleton class="h-20" /></UCard>
    </div>

    <!-- Trip List -->
    <div v-if="!tripsData" class="flex flex-col gap-2.5"><USkeleton v-for="i in 5" :key="i" class="h-9" /></div>
    <template v-else>
      <div v-if="filteredTrips.length === 0" class="text-center py-8 text-(--ui-text-muted)">No trips found for current filters.</div>
      <UTable v-else :data="filteredTrips" :columns="tripCols">
        <template #trip_id-cell="{ row }"><UButton :label="row.original.trip_id" size="xs" variant="link" @click="openTrip(row.original)" /></template>
        <template #unit_id-cell="{ row }"><span class="font-semibold">{{ row.original.unit_id }}</span></template>
        <template #tonnage_value-cell="{ row }">
          <span v-if="row.original.tonnage_value !== null">{{ row.original.tonnage_value }}t</span>
          <span v-else class="text-(--ui-text-muted)">--</span>
        </template>
        <template #tonnage_status-cell="{ row }">
          <UBadge :color="tonnageColor(row.original.tonnage_status)" :variant="row.original.tonnage_status === 'PENDING' ? 'outline' : row.original.tonnage_status === 'MANUAL' ? 'soft' : 'solid'" size="xs">{{ row.original.tonnage_status }}</UBadge>
          <UBadge v-if="row.original.is_duplicate_flagged" color="error" variant="subtle" size="xs" class="ml-1">DUP</UBadge>
        </template>
        <template #tonnage_source-cell="{ row }"><span class="text-xs text-(--ui-text-muted)">{{ row.original.tonnage_source ?? row.original.entered_by ?? '--' }}</span></template>
      </UTable>
    </template>

    <!-- Trip Detail Modal -->
    <UModal v-model:open="showTrip" :title="selectedTrip?.trip_id ?? ''">
      <template #body>
        <div v-if="selectedTrip" class="flex flex-col gap-4">
          <div class="flex gap-6 flex-wrap">
            <div><span class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Unit</span><br/>{{ selectedTrip.unit_id }}</div>
            <div><span class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Loading</span><br/>{{ selectedTrip.loading_location }}</div>
            <div><span class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Dumping</span><br/>{{ selectedTrip.dumping_location }}</div>
            <div><span class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Time</span><br/>{{ selectedTrip.dump_done_ts ? new Date(selectedTrip.dump_done_ts).toLocaleTimeString() : '--' }}</div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Tonnage Status</span>
            <UBadge :color="tonnageColor(selectedTrip.tonnage_status)" :variant="selectedTrip.tonnage_status === 'PENDING' ? 'outline' : 'solid'" size="md">{{ selectedTrip.tonnage_status }}</UBadge>
          </div>
          <div v-if="selectedTrip.tonnage_value !== null">
            <span class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Value:</span> {{ selectedTrip.tonnage_value }}t
            <span v-if="selectedTrip.tonnage_source" class="text-(--ui-text-muted) text-xs ml-2">({{ selectedTrip.tonnage_source }})</span>
          </div>
          <div v-if="selectedTrip.manual_reason">
            <span class="text-[11px] font-semibold text-(--ui-text-muted) uppercase">Manual Reason:</span> {{ selectedTrip.manual_reason }}
            <div class="text-xs text-(--ui-text-muted)">Entered by: {{ selectedTrip.entered_by }}</div>
          </div>
          <UCard v-if="selectedTrip.tonnage_status === 'PENDING'" variant="subtle" class="border border-dashed border-(--ui-border)">
            <h4 class="font-bold text-[13px] mb-3">Manual Tonnage Entry (Checker Fallback)</h4>
            <div class="flex flex-col gap-2.5">
              <UInput v-model.number="manualTonnage" type="number" placeholder="Tonnage (t)" size="sm" />
              <UTextarea v-model="manualReason" placeholder="Reason (required)..." :rows="2" size="sm" />
              <UButton label="Submit Manual Tonnage" size="sm" color="warning" :loading="submitting" @click="submitManual" />
              <UAlert v-if="manualError" color="error" :title="manualError" size="sm" />
            </div>
          </UCard>
        </div>
      </template>
    </UModal>
  </div>
</template>
