<script setup lang="ts">
const { data, refresh, status } = await useFetch('/api/availability/summary')

const columns = [
  { key: 'unitId', label: 'Unit', sortable: true },
  { key: 'paLike', label: 'PA %', sortable: true },
  { key: 'uaLike', label: 'UA %', sortable: true },
  { key: 'runningHours', label: 'Running (h)', sortable: true },
  { key: 'breakdownHours', label: 'Breakdown (h)', sortable: true },
  { key: 'standbyHours', label: 'Standby (h)', sortable: true },
  { key: 'dataCompleteness', label: 'Data Completeness', sortable: true }
]

const search = ref('')

const filteredRows = computed(() => {
    if (!data.value?.rows) return []
    return data.value.rows.filter((r: any) => 
        r.unitId.toLowerCase().includes(search.value.toLowerCase()) || 
        r.unitName.toLowerCase().includes(search.value.toLowerCase())
    )
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Availability & Completeness">
            <template #right>
                <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" @click="refresh" />
            </template>
        </UDashboardNavbar>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <UCard>
                <div class="text-xs text-gray-500">Avg Physical Availability (PA)</div>
                <div class="text-2xl font-bold text-blue-600">{{ data?.aggregate?.paLike }}%</div>
                <div class="text-xs text-gray-400 mt-1">Approx. based on status</div>
            </UCard>
            <UCard>
                <div class="text-xs text-gray-500">Avg Use of Availability (UA)</div>
                <div class="text-2xl font-bold text-green-600">{{ data?.aggregate?.uaLike }}%</div>
                <div class="text-xs text-gray-400 mt-1">Approx. based on assignments</div>
            </UCard>
            <UCard>
                <div class="text-xs text-gray-500">Total Breakdown Hours</div>
                <div class="text-2xl font-bold text-red-600">{{ data?.aggregate?.breakdownHours }} h</div>
                <div class="text-xs text-gray-400 mt-1">Shift Total</div>
            </UCard>
             <UCard>
                <div class="text-xs text-gray-500">Data Completeness Score</div>
                <div class="text-2xl font-bold">{{ data?.aggregate?.dataCompleteness }}%</div>
                <UProgress :value="data?.aggregate?.dataCompleteness" color="orange" size="xs" class="mt-2" />
            </UCard>
        </div>

        <UDashboardToolbar>
            <template #left>
                <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search unit..." />
            </template>
        </UDashboardToolbar>

        <UTable
            :rows="filteredRows"
            :columns="columns"
            :loading="status === 'pending'"
        >
            <template #unitId-data="{ row }">
                <span class="font-bold">{{ row.unitId }}</span>
                <span class="text-xs text-gray-400 ml-1">{{ row.unitName }}</span>
            </template>

            <template #paLike-data="{ row }">
                <div class="flex items-center gap-2">
                    <span :class="row.paLike < 80 ? 'text-red-600 font-bold' : ''">{{ row.paLike }}%</span>
                </div>
            </template>

            <template #uaLike-data="{ row }">
                 <span :class="row.uaLike < 50 ? 'text-orange-500' : ''">{{ row.uaLike }}%</span>
            </template>
            
            <template #dataCompleteness-data="{ row }">
                <UBadge :color="row.dataCompleteness === 'HIGH' ? 'green' : (row.dataCompleteness === 'MEDIUM' ? 'yellow' : 'red')" variant="subtle" size="xs">
                    {{ row.dataCompleteness }}
                </UBadge>
            </template>
        </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
