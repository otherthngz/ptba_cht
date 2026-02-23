<template>
  <UDashboardPanel id="master-data-units">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="text-xl font-bold">Units</h1>
          <p class="text-xs text-(--ui-text-muted)">Fleet unit master data registry</p>
        </div>
        <div class="flex items-center gap-2">
          <UInput v-model="search" placeholder="Search units..." icon="i-lucide-search" size="sm" class="w-[180px]" />
          <USelectMenu v-model="filterType" :items="['DUMP_TRUCK','LOADER','SUPPORT']" placeholder="All Types" size="xs" class="w-[140px]" />
        </div>
      </div>
    </template>

    <template #body>
      <!-- KPI -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mb-6" v-if="masterData">
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Units</div><div class="text-[28px] font-extrabold mt-1">{{ allUnits.length }}</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Active</div><div class="text-[28px] font-extrabold mt-1 text-green-500">{{ allUnits.filter((u: any) => u.is_active).length }}</div></div></UCard>
        <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Dump Trucks</div><div class="text-[28px] font-extrabold mt-1">{{ allUnits.filter((u: any) => u.unit_type === 'DUMP_TRUCK').length }}</div></div></UCard>
      </div>

      <div v-if="!masterData" class="flex flex-col gap-2.5"><USkeleton v-for="i in 5" :key="i" class="h-9" /></div>
      <template v-else>
        <UTable :data="filtered" :columns="unitCols">
          <template #unit_id-cell="{ row }"><span class="font-semibold">{{ row.original.unit_id }}</span></template>
          <template #unit_type-cell="{ row }"><UBadge :color="row.original.unit_type === 'DUMP_TRUCK' ? 'primary' : row.original.unit_type === 'LOADER' ? 'warning' : 'neutral'" variant="subtle" size="xs">{{ row.original.unit_type }}</UBadge></template>
          <template #ownership-cell="{ row }"><UBadge :color="row.original.ownership === 'OWN' ? 'info' : 'neutral'" variant="outline" size="xs">{{ row.original.ownership }}</UBadge></template>
          <template #capacity_ton-cell="{ row }">
            <span v-if="row.original.capacity_ton">{{ row.original.capacity_ton }}t</span>
            <span v-else class="text-(--ui-text-muted)">--</span>
          </template>
          <template #is_active-cell="{ row }"><UBadge :color="row.original.is_active ? 'success' : 'neutral'" :variant="row.original.is_active ? 'solid' : 'outline'" size="xs">{{ row.original.is_active ? 'Active' : 'Inactive' }}</UBadge></template>
        </UTable>
      </template>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const search = ref('')
const filterType = ref<string | undefined>()
const { data: masterData } = useFetch('/api/master-data')
const allUnits = computed(() => (masterData.value as any)?.units ?? [])
const filtered = computed(() => {
  return allUnits.value.filter((u: any) => {
    if (search.value && !u.unit_id.toLowerCase().includes(search.value.toLowerCase()) && !u.unit_name.toLowerCase().includes(search.value.toLowerCase())) return false
    if (filterType.value && u.unit_type !== filterType.value) return false
    return true
  })
})
const unitCols = [
  { accessorKey: 'unit_id', header: 'ID' },
  { accessorKey: 'unit_name', header: 'Name' },
  { accessorKey: 'unit_type', header: 'Type' },
  { accessorKey: 'ownership', header: 'Ownership' },
  { accessorKey: 'vendor_name', header: 'Vendor' },
  { accessorKey: 'capacity_ton', header: 'Capacity' },
  { accessorKey: 'is_active', header: 'Status' },
]
</script>
