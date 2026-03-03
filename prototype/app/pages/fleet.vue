<script setup lang="ts">
const pageTitle = inject<Ref<string>>('pageTitle')
const showToolbar = inject<Ref<boolean>>('showToolbar')

onMounted(() => {
  if (pageTitle) pageTitle.value = 'Fleet Board'
  if (showToolbar) showToolbar.value = false
})

const search = ref('')
const filterType = ref<string | undefined>()
const filterOwnership = ref<string | undefined>()
const filterStatus = ref<string | undefined>()
const polling = ref(true)
const countdown = ref(15)
const lastRefreshTime = ref('--')

const typeOptions = ['DUMP_TRUCK', 'LOADER', 'SUPPORT']
const ownerOptions = ['OWN', 'RENTAL']
const statusOptions = ['OK', 'STALE', 'NO_DATA']

const columns = [
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'unit_type', header: 'Type' },
  { accessorKey: 'ownership', header: 'Ownership' },
  { accessorKey: 'current_assignment', header: 'Assignment' },
  { accessorKey: 'last_activity', header: 'Last Activity' },
  { accessorKey: 'last_update_ts', header: 'Last Update' },
  { accessorKey: 'data_status', header: 'Data Status' },
]

const { data, status, error, refresh } = useFetch('/api/fleet')

const fleetUnits = computed(() => {
  if (!data.value) return []
  const raw = data.value as any
  if (Array.isArray(raw)) return raw
  if (raw?.units && Array.isArray(raw.units)) return raw.units
  return []
})

const filtered = computed(() => {
  return fleetUnits.value.filter((u: any) => {
    if (search.value && !u.unit_id.toLowerCase().includes(search.value.toLowerCase()) && !u.unit_name.toLowerCase().includes(search.value.toLowerCase())) return false
    if (filterType.value && u.unit_type !== filterType.value) return false
    if (filterOwnership.value && u.ownership !== filterOwnership.value) return false
    if (filterStatus.value && u.data_status !== filterStatus.value) return false
    return true
  })
})

const kpiActive = computed(() => fleetUnits.value.filter((u: any) => u.data_status === 'OK').length)
const kpiStale = computed(() => fleetUnits.value.filter((u: any) => u.data_status === 'STALE').length)
const kpiIssues = computed(() => fleetUnits.value.filter((u: any) => u.data_status === 'NO_DATA').length)

function clearFilters() { search.value = ''; filterType.value = undefined; filterOwnership.value = undefined; filterStatus.value = undefined }

