<template>
  <UDashboardPanel id="data-quality">
    <template #header>
      <div class="flex items-center justify-between w-full flex-wrap gap-2">
        <div>
          <h1 class="text-xl font-bold">Data Quality</h1>
          <p class="text-xs text-(--ui-text-muted)">Anomaly detection and audit trail</p>
        </div>
        <UButton label="Refresh" icon="i-lucide-refresh-cw" size="xs" variant="ghost" @click="refreshAll" />
      </div>
    </template>

    <template #body>
      <!-- KPI Cards -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-6" v-if="issues">
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Open Issues</div><div class="text-[28px] font-extrabold mt-1 text-red-500">{{ kpiOpen }}</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">High Severity</div><div class="text-[28px] font-extrabold mt-1 text-amber-500">{{ kpiHigh }}</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Resolved</div><div class="text-[28px] font-extrabold mt-1 text-green-500">{{ kpiResolved }}</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Top Anomaly</div><div class="text-sm font-bold mt-2">{{ kpiTopType }}</div></div></UCard>
      </div>
      <div v-else class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-6">
        <UCard v-for="i in 4" :key="i"><USkeleton class="h-16" /></UCard>
      </div>

      <UTabs :items="tabs" class="w-full">
        <template #anomalies>
          <div class="pt-4">
            <div class="flex gap-2 mb-4 flex-wrap">
              <USelectMenu v-model="filterType" :items="typeOptions" placeholder="All Types" size="xs" class="w-[180px]" />
              <USelectMenu v-model="filterSeverity" :items="sevOptions" placeholder="All Severity" size="xs" class="w-[130px]" />
              <USelectMenu v-model="filterIssueStatus" :items="issStatusOptions" placeholder="All Status" size="xs" class="w-[130px]" />
            </div>

            <div v-if="!issues" class="flex flex-col gap-2.5"><USkeleton v-for="i in 5" :key="i" class="h-9" /></div>
            <template v-else>
              <div v-if="filteredIssues.length === 0" class="text-center py-10 text-(--ui-text-muted)">
                <UIcon name="i-lucide-check-circle" class="size-8 text-green-500 mb-2" />
                <p>No issues match current filters.</p>
              </div>
              <UTable v-else :data="filteredIssues" :columns="issueCols">
                <template #issue_type-cell="{ row }"><UBadge color="primary" variant="subtle" size="xs">{{ row.original.issue_type }}</UBadge></template>
                <template #severity-cell="{ row }"><UBadge :color="row.original.severity === 'CRITICAL' ? 'error' : row.original.severity === 'HIGH' ? 'error' : row.original.severity === 'MEDIUM' ? 'warning' : 'neutral'" variant="solid" size="xs">{{ row.original.severity }}</UBadge></template>
                <template #unit_id-cell="{ row }"><span class="font-semibold">{{ row.original.unit_id }}</span></template>
                <template #detail-cell="{ row }"><span class="text-xs">{{ truncate(row.original.detail, 50) }}</span></template>
                <template #status-cell="{ row }"><UBadge :color="row.original.status === 'OPEN' ? 'error' : row.original.status === 'IN_REVIEW' ? 'warning' : 'success'" :variant="row.original.status === 'RESOLVED' ? 'subtle' : 'solid'" size="xs">{{ row.original.status }}</UBadge></template>
                <template #actions-cell="{ row }">
                  <UButton v-if="row.original.status !== 'RESOLVED'" :label="row.original.status === 'OPEN' ? 'Review' : 'Resolve'" size="xs" :variant="row.original.status === 'OPEN' ? 'soft' : 'solid'" :color="row.original.status === 'OPEN' ? 'warning' : 'success'" @click="transitionIssue(row.original)" />
                </template>
              </UTable>
            </template>
          </div>
        </template>

        <template #audit>
          <div class="pt-4">
            <div v-if="!auditData" class="flex flex-col gap-2.5"><USkeleton v-for="i in 5" :key="i" class="h-9" /></div>
            <template v-else>
              <div v-if="auditData.length === 0" class="text-center py-10 text-(--ui-text-muted)">No audit entries yet.</div>
              <UTable v-else :data="auditData" :columns="auditCols">
                <template #action-cell="{ row }"><UBadge color="info" variant="subtle" size="xs">{{ row.original.action }}</UBadge></template>
                <template #entity_type-cell="{ row }"><span class="text-xs">{{ row.original.entity_type }} <span class="text-(--ui-text-muted)">#{{ row.original.entity_id }}</span></span></template>
                <template #timestamp-cell="{ row }"><span class="text-xs">{{ new Date(row.original.timestamp).toLocaleString() }}</span></template>
                <template #before-cell="{ row }"><span class="text-xs text-(--ui-text-muted)">{{ formatPayload(row.original.payload_before) }}</span></template>
                <template #after-cell="{ row }"><span class="text-xs">{{ formatPayload(row.original.payload_after) }}</span></template>
                <template #reason-cell="{ row }"><span class="text-xs text-(--ui-text-muted)">{{ row.original.reason || '--' }}</span></template>
              </UTable>
            </template>
          </div>
        </template>
      </UTabs>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const filterType = ref<string | undefined>()
