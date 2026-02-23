<script setup lang="ts">
const toast = useToast()

// ── Data ──────────────────────────────────────────────────────────────
const { data: assignments, refresh: refreshAssignments, status: listStatus } = await useFetch('/api/dispatch/assignments')
const { data: units } = await useFetch('/api/master-data/units')
const { data: locations } = await useFetch('/api/master-data/locations')
const { data: shifts } = await useFetch('/api/master-data/shifts')

// ── Options ───────────────────────────────────────────────────────────
const unitOptions = computed(() => units.value?.map(u => ({ label: u.unit_name, value: u.unit_id })) || [])
const loadOptions = computed(() => locations.value?.filter(l => l.location_type === 'LOADING').map(l => ({ label: l.location_name, value: l.location_id })) || [])
const dumpOptions = computed(() => locations.value?.filter(l => ['DUMPING', 'STOCKPILE', 'JETTY'].includes(l.location_type)).map(l => ({ label: l.location_name, value: l.location_id })) || [])
const shiftOptions = computed(() => shifts.value?.map(s => ({ label: s.shift_name, value: s.shift_id })) || [])
const statusOptions = ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

// ── Columns ───────────────────────────────────────────────────────────
const columns = [
  { key: 'assignmentId', label: 'ID' },
  { key: 'unitName', label: 'Unit', sortable: true },
  { key: 'loadingLocation', label: 'Loading' },
  { key: 'dumpingLocation', label: 'Dumping' },
  { key: 'status', label: 'Status' },
  { key: 'startTime', label: 'Updated' },
  { key: 'actions', label: 'Actions' }
]

// ── Create Logic ──────────────────────────────────────────────────────
const isCreateOpen = ref(false)
const createForm = reactive({
    unitId: '',
    shiftId: 'SHIFT-1',
    loadingLoc: '',
    dumpingLoc: ''
})

async function submitCreate() {
    try {
        await $fetch('/api/dispatch/assignments', {
            method: 'POST',
            body: createForm
        })
        toast.add({ title: 'Success', description: 'Assignment created', color: 'green' })
        isCreateOpen.value = false
        refreshAssignments()
        // Reset form
        createForm.unitId = ''
        createForm.loadingLoc = ''
        createForm.dumpingLoc = ''
    } catch (e: any) {
        toast.add({ title: 'Error', description: e.statusMessage, color: 'red' })
    }
}

// ── Edit Logic ────────────────────────────────────────────────────────
const isEditOpen = ref(false)
const editForm = reactive({
    id: '',
    status: '',
    loadingLoc: '',
    dumpingLoc: '',
    note: ''
})
const selectedAssignment = ref<any>(null)

function openEdit(row: any) {
    selectedAssignment.value = row
    editForm.id = row.assignmentId
    editForm.status = row.status
    editForm.loadingLoc = locations.value?.find(l => l.location_name === row.loadingLocation)?.location_id || ''
    editForm.dumpingLoc = locations.value?.find(l => l.location_name === row.dumpingLocation)?.location_id || ''
    editForm.note = ''
    isEditOpen.value = true
}

async function submitEdit() {
    try {
        await $fetch(`/api/dispatch/assignments/${editForm.id}`, {
            method: 'PATCH',
            body: {
                status: editForm.status,
                loadingLoc: editForm.loadingLoc,
                dumpingLoc: editForm.dumpingLoc,
                note: editForm.note
            }
        })
        toast.add({ title: 'Updated', description: 'Assignment updated', color: 'green' })
        isEditOpen.value = false
        refreshAssignments()
    } catch (e: any) {
        toast.add({ title: 'Error', description: e.statusMessage, color: 'red' })
    }
}

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Dispatch Management">
            <template #right>
                <UButton label="New Assignment" icon="i-heroicons-plus" color="black" @click="isCreateOpen = true" />
            </template>
        </UDashboardNavbar>

        <UTable
            :rows="assignments || []"
            :columns="columns"
            :loading="listStatus === 'pending'"
        >
            <template #unitName-data="{ row }">
                <span class="font-bold">{{ row.unitName }}</span>
            </template>

            <template #status-data="{ row }">
                <UBadge :color="row.status === 'IN_PROGRESS' ? 'blue' : (row.status === 'COMPLETED' ? 'green' : 'gray')" variant="subtle" size="xs">
                    {{ row.status }}
                </UBadge>
            </template>

            <template #startTime-data="{ row }">
                <span class="text-xs text-gray-500">{{ new Date(row.startTime).toLocaleTimeString() }}</span>
            </template>

            <template #actions-data="{ row }">
                <UButton icon="i-heroicons-pencil-square" size="xs" color="gray" variant="ghost" @click="openEdit(row)" />
            </template>
        </UTable>
    </UDashboardPanel>

    <!-- Create Slideover -->
    <USlideover v-model="isCreateOpen" title="New Dispatch">
        <div class="p-4 space-y-4">
            <h3 class="text-lg font-bold">Create Assignment</h3>
            <UFormGroup label="Unit">
                <USelectMenu v-model="createForm.unitId" :options="unitOptions" value-attribute="value" option-attribute="label" searchable />
            </UFormGroup>
            <UFormGroup label="Shift">
                <USelectMenu v-model="createForm.shiftId" :options="shiftOptions" value-attribute="value" option-attribute="label" />
            </UFormGroup>
            <UFormGroup label="Loading Location">
                <USelectMenu v-model="createForm.loadingLoc" :options="loadOptions" value-attribute="value" option-attribute="label" searchable />
            </UFormGroup>
            <UFormGroup label="Dumping Location">
                <USelectMenu v-model="createForm.dumpingLoc" :options="dumpOptions" value-attribute="value" option-attribute="label" searchable />
            </UFormGroup>
            <div class="pt-4">
                <UButton block color="black" @click="submitCreate">Dispatch Unit</UButton>
            </div>
        </div>
    </USlideover>

    <!-- Edit Slideover -->
    <USlideover v-model="isEditOpen">
        <div class="p-4 space-y-4">
            <h3 class="text-lg font-bold">Update Assignment</h3>
            <div v-if="selectedAssignment" class="mb-4 p-3 bg-gray-50 rounded">
                <div class="text-sm font-bold">{{ selectedAssignment.unitName }}</div>
                <div class="text-xs text-gray-500">{{ selectedAssignment.assignmentId }}</div>
            </div>

            <UFormGroup label="Status">
                <USelect v-model="editForm.status" :options="statusOptions" />
            </UFormGroup>
            
            <UDivider label="Re-Route" class="my-2"/>
            
            <UFormGroup label="Loading Location">
                <USelectMenu v-model="editForm.loadingLoc" :options="loadOptions" value-attribute="value" option-attribute="label" searchable />
            </UFormGroup>
            <UFormGroup label="Dumping Location">
                <USelectMenu v-model="editForm.dumpingLoc" :options="dumpOptions" value-attribute="value" option-attribute="label" searchable />
            </UFormGroup>

            <UFormGroup label="Change Reason (Audit)">
                <UTextarea v-model="editForm.note" placeholder="Required for audit trail..." />
            </UFormGroup>

            <div class="pt-4">
                <UButton block color="orange" @click="submitEdit">Update Assignment</UButton>
            </div>
        </div>
    </USlideover>

  </UDashboardPage>
</template>
