<script setup lang="ts">
// ── Tab config ──
const tabs = [
  { id: 'production', label: 'Production Report', icon: 'i-lucide-bar-chart-3' },
  { id: 'availability', label: 'Availability Report', icon: 'i-lucide-clock' },
  { id: 'data-quality', label: 'Data Quality Report', icon: 'i-lucide-shield-alert' },
  { id: 'audit', label: 'Audit Log', icon: 'i-lucide-file-text' },
]
const activeTab = ref('production')

// ── Shared filter state ──
const filters = reactive({
  unit_type: 'all',
  ownership: 'all',
  location: '',
  severity: 'all',
  status: 'all',
  action: 'all',
  actor: '',
  entity_type: '',
})

// ── Build query for active tab ──
function notAll(v: string) { return v && v !== 'all' ? v : undefined }

const activeQuery = computed(() => {
  const t = activeTab.value
  if (t === 'production') return { unit_type: notAll(filters.unit_type), ownership: notAll(filters.ownership), location: filters.location || undefined }
  if (t === 'availability') return { unit_type: notAll(filters.unit_type), ownership: notAll(filters.ownership) }
  if (t === 'data-quality') return { severity: notAll(filters.severity), status: notAll(filters.status) }
  if (t === 'audit') return { action: notAll(filters.action), actor: filters.actor || undefined, entity_type: filters.entity_type || undefined }
  return {}
})

const { data, refresh, status: fetchStatus } = useFetch<any>(() => `/api/reports/${activeTab.value}`, {
  query: activeQuery,
  watch: [activeTab],
})

watch(activeTab, () => { nextTick(() => refresh()) })

// ── CSV Export ──
function downloadBlob(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

async function exportCsv() {
  try {
    const res: any = await $fetch(`/api/reports/${activeTab.value}`, {
      query: { ...activeQuery.value, export: 'csv' }
    })
    if (res?.csv) downloadBlob(res.csv, res.filename)
  } catch (e) {
    console.error('Export failed', e)
  }
}

// ── Helpers ──
function maxVal(arr: any[], key: string): number {
  if (!arr?.length) return 1
  return Math.max(...arr.map(r => r[key] ?? 0)) || 1
}

function barColor(label: string): string {
  const l = String(label).toUpperCase()
  if (l.includes('CONFIRM') || l.includes('RESOL') || l.includes('RUNNING')) return 'bg-green-500'
  if (l.includes('PENDING') || l.includes('STANDBY') || l.includes('UPDATE')) return 'bg-amber-500'
  if (l.includes('MANUAL') || l.includes('HIGH') || l.includes('MEDIUM') || l.includes('DELAY')) return 'bg-orange-500'
  if (l.includes('CRITICAL') || l.includes('BREAKDOWN') || l.includes('DELETE')) return 'bg-red-500'
  if (l.includes('CREATE') || l.includes('CONFIRM')) return 'bg-green-500'
  return 'bg-(--ui-text-muted)'
}

// ── Table columns per tab ──
const prodCols = [
  { accessorKey: 'trip_id', header: 'Trip ID' },
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'loading_location', header: 'Loading' },
  { accessorKey: 'dumping_location', header: 'Dumping' },
  { accessorKey: 'tonnage', header: 'Tonnes' },
  { accessorKey: 'tonnage_status', header: 'Status' },
  { accessorKey: 'source', header: 'Source' },
  { accessorKey: 'departure', header: 'Departure' },
]
const availCols = [
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'unit_type', header: 'Type' },
  { accessorKey: 'ownership', header: 'Ownership' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'running_hours', header: 'Running (h)' },
  { accessorKey: 'standby_hours', header: 'Standby (h)' },
  { accessorKey: 'breakdown_hours', header: 'Breakdown (h)' },
  { accessorKey: 'pa_pct', header: 'PA %' },
  { accessorKey: 'ua_pct', header: 'UA %' },
]
const dqCols = [
  { accessorKey: 'issue_id', header: 'ID' },
  { accessorKey: 'issue_type', header: 'Type' },
  { accessorKey: 'severity', header: 'Severity' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'detail', header: 'Detail' },
  { accessorKey: 'created_at', header: 'Created' },
]
const auditCols = [
  { accessorKey: 'log_id', header: 'Log ID' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'entity_type', header: 'Entity' },
  { accessorKey: 'entity_id', header: 'Entity ID' },
  { accessorKey: 'actor', header: 'Actor' },
  { accessorKey: 'reason', header: 'Reason' },
  { accessorKey: 'timestamp', header: 'Time' },
]
const currentCols = computed(() => {
  switch (activeTab.value) {
    case 'production': return prodCols
    case 'availability': return availCols
    case 'data-quality': return dqCols
    case 'audit': return auditCols
    default: return prodCols
  }
})

