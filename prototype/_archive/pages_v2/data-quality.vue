<script setup lang="ts">
const toast = useToast()

// ── Data ──────────────────────────────────────────────────────────────
const statusOptions = ['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED']
const severityOptions = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const selectedStatus = ref('OPEN') // Default to OPEN to see action
const selectedSeverity = ref('ALL')
const search = ref('')

const { data: issues, refresh: refreshIssues, status: listStatus } = await useFetch('/api/data-quality/issues', {
    query: computed(() => ({ 
        status: selectedStatus.value, 
        severity: selectedSeverity.value,
        search: search.value 
    }))
})

const columns = [
  { key: 'issue_id', label: 'ID' },
  { key: 'issue_type', label: 'Type' },
  { key: 'severity', label: 'Severity' },
  { key: 'linked_entity', label: 'Entity' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created', sortable: true },
  { key: 'actions', label: 'Actions' }
]

// ── Detail & Action Logic ─────────────────────────────────────────────
const isSlideoverOpen = ref(false)
const selectedIssueId = ref<string | null>(null)
const { data: issueDetail, pending: detailPending, refresh: refreshDetail } = await useAsyncData(
  'issue-detail',
  () => selectedIssueId.value ? $fetch(`/api/data-quality/issues/${selectedIssueId.value}`) : Promise.resolve(null),
  { watch: [selectedIssueId] }
)

const isResolveModalOpen = ref(false)
const resolveForm = reactive({
    status: 'RESOLVED',
    reason: '',
    actor: 'Data Steward'
})

function onSelectIssue(row: any) {
    selectedIssueId.value = row.issue_id
    isSlideoverOpen.value = true
}

function openResolveModal(issue: any) {
    selectedIssueId.value = issue.issue_id
    resolveForm.status = 'RESOLVED'
    resolveForm.reason = ''
    isResolveModalOpen.value = true
}

async function submitResolution() {
    if (!selectedIssueId.value) return
    try {
        await $fetch(`/api/data-quality/issues/${selectedIssueId.value}`, {
            method: 'PATCH',
            body: resolveForm
        })
        toast.add({ title: 'Updated', description: 'Issue status updated', color: 'green' })
        isResolveModalOpen.value = false
        refreshIssues()
        refreshDetail() // If slideover open
    } catch (e: any) {
        toast.add({ title: 'Error', description: e.statusMessage, color: 'red' })
    }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Data Quality">
             <template #right>
                <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" @click="refreshIssues" />
            </template>
        </UDashboardNavbar>

        <UDashboardToolbar>
            <template #left>
                <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search..." />
                <USelect v-model="selectedStatus" :options="statusOptions" />
                <USelect v-model="selectedSeverity" :options="severityOptions" />
            </template>
        </UDashboardToolbar>

        <UTable
            :rows="issues || []"
            :columns="columns"
            :loading="listStatus === 'pending'"
            @select="onSelectIssue"
        >
            <template #severity-data="{ row }">
                 <UBadge :color="row.severity === 'CRITICAL' ? 'red' : (row.severity === 'HIGH' ? 'orange' : 'yellow')" variant="subtle" size="xs">
                    {{ row.severity }}
                </UBadge>
            </template>

            <template #status-data="{ row }">
                <UBadge :color="row.status === 'RESOLVED' ? 'green' : 'gray'" variant="outline" size="xs">
                    {{ row.status }}
                </UBadge>
            </template>

            <template #linked_entity-data="{ row }">
                <span class="text-xs">{{ row.linked_entity_type }}: {{ row.linked_entity_id }}</span>
            </template>

            <template #created_at-data="{ row }">
                <span class="text-xs text-gray-500">{{ new Date(row.created_at).toLocaleString() }}</span>
            </template>

             <template #actions-data="{ row }">
                <UButton 
                    v-if="row.status !== 'RESOLVED'"
                    icon="i-heroicons-check" 
                    size="xs" 
                    color="green" 
                    variant="ghost" 
                    @click.stop="openResolveModal(row)" 
                    label="Resolve"
                />
            </template>
        </UTable>
    </UDashboardPanel>

    <!-- Detail Slideover -->
    <USlideover v-model="isSlideoverOpen">
       <div class="p-4 flex-1 overflow-y-auto">
            <div v-if="detailPending" class="space-y-4">
                <USkeleton class="h-8 w-1/2" />
                <USkeleton class="h-32 w-full" />
            </div>
            <div v-else-if="issueDetail">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xl font-bold">{{ issueDetail.issue.issue_type }}</h2>
                    <UBadge :color="issueDetail.issue.status === 'RESOLVED' ? 'green' : 'red'">{{ issueDetail.issue.status }}</UBadge>
                </div>
                <div class="text-sm text-gray-500 mb-4">{{ issueDetail.issue.issue_id }}</div>

                <div class="bg-red-50 p-3 rounded mb-4 ring-1 ring-red-100">
                    <div class="font-semibold text-red-800">Detail</div>
                    <p class="text-sm text-red-700">{{ issueDetail.issue.detail }}</p>
                </div>

                <div class="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                        <span class="text-gray-500">Severity:</span> {{ issueDetail.issue.severity }}
                    </div>
                     <div>
                        <span class="text-gray-500">Threshold:</span> {{ issueDetail.issue.rule_threshold }}
                    </div>
                     <div>
                        <span class="text-gray-500">Unit:</span> {{ issueDetail.issue.unit_name }}
                    </div>
                     <div>
                        <span class="text-gray-500">Linked:</span> {{ issueDetail.issue.linked_entity_id }}
                    </div>
                </div>

                <UDivider label="Audit Log" class="mb-4" />
                <ol class="relative border-l border-gray-200 ml-2">
                    <li v-for="(log, i) in issueDetail.audit" :key="i" class="mb-4 ml-4">
                        <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                        <time class="mb-1 text-xs font-normal text-gray-400">{{ new Date(log.timestamp).toLocaleTimeString() }}</time>
                        <h3 class="text-sm font-semibold text-gray-900">{{ log.action }} <span class="text-gray-500">by {{ log.actor }}</span></h3>
                        <p v-if="log.reason" class="text-xs text-gray-500 italic">"{{ log.reason }}"</p>
                    </li>
                </ol>
                
                <div v-if="issueDetail.issue.status !== 'RESOLVED'" class="mt-8">
                     <UButton block color="green" @click="openResolveModal(issueDetail.issue)">Resolve Issue</UButton>
                </div>
            </div>
       </div>
    </USlideover>

    <!-- Resolution Modal -->
    <UModal v-model="isResolveModalOpen">
        <div class="p-4">
            <h3 class="text-lg font-bold mb-4">Resolve Issue {{ selectedIssueId }}</h3>
             <UFormGroup label="Resolution Note (Required)">
                <UTextarea v-model="resolveForm.reason" placeholder="Explain how this was resolved..." />
            </UFormGroup>
            <div class="flex justify-end gap-2 mt-6">
                <UButton color="gray" variant="ghost" @click="isResolveModalOpen = false">Cancel</UButton>
                <UButton color="green" @click="submitResolution">Confirm Resolution</UButton>
            </div>
        </div>
    </UModal>
  </UDashboardPage>
</template>
