<script setup lang="ts">
const { data } = useFetch<any>('/api/dashboard/summary')

const activeTab = ref('pending')

const tabs = [
  { label: 'Pending Queue', value: 'pending', icon: 'i-lucide-clock' },
  { label: 'Open Issues', value: 'issues', icon: 'i-lucide-alert-triangle' },
  { label: 'Latest Audits', value: 'audits', icon: 'i-lucide-file-text' },
  { label: 'Top Units', value: 'units', icon: 'i-lucide-trophy' },
]

// ── Column definitions for each tab ──
const pendingCols = [
  { accessorKey: 'trip_id', header: 'Trip' },
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'loading_location', header: 'Loading' },
  { accessorKey: 'dumping_location', header: 'Dumping' },
  { accessorKey: 'tonnage_value', header: 'Tonnes' },
  { accessorKey: 'pending_reason', header: 'Reason' },
  { accessorKey: 'age_minutes', header: 'Age' },
]
const issueCols = [
  { accessorKey: 'issue_id', header: 'ID' },
  { accessorKey: 'issue_type', header: 'Type' },
  { accessorKey: 'severity', header: 'Severity' },
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'detail', header: 'Detail' },
  { accessorKey: 'created_at', header: 'Created' },
]
const auditCols = [
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'entity_type', header: 'Entity' },
  { accessorKey: 'entity_id', header: 'Entity ID' },
  { accessorKey: 'actor', header: 'Actor' },
  { accessorKey: 'reason', header: 'Reason' },
  { accessorKey: 'timestamp', header: 'Time' },
]
const unitCols = [
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'unit_type', header: 'Type' },
  { accessorKey: 'ownership', header: 'Ownership' },
  { accessorKey: 'trip_count', header: 'Trips' },
  { accessorKey: 'total_tonnage', header: 'Total Tonnage' },
]

const currentCols = computed(() => {
  switch (activeTab.value) {
    case 'pending': return pendingCols
    case 'issues': return issueCols
    case 'audits': return auditCols
    case 'units': return unitCols
    default: return pendingCols
  }
})

const currentData = computed(() => {
  if (!data.value) return []
  switch (activeTab.value) {
    case 'pending': return data.value.pendingQueue ?? []
    case 'issues': return data.value.openIssues ?? []
    case 'audits': return data.value.latestAudits ?? []
    case 'units': return data.value.topUnits ?? []
    default: return []
  }
})

const viewDetailsLink = computed(() => {
  switch (activeTab.value) {
    case 'pending': return '/production'
    case 'issues': return '/data-quality'
    case 'audits': return '/data-quality'
    case 'units': return '/fleet'
    default: return '/fleet'
  }
})

// ── Helpers ──
function maxBreakdown(arr: any[]) {
  if (!arr?.length) return 1
  return Math.max(...arr.map(b => b.count))
}

function maxTrend(arr: any[]) {
  if (!arr?.length) return 1
  return Math.max(...arr.map(t => t.count))
}

function formatMinutes(m: number) {
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}
</script>