// ── Filter options ──
const unitTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Dump Truck', value: 'DUMP_TRUCK' },
  { label: 'Loader', value: 'LOADER' },
  { label: 'Grader', value: 'GRADER' },
]
const ownershipOptions = [
  { label: 'All', value: 'all' },
  { label: 'Own', value: 'OWN' },
  { label: 'Rental', value: 'RENTAL' },
]
const severityOptions = [
  { label: 'All Severities', value: 'all' },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
]
const issueStatusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Review', value: 'IN_REVIEW' },
  { label: 'Resolved', value: 'RESOLVED' },
]
const actionOptions = [
  { label: 'All Actions', value: 'all' },
  { label: 'Create', value: 'CREATE' },
  { label: 'Update', value: 'UPDATE' },
  { label: 'Delete', value: 'DELETE' },
  { label: 'Transition', value: 'TRANSITION' },
]

function clearFilters() {
  filters.unit_type = 'all'
  filters.ownership = 'all'
  filters.location = ''
  filters.severity = 'all'
  filters.status = 'all'
  filters.action = 'all'
  filters.actor = ''
  filters.entity_type = ''
  refresh()
}
</script>

<template>
  <UDashboardPanel id="reports">
    <template #header>
      <UDashboardNavbar title="Reports" icon="i-lucide-file-bar-chart">
        <template #right>
          <UButton
            icon="i-lucide-download"
            label="Export CSV"
            color="neutral"
            variant="solid"
            size="sm"
            @click="exportCsv"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- ─── Tab Bar ─── -->
      <div class="flex items-center gap-1 mb-6 border-b border-(--ui-border) pb-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
          :class="activeTab === tab.id
            ? 'border-(--ui-color-primary) text-(--ui-color-primary-600)'
            : 'border-transparent text-(--ui-text-muted) hover:text-(--ui-text)'"
          @click="activeTab = tab.id"
        >
          <UIcon :name="tab.icon" class="size-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- ─── Controls Bar ─── -->
      <UCard class="mb-5" :ui="{ body: 'p-3' }">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Production + Availability filters -->
          <template v-if="activeTab === 'production' || activeTab === 'availability'">
            <USelect
              v-model="filters.unit_type"
              :items="unitTypeOptions"
              value-key="value"
              label-key="label"
              size="sm"
              placeholder="Unit Type"
              class="w-36"
              @change="() => refresh()"
            />
            <USelect
              v-model="filters.ownership"
              :items="ownershipOptions"
              value-key="value"
              label-key="label"
              size="sm"
              placeholder="Ownership"
              class="w-32"
              @change="() => refresh()"
            />
            <UInput
              v-if="activeTab === 'production'"
              v-model="filters.location"
              size="sm"
              placeholder="Location..."
              icon="i-lucide-map-pin"
              class="w-36"
            />
          </template>

          <!-- Data Quality filters -->
          <template v-if="activeTab === 'data-quality'">
            <USelect
              v-model="filters.severity"
              :items="severityOptions"
              value-key="value"
              label-key="label"
              size="sm"
              placeholder="Severity"
              class="w-36"
              @change="() => refresh()"
            />
            <USelect
              v-model="filters.status"
              :items="issueStatusOptions"
              value-key="value"
              label-key="label"
              size="sm"
              placeholder="Status"
              class="w-32"
              @change="() => refresh()"
            />
            <UInput
              v-model="filters.actor"
              size="sm"
              placeholder="Unit ID..."
              icon="i-lucide-truck"
              class="w-32"
            />
          </template>

          <!-- Audit filters -->
          <template v-if="activeTab === 'audit'">
            <USelect
              v-model="filters.action"
              :items="actionOptions"
              value-key="value"
              label-key="label"
              size="sm"
              placeholder="Action"
              class="w-36"
              @change="() => refresh()"
            />
            <UInput
              v-model="filters.actor"
              size="sm"
              placeholder="Actor..."
              icon="i-lucide-user"
              class="w-32"
            />
            <UInput
              v-model="filters.entity_type"
              size="sm"
              placeholder="Entity type..."
              icon="i-lucide-layers"
              class="w-36"
            />
          </template>

          <UButton icon="i-lucide-search" size="sm" color="neutral" label="Apply" @click="() => refresh()" />
          <UButton icon="i-lucide-x" size="sm" color="neutral" variant="ghost" label="Clear" @click="clearFilters" />

          <div class="ms-auto flex items-center gap-2 text-xs text-(--ui-text-muted)">
            <UIcon name="i-lucide-info" class="size-3.5" />
            {{ data?.rows?.length ?? 0 }} records
          </div>
        </div>
      </UCard>

      <!-- ─── Loading ─── -->
      <div v-if="fetchStatus === 'pending' && !data" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <USkeleton v-for="i in 6" :key="i" class="h-16" />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <USkeleton v-for="i in 3" :key="i" class="h-52" />
        </div>
        <USkeleton class="h-80" />
      </div>

      <template v-else-if="data">
        <!-- ─── A) Metric Cards (4–8) ─── -->
        <!-- Production Metrics -->
        <div v-if="activeTab === 'production'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-5">
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Trips</div>
            <div class="text-2xl font-extrabold mt-0.5">{{ data.metrics.totalTrips }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Confirmed</div>
            <div class="text-2xl font-extrabold mt-0.5 text-green-500">{{ data.metrics.confirmedTrips }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Pending</div>
            <div class="text-2xl font-extrabold mt-0.5 text-amber-500">{{ data.metrics.pendingTrips }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Manual</div>
            <div class="text-2xl font-extrabold mt-0.5 text-orange-500">{{ data.metrics.manualTrips }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Tonnage</div>
            <div class="text-2xl font-extrabold mt-0.5">{{ data.metrics.totalTonnage.toLocaleString() }}t</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Confirmed</div>
            <div class="text-2xl font-extrabold mt-0.5 text-green-500">{{ data.metrics.confirmedTonnage.toLocaleString() }}t</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Manual</div>
            <div class="text-2xl font-extrabold mt-0.5 text-orange-500">{{ data.metrics.manualTonnage.toLocaleString() }}t</div>
          </UCard>
        </div>

        <!-- Availability Metrics -->
        <div v-if="activeTab === 'availability'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Units</div>
            <div class="text-2xl font-extrabold mt-0.5">{{ data.metrics.totalUnits }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Active</div>
            <div class="text-2xl font-extrabold mt-0.5 text-green-500">{{ data.metrics.activeUnits }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Running</div>
            <div class="text-2xl font-extrabold mt-0.5">{{ data.metrics.runningUnits }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Breakdown</div>
            <div class="text-2xl font-extrabold mt-0.5 text-red-500">{{ data.metrics.breakdownUnits }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Avg PA</div>
            <div class="text-2xl font-extrabold mt-0.5" :class="data.metrics.avgPA >= 85 ? 'text-green-500' : data.metrics.avgPA >= 70 ? 'text-amber-500' : 'text-red-500'">{{ data.metrics.avgPA }}%</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Avg UA</div>
            <div class="text-2xl font-extrabold mt-0.5" :class="data.metrics.avgUA >= 80 ? 'text-green-500' : data.metrics.avgUA >= 60 ? 'text-amber-500' : 'text-red-500'">{{ data.metrics.avgUA }}%</div>
          </UCard>
        </div>

        <!-- Data Quality Metrics -->
        <div v-if="activeTab === 'data-quality'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Issues</div>
            <div class="text-2xl font-extrabold mt-0.5">{{ data.metrics.totalIssues }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Open</div>
            <div class="text-2xl font-extrabold mt-0.5 text-red-500">{{ data.metrics.openIssues }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">In Review</div>
            <div class="text-2xl font-extrabold mt-0.5 text-amber-500">{{ data.metrics.inReview }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Resolved</div>
            <div class="text-2xl font-extrabold mt-0.5 text-green-500">{{ data.metrics.resolved }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Critical</div>
            <div class="text-2xl font-extrabold mt-0.5 text-red-600">{{ data.metrics.critical }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">High</div>
            <div class="text-2xl font-extrabold mt-0.5 text-orange-500">{{ data.metrics.high }}</div>
          </UCard>
        </div>

        <!-- Audit Metrics -->
        <div v-if="activeTab === 'audit'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Logs</div>
            <div class="text-2xl font-extrabold mt-0.5">{{ data.metrics.totalLogs }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Creates</div>
            <div class="text-2xl font-extrabold mt-0.5 text-green-500">{{ data.metrics.creates }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Updates</div>
            <div class="text-2xl font-extrabold mt-0.5 text-amber-500">{{ data.metrics.updates }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Transitions</div>
            <div class="text-2xl font-extrabold mt-0.5">{{ data.metrics.transitions }}</div>
          </UCard>
          <UCard :ui="{ body: 'p-3' }">
            <div class="text-[11px] font-semibold text-(--ui-text-muted) uppercase tracking-wider">Deletes</div>
            <div class="text-2xl font-extrabold mt-0.5 text-red-500">{{ data.metrics.deletes }}</div>
          </UCard>
        </div>

        <!-- ─── B) Charts (2–3 per tab) ─── -->
        <!-- Production Charts -->
        <div v-if="activeTab === 'production'" class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <!-- Tonnage by Status -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Tonnage by Status</h4>
            <div class="space-y-2.5">
              <div v-for="item in data.charts.tonnageByStatus" :key="item.label">
                <div class="flex justify-between text-xs mb-1">
                  <div class="flex items-center gap-1.5">
                    <UBadge :color="item.label === 'CONFIRMED' ? 'success' : item.label === 'PENDING' ? 'warning' : 'error'" variant="subtle" size="xs">{{ item.label }}</UBadge>
                  </div>
                  <span class="font-semibold">{{ item.count }} trips <span v-if="item.tonnage">({{ item.tonnage }}t)</span></span>
                </div>
                <div class="h-2 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div :class="barColor(item.label)" class="h-full rounded-full transition-all duration-300"
                    :style="{ width: Math.max(4, (item.count / (data.metrics.totalTrips || 1)) * 100) + '%' }" />
                </div>
              </div>
            </div>
          </UCard>

          <!-- Trips per Unit -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Trips per Unit (Top 10)</h4>
            <div class="space-y-1.5">
              <div v-for="item in data.charts.tripsPerUnit" :key="item.unit_id" class="flex items-center gap-2">
                <span class="text-xs font-mono w-16 shrink-0">{{ item.unit_id }}</span>
                <div class="flex-1 h-2 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div class="h-full bg-neutral-500 rounded-full" :style="{ width: (item.count / maxVal(data.charts.tripsPerUnit, 'count')) * 100 + '%' }" />
                </div>
                <span class="text-xs font-semibold w-6 text-right">{{ item.count }}</span>
              </div>
            </div>
          </UCard>

          <!-- Tonnage by Location -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Tonnage by Loading Location</h4>
            <div class="space-y-1.5">
              <div v-for="item in data.charts.tonnageByLocation" :key="item.location" class="flex items-center gap-2">
                <span class="text-xs w-20 shrink-0 truncate">{{ item.location }}</span>
                <div class="flex-1 h-2 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full" :style="{ width: (item.tonnage / maxVal(data.charts.tonnageByLocation, 'tonnage')) * 100 + '%' }" />
                </div>
                <span class="text-xs font-semibold w-14 text-right">{{ item.tonnage }}t</span>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Availability Charts -->
        <div v-if="activeTab === 'availability'" class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <!-- Status Breakdown -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Unit Status Breakdown</h4>
            <div class="space-y-2.5">
              <div v-for="item in data.charts.statusBreakdown" :key="item.label">
                <div class="flex justify-between text-xs mb-1">
                  <span>{{ item.label }}</span>
                  <span class="font-semibold">{{ item.count }}</span>
                </div>
                <div class="h-2.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div :class="barColor(item.label)" class="h-full rounded-full" :style="{ width: Math.max(4, (item.count / (data.metrics.totalUnits || 1)) * 100) + '%' }" />
                </div>
              </div>
            </div>
          </UCard>

          <!-- PA Distribution -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">PA Distribution</h4>
            <div class="space-y-2.5">
              <div v-for="bucket in data.charts.paBuckets" :key="bucket.label">
                <div class="flex justify-between text-xs mb-1">
                  <span>{{ bucket.label }}</span>
                  <span class="font-semibold">{{ bucket.count }}</span>
                </div>
                <div class="h-2.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div class="h-full bg-neutral-500 rounded-full" :style="{ width: Math.max(4, (bucket.count / (data.metrics.totalUnits || 1)) * 100) + '%' }" />
                </div>
              </div>
            </div>
          </UCard>

          <!-- PA by Unit Type -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Avg PA by Unit Type</h4>
            <div class="space-y-2.5">
              <div v-for="item in data.charts.paByUnitType" :key="item.unit_type">
                <div class="flex justify-between text-xs mb-1">
                  <span>{{ item.unit_type }}</span>
                  <span class="font-semibold">{{ item.avg_pa }}%</span>
                </div>
                <div class="h-2.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div :class="item.avg_pa >= 85 ? 'bg-green-500' : item.avg_pa >= 70 ? 'bg-amber-500' : 'bg-red-500'" class="h-full rounded-full" :style="{ width: item.avg_pa + '%' }" />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Data Quality Charts -->
        <div v-if="activeTab === 'data-quality'" class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <!-- By Type -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Issues by Type</h4>
            <div class="space-y-1.5">
              <div v-for="item in data.charts.issuesByType" :key="item.type" class="flex items-center gap-2">
                <span class="text-xs truncate w-32 shrink-0">{{ item.type.replace(/_/g, ' ') }}</span>
                <div class="flex-1 h-2 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div class="h-full bg-neutral-500 rounded-full" :style="{ width: (item.count / maxVal(data.charts.issuesByType, 'count')) * 100 + '%' }" />
                </div>
                <span class="text-xs font-semibold w-5 text-right">{{ item.count }}</span>
              </div>
            </div>
          </UCard>

          <!-- By Severity -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">By Severity</h4>
            <div class="space-y-2.5">
              <div v-for="item in data.charts.bySeverity" :key="item.label">
                <div class="flex justify-between text-xs mb-1">
                  <span>{{ item.label }}</span>
                  <span class="font-semibold">{{ item.count }}</span>
                </div>
                <div class="h-2.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div :class="barColor(item.label)" class="h-full rounded-full" :style="{ width: Math.max(4, (item.count / (data.metrics.totalIssues || 1)) * 100) + '%' }" />
                </div>
              </div>
            </div>
          </UCard>

          <!-- By Status -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">By Status</h4>
            <div class="space-y-2.5">
              <div v-for="item in data.charts.byStatus" :key="item.label">
                <div class="flex justify-between text-xs mb-1">
                  <span>{{ item.label }}</span>
                  <span class="font-semibold">{{ item.count }}</span>
                </div>
                <div class="h-2.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div :class="barColor(item.label)" class="h-full rounded-full" :style="{ width: Math.max(4, (item.count / (data.metrics.totalIssues || 1)) * 100) + '%' }" />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Audit Charts -->
        <div v-if="activeTab === 'audit'" class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <!-- By Action -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Logs by Action</h4>
            <div class="space-y-2.5">
              <div v-for="item in data.charts.logsByAction" :key="item.action">
                <div class="flex justify-between text-xs mb-1">
                  <span>{{ item.action }}</span>
                  <span class="font-semibold">{{ item.count }}</span>
                </div>
                <div class="h-2.5 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div :class="barColor(item.action)" class="h-full rounded-full" :style="{ width: Math.max(4, (item.count / (data.metrics.totalLogs || 1)) * 100) + '%' }" />
                </div>
              </div>
            </div>
          </UCard>

          <!-- By Entity -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Logs by Entity Type</h4>
            <div class="space-y-1.5">
              <div v-for="item in data.charts.logsByEntity" :key="item.entity_type" class="flex items-center gap-2">
                <span class="text-xs truncate w-24 shrink-0">{{ item.entity_type }}</span>
                <div class="flex-1 h-2 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div class="h-full bg-neutral-500 rounded-full" :style="{ width: (item.count / maxVal(data.charts.logsByEntity, 'count')) * 100 + '%' }" />
                </div>
                <span class="text-xs font-semibold w-5 text-right">{{ item.count }}</span>
              </div>
            </div>
          </UCard>

          <!-- By Actor -->
          <UCard>
            <h4 class="text-sm font-bold mb-3">Top Actors</h4>
            <div class="space-y-1.5">
              <div v-for="item in data.charts.logsByActor" :key="item.actor" class="flex items-center gap-2">
                <span class="text-xs truncate w-20 shrink-0">{{ item.actor }}</span>
                <div class="flex-1 h-2 bg-(--ui-bg-accented) rounded-full overflow-hidden">
                  <div class="h-full bg-neutral-500 rounded-full" :style="{ width: (item.count / maxVal(data.charts.logsByActor, 'count')) * 100 + '%' }" />
                </div>
                <span class="text-xs font-semibold w-5 text-right">{{ item.count }}</span>
              </div>
            </div>
          </UCard>
        </div>

        <!-- ─── C) Detail Table ─── -->
        <UCard>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-bold">
              {{ activeTab === 'production' ? 'Trip Records' :
                 activeTab === 'availability' ? 'Unit Availability' :
                 activeTab === 'data-quality' ? 'Issue Records' : 'Audit Events' }}
            </h4>
            <UButton icon="i-lucide-download" label="Download current view" size="xs" variant="ghost" color="neutral" @click="exportCsv" />
          </div>

          <div class="overflow-auto max-h-[480px] [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-(--ui-bg) [&_thead]:border-b [&_thead]:border-(--ui-border)">
          <UTable :data="data.rows" :columns="currentCols">
            <!-- Production cells -->
            <template #trip_id-cell="{ row }">
              <span class="font-mono text-xs">{{ row.original.trip_id }}</span>
            </template>
            <template #tonnage-cell="{ row }">
              <span v-if="row.original.tonnage !== ''">{{ row.original.tonnage }}t</span>
              <span v-else class="text-(--ui-text-muted)">--</span>
            </template>
            <template #tonnage_status-cell="{ row }">
              <UBadge :color="row.original.tonnage_status === 'CONFIRMED' ? 'success' : row.original.tonnage_status === 'MANUAL' ? 'warning' : 'neutral'" :variant="row.original.tonnage_status === 'PENDING' ? 'outline' : 'solid'" size="xs">{{ row.original.tonnage_status }}</UBadge>
            </template>
            <template #departure-cell="{ row }">
              <span class="text-xs">{{ (row.original as any).departure ? new Date((row.original as any).departure as string).toLocaleString() : '--' }}</span>
            </template>

            <!-- Availability cells -->
            <template #status-cell="{ row }">
              <UBadge v-if="row.original.status" :color="row.original.status === 'RUNNING' ? 'success' : row.original.status === 'STANDBY' ? 'warning' : 'error'" size="xs">{{ row.original.status }}</UBadge>
            </template>
            <template #pa_pct-cell="{ row }">
              <UBadge v-if="(row.original as any).pa_pct !== undefined" :color="(row.original as any).pa_pct >= 85 ? 'success' : (row.original as any).pa_pct >= 70 ? 'warning' : 'error'" size="xs">{{ (row.original as any).pa_pct }}%</UBadge>
            </template>
            <template #ua_pct-cell="{ row }">
              <UBadge v-if="(row.original as any).ua_pct !== undefined" :color="(row.original as any).ua_pct >= 80 ? 'success' : (row.original as any).ua_pct >= 60 ? 'warning' : 'error'" variant="subtle" size="xs">{{ (row.original as any).ua_pct }}%</UBadge>
            </template>
            <template #unit_type-cell="{ row }">
              <UBadge v-if="row.original.unit_type" color="neutral" variant="subtle" size="xs">{{ row.original.unit_type }}</UBadge>
            </template>
            <template #ownership-cell="{ row }">
              <UBadge v-if="row.original.ownership" :color="row.original.ownership === 'OWN' ? 'info' : 'neutral'" variant="outline" size="xs">{{ row.original.ownership }}</UBadge>
            </template>

            <!-- Data Quality cells -->
            <template #severity-cell="{ row }">
              <UBadge v-if="row.original.severity" :color="row.original.severity === 'CRITICAL' ? 'error' : row.original.severity === 'HIGH' ? 'error' : row.original.severity === 'MEDIUM' ? 'warning' : 'neutral'" size="xs">{{ row.original.severity }}</UBadge>
            </template>
            <template #issue_type-cell="{ row }">
              <UBadge v-if="row.original.issue_type" color="neutral" variant="subtle" size="xs">{{ row.original.issue_type }}</UBadge>
            </template>
            <template #created_at-cell="{ row }">
              <span class="text-xs">{{ (row.original as any).created_at ? new Date((row.original as any).created_at as string).toLocaleString() : '' }}</span>
            </template>

            <!-- Audit cells -->
            <template #action-cell="{ row }">
              <UBadge v-if="row.original.action" :color="row.original.action === 'CREATE' ? 'success' : row.original.action === 'DELETE' ? 'error' : row.original.action === 'UPDATE' ? 'warning' : 'info'" size="xs">{{ row.original.action }}</UBadge>
            </template>
            <template #log_id-cell="{ row }">
              <span class="font-mono text-xs">{{ row.original.log_id }}</span>
            </template>
            <template #timestamp-cell="{ row }">
              <span class="text-xs">{{ (row.original as any).timestamp ? new Date((row.original as any).timestamp as string).toLocaleString() : '' }}</span>
            </template>
           </UTable>
          </div>
        </UCard>
      </template>
    </template>
  </UDashboardPanel>
</template>
