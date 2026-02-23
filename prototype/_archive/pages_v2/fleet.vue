<script setup lang="ts">
const columns = [
  { key: 'unitId', label: 'Unit', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'ownership', label: 'Ownership' },
  { key: 'lastActivity', label: 'Activity' },
  { key: 'assignmentSummary', label: 'Assignment' },
  { key: 'status', label: 'Status' }
]

const search = ref('')
const selectedOwnership = ref('ALL')
const showStaleOnly = ref(false)
const selectedUnitId = ref<string | null>(null)
const isSlideoverOpen = ref(false)

// Polling
const { data, status, refresh, error } = await useFetch('/api/fleet', {
  lazy: true,
  server: false // Client-side polling mostly
})

const lastRefreshed = computed(() => data.value?.lastRefreshedAt ? new Date(data.value.lastRefreshedAt).toLocaleTimeString() : '-')

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    refresh()
  }, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Filter Logic
const filteredRows = computed(() => {
  if (!data.value?.units) return []
  return data.value.units.filter(u => {
    const matchesSearch = u.unitId.toLowerCase().includes(search.value.toLowerCase()) || u.unitName.toLowerCase().includes(search.value.toLowerCase())
    const matchesOwnership = selectedOwnership.value === 'ALL' || u.ownership === selectedOwnership.value
    const matchesStale = !showStaleOnly.value || u.stale
    return matchesSearch && matchesOwnership && matchesStale
  })
})

// Row Click
function onSelect(row: any) {
  selectedUnitId.value = row.unitId
  isSlideoverOpen.value = true
}

// Detail Data
const { data: unitDetail, pending: detailPending } = await useAsyncData(
  () => selectedUnitId.value ? $fetch(`/api/fleet/${selectedUnitId.value}`) : Promise.resolve(null),
  { watch: [selectedUnitId] }
)
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Live Fleet Board" :badge="filteredRows.length">
        <template #right>
          <div class="text-xs text-gray-500 mr-2">
            Refreshed: {{ lastRefreshed }}
          </div>
          <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" :loading="status === 'pending'" @click="refresh" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
            <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search unit..." />
            <USelect v-model="selectedOwnership" :options="['ALL', 'OWN', 'RENTAL']" />
            <UToggle v-model="showStaleOnly" label="Stale Only" />
        </template>
      </UDashboardToolbar>

      <UTable
        :rows="filteredRows"
        :columns="columns"
        :loading="status === 'pending' && !data"
        @select="onSelect"
      >
        <template #unitId-data="{ row }">
            <span class="font-bold">{{ row.unitId }}</span>
            <span class="text-xs text-gray-400 ml-1">{{ row.unitName }}</span>
        </template>
        
        <template #type-data="{ row }">
            <UBadge :color="row.type === 'DUMP_TRUCK' ? 'primary' : 'orange'" variant="subtle" size="xs">{{ row.type }}</UBadge>
        </template>

        <template #ownership-data="{ row }">
             <UBadge :color="row.ownership === 'OWN' ? 'green' : 'blue'" variant="soft" size="xs">{{ row.ownership }}</UBadge>
        </template>

        <template #status-data="{ row }">
            <div class="flex gap-1">
                <UBadge v-if="row.stale" color="gray" variant="outline" size="xs">STALE</UBadge>
                <UBadge v-if="row.openIssueCount > 0" color="red" variant="solid" size="xs">{{ row.openIssueCount }} Issues</UBadge>
                <UBadge v-if="!row.stale && row.openIssueCount === 0" color="green" variant="soft" size="xs">OK</UBadge>
            </div>
        </template>
        
        <template #lastUpdateAt-data="{ row }">
            <span class="text-xs">{{ new Date(row.lastUpdateAt).toLocaleTimeString() }}</span>
        </template>
      </UTable>
    </UDashboardPanel>

    <USlideover v-model="isSlideoverOpen">
      <div class="p-4 flex-1 overflow-y-auto">
        <div v-if="detailPending" class="space-y-2">
            <USkeleton class="h-4 w-3/4" />
            <USkeleton class="h-32 w-full" />
        </div>
        <div v-else-if="unitDetail">
            <h2 class="text-xl font-bold mb-2">{{ unitDetail.unit.unit_name }} ({{ unitDetail.unit.unit_id }})</h2>
            
            <UDivider class="my-4" />
            
            <h3 class="font-semibold mb-2">Timeline</h3>
            <ul class="space-y-2">
                <li v-for="(event, i) in unitDetail.timeline" :key="i" class="text-sm border-l-2 border-gray-200 pl-2 ml-1">
                    <div class="text-xs text-gray-500">{{ new Date(event.time).toLocaleTimeString() }}</div>
                    <div>{{ event.label }}</div>
                </li>
            </ul>

            <UDivider class="my-4" />

            <h3 class="font-semibold mb-2">Active Issues</h3>
            <div v-if="unitDetail.openIssues.length === 0" class="text-sm text-gray-500">No active issues</div>
            <div v-else class="space-y-2">
                 <UCard v-for="issue in unitDetail.openIssues" :key="issue.issue_id">
                    <div class="text-sm font-bold">{{ issue.issue_type }}</div>
                    <div class="text-xs">{{ issue.details }}</div>
                    <UBadge color="red" size="xs" class="mt-1">{{ issue.severity }}</UBadge>
                 </UCard>
            </div>
        </div>
      </div>
    </USlideover>
  </UDashboardPage>
</template>
