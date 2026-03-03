<script setup lang="ts">
const pageTitle = inject<Ref<string>>('pageTitle')
const showToolbar = inject<Ref<boolean>>('showToolbar')

onMounted(() => {
  if (pageTitle) pageTitle.value = 'Master Data – Shift'
  if (showToolbar) showToolbar.value = false
})

const { data: masterData } = useFetch('/api/master-data')
const allShifts = computed(() => (masterData.value as any)?.shifts ?? [])
const shiftCols = [
  { accessorKey: 'shift_id', header: 'ID' },
  { accessorKey: 'shift_name', header: 'Name' },
  { accessorKey: 'start_time', header: 'Start' },
  { accessorKey: 'end_time', header: 'End' },
  { accessorKey: 'timezone', header: 'Timezone' },
  { accessorKey: 'is_active', header: 'Status' },
]
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4" v-if="masterData">
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Shifts</div><div class="text-[28px] font-extrabold mt-1">{{ allShifts.length }}</div></div></UCard>
      <UCard><div class="text-center"><div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Active</div><div class="text-[28px] font-extrabold mt-1 text-green-500">{{ allShifts.filter((s: any) => s.is_active).length }}</div></div></UCard>
    </div>
    <div v-if="!masterData" class="flex flex-col gap-2.5"><USkeleton v-for="i in 2" :key="i" class="h-9" /></div>
    <template v-else>
      <UTable :data="allShifts" :columns="shiftCols">
        <template #shift_id-cell="{ row }"><span class="font-semibold">{{ row.original.shift_id }}</span></template>
        <template #is_active-cell="{ row }"><UBadge :color="row.original.is_active ? 'success' : 'neutral'" size="xs">{{ row.original.is_active ? 'Active' : 'Inactive' }}</UBadge></template>
      </UTable>
    </template>
  </div>
</template>
