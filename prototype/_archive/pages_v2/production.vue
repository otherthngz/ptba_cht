<script setup lang="ts">
// Page for Production & Tonnage Management
const toast = useToast()

// ── Status Options ────────────────────────────────────────────────────
const statusOptions = ['ALL', 'CONFIRMED', 'PENDING', 'MANUAL']
const selectedStatus = ref('ALL')
const search = ref('')

// ── Data Fetching ─────────────────────────────────────────────────────
const { data: kpis, refresh: refreshKpis } = await useFetch('/api/production/kpis')
const { data: trips, status: tableStatus, refresh: refreshTrips } = await useFetch('/api/production/trips', {
    query: computed(() => ({ status: selectedStatus.value, search: search.value }))
})

// ── Columns ───────────────────────────────────────────────────────────
const columns = [
  { key: 'tripId', label: 'Trip ID' },
  { key: 'unitId', label: 'Unit' },
  { key: 'route', label: 'Route' },
  { key: 'tonnage', label: 'Tonnage (t)', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'dumpTime', label: 'Dump Time', sortable: true },
  { key: 'actions', label: 'Actions' }
]

// ── Slideover Logic ───────────────────────────────────────────────────
const isSlideoverOpen = ref(false)
const selectedTripId = ref<string | null>(null)
const { data: tripDetail, pending: detailPending, refresh: refreshDetail } = await useAsyncData(
  'trip-detail',
  () => selectedTripId.value ? $fetch(`/api/production/trips/${selectedTripId.value}`) : Promise.resolve(null),
  { watch: [selectedTripId] }
)

function onSelectTrip(row: any) {
    selectedTripId.value = row.tripId
    isSlideoverOpen.value = true
}

// ── Manual Tonnage Modal ──────────────────────────────────────────────
const isManualModalOpen = ref(false)
const manualForm = reactive({
    tripId: '',
    tonnage: 0,
    reason: '',
    actor: 'Dispatcher (User)'
})

function openManualModal(tripId: string) {
    manualForm.tripId = tripId
    manualForm.tonnage = 0
    manualForm.reason = ''
    isManualModalOpen.value = true
}

async function submitManualTonnage() {
    try {
        await $fetch('/api/production/tonnage/manual', {
            method: 'POST',
            body: manualForm
        })
        toast.add({ title: 'Success', description: 'Manual tonnage recorded', color: 'green' })
        isManualModalOpen.value = false
        refreshTrips()
        refreshKpis()
        refreshDetail() // If slideover is open
    } catch (e: any) {
        toast.add({ title: 'Error', description: e.statusMessage || 'Failed to update', color: 'red' })
    }
}