<template>
  <UDashboardPanel id="dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard" icon="i-lucide-layout-dashboard">
        <template #right>
          <div class="flex items-center gap-2">
            <UButton icon="i-lucide-calendar" label="Today" color="neutral" variant="outline" size="sm" />
            <UButton icon="i-lucide-refresh-cw" label="Refresh" color="neutral" variant="ghost" size="sm" @click="$fetch" />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Loading state -->
      <div v-if="!data" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <USkeleton v-for="i in 10" :key="i" class="h-20" />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <USkeleton class="h-64" />
          <USkeleton class="h-64" />
        </div>
        <USkeleton class="h-96" />
      </div>

      <template v-else>
        <!-- ─── KPI Cards Grid (2 rows, 5 per row on lg) ─── -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Active Units</div>
              <div class="text-2xl font-extrabold mt-0.5">{{ data.kpis.activeUnits }}<span class="text-sm font-normal text-(--ui-text-muted)"> / {{ data.kpis.totalUnits }}</span></div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Open Issues</div>
              <div class="text-2xl font-extrabold mt-0.5 text-red-500">{{ data.kpis.openIssues }}</div>
              <div v-if="data.kpis.criticalIssues" class="text-[10px] text-red-400 mt-0.5">{{ data.kpis.criticalIssues }} critical</div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Pending Trips</div>
              <div class="text-2xl font-extrabold mt-0.5 text-amber-500">{{ data.kpis.pendingTrips }}</div>
              <div class="text-[10px] text-(--ui-text-muted) mt-0.5">of {{ data.kpis.totalTrips }} total</div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Confirmed</div>
              <div class="text-2xl font-extrabold mt-0.5 text-green-500">{{ data.kpis.confirmedTrips }}</div>
              <div class="text-[10px] text-(--ui-text-muted) mt-0.5">{{ data.kpis.confirmedTonnage }}t total</div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Manual Entries</div>
              <div class="text-2xl font-extrabold mt-0.5 text-amber-400">{{ data.kpis.manualTrips }}</div>
              <div class="text-[10px] text-(--ui-text-muted) mt-0.5">{{ data.kpis.manualTonnage }}t total</div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Tonnage</div>
              <div class="text-2xl font-extrabold mt-0.5">{{ data.kpis.totalTonnage.toLocaleString() }}t</div>
              <div class="flex gap-1 mt-1">
                <UBadge color="success" variant="subtle" size="xs">{{ data.kpis.confirmedTonnage }}t</UBadge>
                <UBadge color="warning" variant="subtle" size="xs">{{ data.kpis.manualTonnage }}t</UBadge>
              </div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Pending Tonnage</div>
              <div class="text-2xl font-extrabold mt-0.5 text-amber-500">{{ data.kpis.pendingTonnage.toLocaleString() }}t</div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Active Assignments</div>
              <div class="text-2xl font-extrabold mt-0.5">{{ data.kpis.activeAssignments }}</div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Completed</div>
              <div class="text-2xl font-extrabold mt-0.5 text-green-500">{{ data.kpis.completedAssignments }}</div>
            </div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div>
              <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Ritase Today</div>
              <div class="text-2xl font-extrabold mt-0.5">{{ data.kpis.totalTrips }}</div>
            </div>
          </UCard>
        </div>

        <!-- ─── Two Analytics Panels (side-by-side on desktop) ─── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <!-- Panel A: Pending Trend -->
          <UCard>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold">Pending Trend</h3>
                <p class="text-[11px] text-(--ui-text-muted)">Count over time with avg pending age</p>
              </div>
              <UButton to="/production" label="View details" variant="link" size="xs" trailing-icon="i-lucide-arrow-right" />
            </div>

            <!-- Bar chart -->
            <div class="flex items-end gap-1.5 h-36">
              <div
                v-for="(point, idx) in data.pendingTrend"
                :key="idx"
                class="flex-1 flex flex-col items-center gap-1"
              >
                <span class="text-[10px] font-semibold">{{ point.count }}</span>
                <div
                  class="w-full rounded-t transition-all duration-300"
                  :class="point.count > data.kpis.pendingTrips ? 'bg-red-500' : 'bg-amber-500'"
                  :style="{ height: Math.max(4, (point.count / maxTrend(data.pendingTrend)) * 100) + 'px' }"
                />
                <span class="text-[9px] text-(--ui-text-muted)">{{ point.label }}</span>
              </div>
            </div>

            <!-- Avg age row -->
            <div class="flex gap-1.5 mt-2 border-t border-(--ui-border) pt-2">
              <div
                v-for="(point, idx) in data.pendingTrend"
                :key="'age-' + idx"
                class="flex-1 text-center"
              >
                <span class="text-[9px] text-(--ui-text-muted)">{{ formatMinutes(point.avgAge) }}</span>
              </div>
            </div>
            <div class="text-[9px] text-(--ui-text-muted) text-center mt-1">Avg pending age</div>
          </UCard>

          <!-- Panel B: Pending Breakdown by reason -->
          <UCard>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold">Pending Breakdown</h3>
                <p class="text-[11px] text-(--ui-text-muted)">By reason / source</p>
              </div>
              <UButton to="/data-quality" label="View details" variant="link" size="xs" trailing-icon="i-lucide-arrow-right" />
            </div>

            <div class="flex flex-col gap-3">
              <div v-for="item in data.pendingBreakdown" :key="item.reason" class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium">{{ item.reason.replace(/_/g, ' ') }}</span>
                  <span class="text-xs font-bold">{{ item.count }}</span>
                </div>
                <div class="h-2 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div
                    class="h-full bg-amber-500 rounded-full transition-all duration-300"
                    :style="{ width: Math.max(4, (item.count / maxBreakdown(data.pendingBreakdown)) * 100) + '%' }"
                  />
                </div>
              </div>

              <div v-if="!data.pendingBreakdown?.length" class="text-sm text-(--ui-text-muted) text-center py-4">
                No pending data to display
              </div>
            </div>
          </UCard>
        </div>

        <!-- ─── Tabs + Table Section ─── -->
        <UCard>
          <div class="flex items-center justify-between mb-4">
            <div class="flex gap-1">
              <UButton
                v-for="tab in tabs"
                :key="tab.value"
                :label="tab.label"
                :icon="tab.icon"
                :color="activeTab === tab.value ? 'neutral' : 'neutral'"
                :variant="activeTab === tab.value ? 'solid' : 'ghost'"
                size="sm"
                @click="activeTab = tab.value"
              />
            </div>
            <UButton :to="viewDetailsLink" label="View details" variant="link" size="xs" trailing-icon="i-lucide-arrow-right" />
          </div>

          <div class="overflow-auto max-h-[420px] [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-(--ui-bg) [&_thead]:border-b [&_thead]:border-(--ui-border)">
            <UTable :data="currentData" :columns="currentCols">
              <!-- Pending Queue cells -->
              <template #trip_id-cell="{ row }">
                <span class="font-mono text-xs">{{ row.original.trip_id }}</span>
              </template>
              <template #unit_id-cell="{ row }">
                <span class="font-semibold">{{ row.original.unit_id }}</span>
              </template>
              <template #tonnage_value-cell="{ row }">
                <span v-if="row.original.tonnage_value != null">{{ row.original.tonnage_value }}t</span>
                <span v-else class="text-(--ui-text-muted)">--</span>
              </template>
              <template #pending_reason-cell="{ row }">
                <UBadge v-if="row.original.pending_reason" color="warning" variant="subtle" size="xs">{{ row.original.pending_reason.replace(/_/g, ' ') }}</UBadge>
              </template>
              <template #age_minutes-cell="{ row }">
                <span v-if="row.original.age_minutes != null" class="text-xs" :class="row.original.age_minutes > 60 ? 'text-red-500 font-semibold' : ''">
                  {{ formatMinutes(row.original.age_minutes) }}
                </span>
              </template>

              <!-- Issues cells -->
              <template #issue_type-cell="{ row }">
                <UBadge v-if="row.original.issue_type" color="neutral" variant="subtle" size="xs">{{ row.original.issue_type }}</UBadge>
              </template>
              <template #severity-cell="{ row }">
                <UBadge v-if="row.original.severity" :color="row.original.severity === 'CRITICAL' ? 'error' : row.original.severity === 'HIGH' ? 'error' : row.original.severity === 'MEDIUM' ? 'warning' : 'neutral'" size="xs">{{ row.original.severity }}</UBadge>
              </template>
              <template #created_at-cell="{ row }">
                <span v-if="row.original.created_at" class="text-xs">{{ new Date(row.original.created_at).toLocaleString() }}</span>
              </template>

              <!-- Audit cells -->
              <template #action-cell="{ row }">
                <UBadge v-if="row.original.action" color="info" variant="subtle" size="xs">{{ row.original.action }}</UBadge>
              </template>
              <template #timestamp-cell="{ row }">
                <span v-if="row.original.timestamp" class="text-xs">{{ new Date(row.original.timestamp).toLocaleString() }}</span>
              </template>

              <!-- Top Units cells -->
              <template #unit_type-cell="{ row }">
                <UBadge v-if="row.original.unit_type" :color="row.original.unit_type === 'DUMP_TRUCK' ? 'neutral' : 'warning'" variant="subtle" size="xs">{{ row.original.unit_type }}</UBadge>
              </template>
              <template #ownership-cell="{ row }">
                <UBadge v-if="row.original.ownership" :color="row.original.ownership === 'OWN' ? 'info' : 'neutral'" variant="outline" size="xs">{{ row.original.ownership }}</UBadge>
              </template>
              <template #trip_count-cell="{ row }">
                <span v-if="row.original.trip_count != null" class="font-semibold">{{ row.original.trip_count }}</span>
              </template>
              <template #total_tonnage-cell="{ row }">
                <span v-if="row.original.total_tonnage != null">{{ row.original.total_tonnage.toLocaleString() }}t</span>
              </template>
            </UTable>
          </div>
        </UCard>
      </template>
    </template>
  </UDashboardPanel>
</template>
