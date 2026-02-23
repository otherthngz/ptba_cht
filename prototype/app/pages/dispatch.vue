<template>
  <UDashboardPanel id="dispatch">
    <template #header>
      <div class="flex items-center justify-between w-full flex-wrap gap-2">
        <div>
          <h1 class="text-xl font-bold">Dispatch</h1>
          <p class="text-xs text-(--ui-text-muted)">Assignment management and unit tracking</p>
        </div>
        <div class="flex items-center gap-2">
          <UButton v-if="viewMode === 'table'" icon="i-lucide-layout-grid" size="xs" variant="ghost" @click="viewMode = 'board'" />
          <UButton v-else icon="i-lucide-table" size="xs" variant="ghost" @click="viewMode = 'table'" />
          <UButton label="New Assignment" icon="i-lucide-plus" size="sm" @click="showCreate = true" />
        </div>
      </div>
    </template>

    <template #body>
      <!-- KPI Cards -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-6">
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Active</div><div class="text-[28px] font-extrabold mt-1 text-blue-500">{{ kpiActive }}</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">In Progress</div><div class="text-[28px] font-extrabold mt-1 text-green-500">{{ kpiInProgress }}</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Completed</div><div class="text-[28px] font-extrabold mt-1">{{ kpiCompleted }}</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Unassigned</div><div class="text-[28px] font-extrabold mt-1 text-amber-500">{{ kpiUnassigned }}</div></div></UCard>
      </div>

      <!-- Filter bar -->
      <div class="flex gap-2 mb-4">
        <USelectMenu v-model="filterSt" :items="['ALL','ASSIGNED','IN_PROGRESS','COMPLETED']" size="xs" class="w-[140px]" />
      </div>

      <!-- Board View -->
      <div v-if="viewMode === 'board'" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <div v-for="lane in boardLanes" :key="lane.destination" class="border border-(--ui-border) rounded-lg p-3">
          <h3 class="font-bold text-sm mb-3 text-(--ui-text-muted)">{{ lane.destination }}</h3>
          <div class="flex flex-col gap-2">
            <UCard v-for="a in lane.assignments" :key="a.assignment_id" class="!p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-sm">{{ a.unit_id }}</span>
                <UBadge :color="a.status === 'ASSIGNED' ? 'info' : a.status === 'IN_PROGRESS' ? 'success' : 'neutral'" :variant="a.status === 'COMPLETED' ? 'subtle' : 'solid'" size="xs">{{ a.status }}</UBadge>
              </div>
              <div v-if="a.loading_location_name" class="text-xs text-(--ui-text-muted)">From: {{ a.loading_location_name }}</div>
              <div v-if="a.notes" class="text-xs text-(--ui-text-muted) mt-1">{{ a.notes }}</div>
              <div class="flex gap-1 mt-2">
                <UButton v-if="a.status === 'ASSIGNED'" label="Start" size="xs" variant="soft" color="success" @click="updateStatus(a.assignment_id, 'IN_PROGRESS')" />
                <UButton v-if="a.status === 'IN_PROGRESS'" label="Complete" size="xs" variant="soft" color="neutral" @click="updateStatus(a.assignment_id, 'COMPLETED')" />
              </div>
            </UCard>
            <p v-if="lane.assignments.length === 0" class="text-xs text-(--ui-text-muted) text-center py-4">No assignments</p>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <template v-if="viewMode === 'table'">
        <div v-if="pending && !assignments" class="flex flex-col gap-2.5">
          <USkeleton v-for="i in 4" :key="i" class="h-9" />
        </div>
        <template v-else-if="assignments">
          <div v-if="filteredAssignments.length === 0" class="text-center py-8 text-(--ui-text-muted)">No assignments found.</div>
          <UTable v-else :data="filteredAssignments" :columns="cols">
            <template #unit_id-cell="{ row }"><span class="font-semibold">{{ row.original.unit_id }}</span></template>
            <template #dumping_location_name-cell="{ row }">
              {{ row.original.dumping_location_name }}
              <div v-if="row.original.loading_location_name" class="text-[11px] text-(--ui-text-muted)">from {{ row.original.loading_location_name }}</div>
            </template>
            <template #status-cell="{ row }">
              <UBadge :color="row.original.status === 'ASSIGNED' ? 'info' : row.original.status === 'IN_PROGRESS' ? 'success' : 'neutral'" :variant="row.original.status === 'COMPLETED' ? 'subtle' : 'solid'" size="xs">{{ row.original.status }}</UBadge>
            </template>
            <template #notes-cell="{ row }">
              <span class="text-xs text-(--ui-text-muted)">{{ row.original.notes || '--' }}</span>
            </template>
            <template #actions-cell="{ row }">
              <div class="flex gap-1">
                <UButton v-if="row.original.status === 'ASSIGNED'" label="Start" size="xs" variant="soft" color="success" @click="updateStatus(row.original.assignment_id, 'IN_PROGRESS')" />
                <UButton v-if="row.original.status === 'IN_PROGRESS'" label="Complete" size="xs" variant="soft" color="neutral" @click="updateStatus(row.original.assignment_id, 'COMPLETED')" />
              </div>
            </template>
          </UTable>
        </template>
      </template>

      <!-- Create Assignment Modal -->
      <UModal v-model:open="showCreate" title="New Assignment">
        <template #body>
          <div class="flex flex-col gap-3.5">
            <div>
              <label class="text-xs font-semibold mb-1 block text-(--ui-text-muted)">Unit *</label>
              <USelectMenu v-model="form.unit_id" :items="unitOptions" placeholder="Select unit" size="sm" />
            </div>
            <div>
              <label class="text-xs font-semibold mb-1 block text-(--ui-text-muted)">Destination (Dumping) *</label>
              <USelectMenu v-model="form.dumping_location_id" :items="dumpOptions" placeholder="Select destination" size="sm" />
            </div>
            <div>
              <label class="text-xs font-semibold mb-1 block text-(--ui-text-muted)">Loading Location</label>
              <USelectMenu v-model="form.loading_location_id" :items="loadOptions" placeholder="Optional" size="sm" />
            </div>
            <div>
              <label class="text-xs font-semibold mb-1 block text-(--ui-text-muted)">Notes</label>
              <UTextarea v-model="form.notes" size="sm" placeholder="Optional notes..." :rows="2" />
            </div>
            <UButton label="Create Assignment" icon="i-lucide-plus" size="sm" block :loading="creating" @click="create" />
            <UAlert v-if="createError" color="error" :title="createError" icon="i-lucide-alert-circle" size="sm" />
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const viewMode = ref<'board' | 'table'>('board')
const showCreate = ref(false)
const form = reactive({ unit_id: '', dumping_location_id: '', loading_location_id: '', notes: '' })
const creating = ref(false)
const createError = ref('')
const filterSt = ref('ALL')