// ── Simulate Feed Logic ───────────────────────────────────────────────
const isSimulating = ref(false)
async function simulateFeed() {
    // Pick a random pending trip or just the top trip to confirm
    if (!trips.value?.length) return
    const target = trips.value.find((t: any) => t.status !== 'CONFIRMED')
    if (!target) {
        toast.add({ title: 'Info', description: 'No non-confirmed trips to simulate', color: 'blue' })
        return
    }

    isSimulating.value = true
    try {
        const simTonnage = (30 + Math.random() * 5).toFixed(2) // Random valid tonnage
        await $fetch('/api/production/tonnage/confirm-feed', {
            method: 'POST',
            body: { 
                tripId: target.tripId, 
                confirmedTonnage: simTonnage 
            }
        })
        toast.add({ title: 'Simulated Feed', description: `Trip ${target.tripId} confirmed at ${simTonnage}t`, color: 'green' })
        refreshTrips()
        refreshKpis()
    } catch (e) {
        toast.add({ title: 'Error', description: 'Simulation failed', color: 'red' })
    } finally {
        isSimulating.value = false
    }
}

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Production & Tonnage">
             <template #right>
                <UButton 
                    label="Simulate Weighbridge Feed" 
                    icon="i-heroicons-signal" 
                    color="gray" 
                    variant="ghost" 
                    :loading="isSimulating"
                    @click="simulateFeed"
                />
             </template>
        </UDashboardNavbar>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <UCard>
                <div class="text-xs text-gray-500">Total Trips</div>
                <div class="text-2xl font-bold">{{ kpis?.total_trips || 0 }}</div>
            </UCard>
            <UCard>
                <div class="text-xs text-green-600">Confirmed Tonnage</div>
                <div class="text-2xl font-bold text-green-600">{{ kpis?.tonnage.confirmed.toLocaleString() }} t</div>
            </UCard>
            <UCard>
                <div class="text-xs text-yellow-600">Manual Tonnage</div>
                <div class="text-2xl font-bold text-yellow-600">{{ kpis?.tonnage.manual.toLocaleString() }} t</div>
            </UCard>
            <UCard>
                <div class="text-xs text-gray-500">Coverage</div>
                <div class="text-2xl font-bold">{{ kpis?.coverage.percent }}%</div>
                <UProgress :value="kpis?.coverage.percent" color="blue" size="xs" class="mt-2" />
            </UCard>
        </div>

        <UDashboardToolbar>
            <template #left>
                <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search trip or unit..." />
                <USelect v-model="selectedStatus" :options="statusOptions" />
            </template>
        </UDashboardToolbar>

        <UTable
            :rows="trips || []"
            :columns="columns"
            :loading="tableStatus === 'pending'"
            @select="onSelectTrip"
        >
             <template #unitId-data="{ row }">
                <span class="font-bold">{{ row.unitId }}</span>
            </template>

            <template #status-data="{ row }">
                <UBadge v-if="row.status === 'CONFIRMED'" color="green" variant="solid" size="xs">CONFIRMED</UBadge>
                <UBadge v-else-if="row.status === 'MANUAL'" color="orange" variant="soft" size="xs">MANUAL</UBadge>
                <UBadge v-else color="gray" variant="outline" size="xs">PENDING</UBadge>
                <UBadge v-if="row.issues.length" color="red" variant="solid" size="xs" class="ml-1">!</UBadge>
            </template>

             <template #dumpTime-data="{ row }">
                <span class="text-xs">{{ row.dumpTime ? new Date(row.dumpTime).toLocaleTimeString() : '-' }}</span>
            </template>

            <template #actions-data="{ row }">
                <UButton 
                    v-if="row.status === 'PENDING'" 
                    icon="i-heroicons-pencil-square" 
                    size="xs" 
                    color="gray" 
                    variant="ghost" 
                    @click.stop="openManualModal(row.tripId)" 
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
            <div v-else-if="tripDetail">
                <h2 class="text-xl font-bold">{{ tripDetail.trip.trip_id }}</h2>
                <div class="text-sm text-gray-500 mb-4">{{ tripDetail.trip.unit_name }} | {{ tripDetail.trip.loading_location_name }} → {{ tripDetail.trip.dumping_location_name }}</div>

                <div class="bg-gray-50 p-3 rounded mb-4">
                    <div class="text-xs text-gray-500 uppercase">Current Tonnage</div>
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-bold">{{ tripDetail.trip.tonnage_primary ?? '—' }} t</span>
                        <UBadge :color="tripDetail.trip.tonnage_status === 'CONFIRMED' ? 'green' : (tripDetail.trip.tonnage_status === 'MANUAL' ? 'orange' : 'gray')" size="xs">
                            {{ tripDetail.trip.tonnage_status }}
                        </UBadge>
                    </div>
                </div>

                <UDivider label="History" class="mb-4" />
                <ol class="relative border-l border-gray-200 ml-2">
                    <li v-for="(h, i) in tripDetail.history" :key="i" class="mb-4 ml-4">
                        <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                        <time class="mb-1 text-xs font-normal text-gray-400">{{ new Date(h.recorded_at).toLocaleTimeString() }}</time>
                        <h3 class="text-sm font-semibold text-gray-900">{{ h.status }} <span v-if="h.value">({{ h.value }}t)</span></h3>
                        <p class="text-xs text-gray-500">Source: {{ h.source }}</p>
                        <p v-if="h.actor" class="text-xs text-gray-500">Actor: {{ h.actor }}</p>
                        <p v-if="h.reason" class="text-xs text-gray-500 italic">"{{ h.reason }}"</p>
                    </li>
                </ol>

                <div v-if="tripDetail.issues.length">
                    <UDivider label="Anomalies" class="mb-4" />
                    <UCard v-for="issue in tripDetail.issues" :key="issue.issue_id" class="mb-2 ring-1 ring-red-200">
                        <div class="text-sm font-bold text-red-600">{{ issue.issue_type }}</div>
                        <div class="text-xs">{{ issue.detail }}</div>
                    </UCard>
                </div>
            </div>
       </div>
    </USlideover>

    <!-- Manual Entry Modal -->
    <UModal v-model="isManualModalOpen">
        <div class="p-4">
            <h3 class="text-lg font-bold mb-4">Manual Tonnage Entry</h3>
            <div class="space-y-4">
                <UFormGroup label="Tonnage (t)">
                    <UInput type="number" v-model="manualForm.tonnage" />
                </UFormGroup>
                <UFormGroup label="Reason">
                    <UTextarea v-model="manualForm.reason" placeholder="e.g. Sensor Offline" />
                </UFormGroup>
                <div class="flex justify-end gap-2 mt-6">
                    <UButton color="gray" variant="ghost" @click="isManualModalOpen = false">Cancel</UButton>
                    <UButton color="orange" @click="submitManualTonnage">Submit Manual Entry</UButton>
                </div>
            </div>
        </div>
    </UModal>

  </UDashboardPage>
</template>