const filterSeverity = ref<string | undefined>()
const filterIssueStatus = ref<string | undefined>()

const tabs = [
  { label: 'Anomalies', icon: 'i-lucide-shield-alert', slot: 'anomalies' },
  { label: 'Audit Log', icon: 'i-lucide-file-text', slot: 'audit' },
]

const typeOptions = ['PENDING_TOO_LONG', 'DUPLICATE_TRIP', 'TONNAGE_OUTLIER', 'MISSING_TIMESTAMP', 'STALE_UPDATE']
const sevOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const issStatusOptions = ['OPEN', 'IN_REVIEW', 'RESOLVED']

const { data: issuesRaw, refresh: refreshIssues } = useFetch<any>('/api/data-quality/issues')
const { data: auditData, refresh: refreshAudit } = useFetch<any[]>('/api/data-quality/audit')

const issues = computed(() => {
  if (!issuesRaw.value) return null
  const raw = issuesRaw.value as any
  if (Array.isArray(raw)) return raw
  return raw?.items ?? []
})

const issueCols = [
  { accessorKey: 'issue_type', header: 'Type' },
  { accessorKey: 'severity', header: 'Severity' },
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'detail', header: 'Detail' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'actions', header: '' },
]

const auditCols = [
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'entity_type', header: 'Entity' },
  { accessorKey: 'actor', header: 'Actor' },
  { accessorKey: 'timestamp', header: 'Time' },
  { accessorKey: 'before', header: 'Before' },
  { accessorKey: 'after', header: 'After' },
  { accessorKey: 'reason', header: 'Reason' },
]

const filteredIssues = computed(() => {
  if (!issues.value) return []
  return issues.value.filter(i => {
    if (filterType.value && i.issue_type !== filterType.value) return false
    if (filterSeverity.value && i.severity !== filterSeverity.value) return false
    if (filterIssueStatus.value && i.status !== filterIssueStatus.value) return false
    return true
  })
})

// KPIs
const kpiOpen = computed(() => (issues.value ?? []).filter((i: any) => i.status === 'OPEN').length)
const kpiHigh = computed(() => (issues.value ?? []).filter((i: any) => i.severity === 'HIGH' || i.severity === 'CRITICAL').length)
const kpiResolved = computed(() => (issues.value ?? []).filter((i: any) => i.status === 'RESOLVED').length)
const kpiTopType = computed(() => {
  const counts: Record<string, number> = {}
  ;(issues.value ?? []).forEach((i: any) => { counts[i.issue_type] = (counts[i.issue_type] || 0) + 1 })
  let top = '--'; let max = 0
  Object.entries(counts).forEach(([k, v]) => { if (v > max) { max = v; top = k.replace(/_/g, ' ') } })
  return top
})

function truncate(s: string, n: number) { return s.length > n ? s.slice(0, n) + '...' : s }

function formatPayload(p: any) {
  if (!p) return '--'
  if (typeof p === 'string') return p
  return Object.entries(p).map(([k, v]) => `${k}: ${v}`).join(', ')
}

async function transitionIssue(issue: any) {
  try {
    await $fetch(`/api/data-quality/issues/${issue.issue_id}`, { method: 'PATCH', body: { note: 'Transitioned by supervisor' } })
    await refreshAll()
  } catch {}
}

async function refreshAll() {
  await Promise.all([refreshIssues(), refreshAudit()])
}
</script>