function activityColor(a: string) {
  const map: Record<string, string> = { LOADING: 'primary', HAULING: 'info', DUMPING: 'success', STANDBY: 'warning', P2H: 'neutral', IDLE: 'neutral' }
  return map[a] ?? 'neutral'
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'Just now'
  if (diff < 60) return `${diff} min ago`
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`
}

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  timer = setInterval(async () => {
    if (!polling.value) return
    countdown.value--
    if (countdown.value <= 0) {
      try { await $fetch('/api/simulate/tick', { method: 'POST' }) } catch {}
      await refresh()
      lastRefreshTime.value = new Date().toLocaleTimeString()
      countdown.value = 15
    }
  }, 1000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <!-- Filter bar -->
    <div class="flex items-center gap-2 flex-wrap">
      <UInput v-model="search" placeholder="Search unit..." icon="i-lucide-search" size="sm" class="w-[200px]" />
      <USelectMenu v-model="filterType" :items="typeOptions" placeholder="Type" size="sm" class="w-[140px]" />
      <USelectMenu v-model="filterOwnership" :items="ownerOptions" placeholder="Ownership" size="sm" class="w-[120px]" />
      <USelectMenu v-model="filterStatus" :items="statusOptions" placeholder="Data Status" size="sm" class="w-[140px]" />
      <UBadge :color="polling ? 'success' : 'neutral'" variant="subtle" size="xs">
        {{ polling ? `Auto-refresh ${countdown}s` : 'Paused' }}
      </UBadge>
      <UButton :icon="polling ? 'i-lucide-pause' : 'i-lucide-play'" size="xs" variant="ghost" @click="polling = !polling" />
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
      <UCard>
        <div class="text-center">
          <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Active Units</div>
          <div class="text-[28px] font-extrabold mt-1 text-green-500">{{ kpiActive }}</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Stale Units</div>
          <div class="text-[28px] font-extrabold mt-1 text-amber-500">{{ kpiStale }}</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Open Issues</div>
          <div class="text-[28px] font-extrabold mt-1 text-red-500">{{ kpiIssues }}</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Last Refresh</div>
          <div class="text-lg font-bold mt-1">{{ lastRefreshTime }}</div>
        </div>
      </UCard>
    </div>

    <!-- Loading -->
    <div v-if="status === 'pending' && !data" class="flex flex-col gap-3">
      <USkeleton v-for="i in 6" :key="i" class="h-10 w-full" />
    </div>

    <!-- Error -->
    <UAlert v-else-if="status === 'error'" color="error" title="Unable to load fleet data" :description="error?.message" icon="i-lucide-alert-triangle">
      <template #actions>
        <UButton label="Retry" size="xs" @click="refresh()" />
      </template>
    </UAlert>

    <!-- Table -->
    <template v-else-if="data">
      <div v-if="filtered.length === 0" class="text-center py-10 text-(--ui-text-muted)">
        <p>No units match current filters.</p>
        <UButton label="Clear Filters" size="xs" variant="link" @click="clearFilters" />
      </div>
      <UTable v-else :data="filtered" :columns="columns">
        <template #unit_id-cell="{ row }">
          <div>
            <span class="font-semibold">{{ row.original.unit_id }}</span>
            <span class="ml-1.5 text-(--ui-text-muted) text-xs">{{ row.original.unit_name }}</span>
          </div>
        </template>
        <template #unit_type-cell="{ row }">
          <UBadge :color="row.original.unit_type === 'DUMP_TRUCK' ? 'primary' : row.original.unit_type === 'LOADER' ? 'warning' : 'neutral'" variant="subtle" size="xs">
            {{ row.original.unit_type }}
          </UBadge>
        </template>
        <template #ownership-cell="{ row }">
          <UBadge :color="row.original.ownership === 'OWN' ? 'info' : 'neutral'" variant="outline" size="xs">
            {{ row.original.ownership }}
          </UBadge>
        </template>
        <template #current_assignment-cell="{ row }">
          <UBadge v-if="row.original.current_assignment" color="info" variant="subtle" size="xs">
            {{ row.original.current_assignment.dumping_location_name }}
          </UBadge>
          <span v-else class="text-(--ui-text-muted)">--</span>
        </template>
        <template #last_activity-cell="{ row }">
          <UBadge v-if="row.original.last_activity" :color="activityColor(row.original.last_activity)" variant="soft" size="xs">
            {{ row.original.last_activity }}
          </UBadge>
          <span v-else class="text-(--ui-text-muted)">--</span>
        </template>
        <template #last_update_ts-cell="{ row }">
          <span v-if="row.original.last_update_ts" :title="row.original.last_update_ts">{{ timeAgo(row.original.last_update_ts) }}</span>
          <span v-else class="text-(--ui-text-muted)">Never</span>
        </template>
        <template #data_status-cell="{ row }">
          <UBadge :color="row.original.data_status === 'OK' ? 'success' : row.original.data_status === 'STALE' ? 'warning' : 'neutral'" :variant="row.original.data_status === 'OK' ? 'solid' : row.original.data_status === 'STALE' ? 'solid' : 'outline'" size="xs">
            {{ row.original.data_status }}
          </UBadge>
        </template>
      </UTable>
    </template>
  </div>
</template>
