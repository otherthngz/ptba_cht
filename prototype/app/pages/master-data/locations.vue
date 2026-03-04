<script setup lang="ts">
const pageTitle = inject<Ref<string>>('pageTitle')
const toolbarType = inject<Ref<string>>('toolbarType')

onMounted(() => {
  if (pageTitle) pageTitle.value = 'Master Data – Lokasi'
  if (toolbarType) toolbarType.value = 'none'
})

const filterRole = ref<string | undefined>()
const { data: masterData } = useFetch('/api/master-data')
const allLocations = computed(() => (masterData.value as any)?.locations ?? [])
const filtered = computed(() => {
  if (!filterRole.value) return allLocations.value
  return allLocations.value.filter((l: any) => l.location_role === filterRole.value)
})
const locCols = [
  { accessorKey: 'location_id', header: 'ID' },
  { accessorKey: 'location_name', header: 'Name' },
  { accessorKey: 'location_role', header: 'Role' },
  { accessorKey: 'location_type', header: 'Type' },
  { accessorKey: 'is_active', header: 'Status' },
]
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <USelectMenu v-model="filterRole" :items="['LOADING','DUMPING']" placeholder="All Roles" size="xs" class="w-[130px]" />
    </div>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4" v-if="masterData">
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Locations</div><div class="text-[28px] font-extrabold mt-1">{{ allLocations.length }}</div></div></UCard>
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Loading</div><div class="text-[28px] font-extrabold mt-1 text-blue-500">{{ allLocations.filter((l: any) => l.location_role === 'LOADING').length }}</div></div></UCard>
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Dumping</div><div class="text-[28px] font-extrabold mt-1 text-green-500">{{ allLocations.filter((l: any) => l.location_role === 'DUMPING').length }}</div></div></UCard>
    </div>
    <div v-if="!masterData" class="flex flex-col gap-2.5"><USkeleton v-for="i in 3" :key="i" class="h-9" /></div>
    <template v-else>
      <UTable :data="filtered" :columns="locCols">
        <template #location_id-cell="{ row }"><span class="font-semibold">{{ row.original.location_id }}</span></template>
        <template #location_role-cell="{ row }"><UBadge :color="row.original.location_role === 'LOADING' ? 'primary' : 'success'" variant="subtle" size="xs">{{ row.original.location_role }}</UBadge></template>
        <template #location_type-cell="{ row }"><UBadge color="neutral" variant="outline" size="xs">{{ row.original.location_type }}</UBadge></template>
        <template #is_active-cell="{ row }"><UBadge :color="row.original.is_active ? 'success' : 'neutral'" :variant="row.original.is_active ? 'solid' : 'outline'" size="xs">{{ row.original.is_active ? 'Active' : 'Inactive' }}</UBadge></template>
      </UTable>
    </template>
  </div>
</template>
