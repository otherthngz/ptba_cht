<script setup lang="ts">
const items = [{
  slot: 'units',
  label: 'Units'
}, {
  slot: 'locations',
  label: 'Locations'
}, {
  slot: 'shifts',
  label: 'Shifts'
}]

// Fetch all data
const { data: units } = await useFetch('/api/master-data/units')
const { data: locations } = await useFetch('/api/master-data/locations')
const { data: shifts } = await useFetch('/api/master-data/shifts')

const unitColumns = [
    { key: 'unit_id', label: 'ID', sortable: true },
    { key: 'unit_name', label: 'Name', sortable: true },
    { key: 'unit_type', label: 'Type' },
    { key: 'ownership', label: 'Ownership' },
    { key: 'is_active', label: 'Active' }
]

const locationColumns = [
    { key: 'location_id', label: 'ID', sortable: true },
    { key: 'location_name', label: 'Name', sortable: true },
    { key: 'location_type', label: 'Type' },
    { key: 'is_active', label: 'Active' }
]

const shiftColumns = [
    { key: 'shift_id', label: 'ID' },
    { key: 'shift_name', label: 'Name' },
    { key: 'start_time', label: 'Start' },
    { key: 'end_time', label: 'End' }
]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Master Data Reference" />
        
        <div class="p-4">
            <UTabs :items="items" class="w-full">
                <template #units="{ item }">
                    <UCard>
                        <template #header>
                             <div class="font-semibold">Fleet Units ({{ units?.length }})</div>
                        </template>
                        <UTable :rows="units || []" :columns="unitColumns">
                             <template #is_active-data="{ row }">
                                <UBadge :color="row.is_active ? 'green' : 'red'" variant="subtle" size="xs">{{ row.is_active ? 'YES' : 'NO' }}</UBadge>
                            </template>
                        </UTable>
                    </UCard>
                </template>

                <template #locations="{ item }">
                    <UCard>
                        <template #header>
                             <div class="font-semibold">Locations ({{ locations?.length }})</div>
                        </template>
                         <UTable :rows="locations || []" :columns="locationColumns" />
                    </UCard>
                </template>

                <template #shifts="{ item }">
                    <UCard>
                        <template #header>
                             <div class="font-semibold">Work Shifts ({{ shifts?.length }})</div>
                        </template>
                         <UTable :rows="shifts || []" :columns="shiftColumns" />
                    </UCard>
                </template>
            </UTabs>
        </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