const { data: masterData } = useFetch('/api/master-data')
const { data: assignments, pending, refresh } = useFetch<any[]>('/api/dispatch/assignments')

const unitOptions = computed(() => (masterData.value as any)?.units?.filter((u: any) => u.is_active && u.unit_type === 'DUMP_TRUCK').map((u: any) => ({ label: `${u.unit_id} -- ${u.unit_name}`, value: u.unit_id })) ?? [])
const dumpOptions = computed(() => (masterData.value as any)?.locations?.filter((l: any) => l.location_role === 'DUMPING' && l.is_active).map((l: any) => ({ label: l.location_name, value: l.location_id })) ?? [])
const loadOptions = computed(() => (masterData.value as any)?.locations?.filter((l: any) => l.location_role === 'LOADING' && l.is_active).map((l: any) => ({ label: l.location_name, value: l.location_id })) ?? [])

const cols = [
  { accessorKey: 'unit_id', header: 'Unit' },
  { accessorKey: 'dumping_location_name', header: 'Destination' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'notes', header: 'Notes' },
  { accessorKey: 'actions', header: '' },
]

const filteredAssignments = computed(() => {
  if (!assignments.value) return []
  if (filterSt.value === 'ALL') return assignments.value
  return assignments.value.filter((a: any) => a.status === filterSt.value)
})

// KPIs
const kpiActive = computed(() => (assignments.value ?? []).filter((a: any) => a.status === 'ASSIGNED').length)
const kpiInProgress = computed(() => (assignments.value ?? []).filter((a: any) => a.status === 'IN_PROGRESS').length)
const kpiCompleted = computed(() => (assignments.value ?? []).filter((a: any) => a.status === 'COMPLETED').length)
const kpiUnassigned = computed(() => {
  const assignedIds = new Set((assignments.value ?? []).filter((a: any) => a.status !== 'COMPLETED').map((a: any) => a.unit_id))
  const allDT = ((masterData.value as any)?.units ?? []).filter((u: any) => u.is_active && u.unit_type === 'DUMP_TRUCK')
  return allDT.filter((u: any) => !assignedIds.has(u.unit_id)).length
})

// Board view: group by destination
const boardLanes = computed(() => {
  const asnList = filteredAssignments.value
  const groups: Record<string, any[]> = {}
  asnList.forEach((a: any) => {
    const dest = a.dumping_location_name || 'Unknown'
    if (!groups[dest]) groups[dest] = []
    groups[dest].push(a)
  })
  return Object.entries(groups).map(([destination, items]) => ({ destination, assignments: items })).sort((a, b) => a.destination.localeCompare(b.destination))
})

async function create() {
  createError.value = ''
  if (!form.unit_id || !form.dumping_location_id) { createError.value = 'Unit and destination are required.'; return }
  creating.value = true
  try {
    await $fetch('/api/dispatch/assignments', { method: 'POST', body: { unitId: form.unit_id, dumpingLoc: form.dumping_location_id, loadingLoc: form.loading_location_id || undefined, shiftId: 'SHIFT-1', notes: form.notes || undefined } })
    form.unit_id = ''; form.dumping_location_id = ''; form.loading_location_id = ''; form.notes = ''
    showCreate.value = false
    await refresh()
  } catch (e: any) { createError.value = e.data?.statusMessage ?? 'Failed to create.' }
  creating.value = false
}

async function updateStatus(id: string, status: string) {
  try {
    await $fetch(`/api/dispatch/assignments/${id}`, { method: 'PATCH', body: { status } })
    await refresh()
  } catch {}
}
</script>
