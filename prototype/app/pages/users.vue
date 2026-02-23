<template>
  <UDashboardPanel id="users">
    <template #header>
      <UDashboardNavbar title="Users" :ui="{ right: 'gap-2' }">
        <template #right>
          <UButton
            icon="i-lucide-user-plus"
            label="Invite User"
            size="sm"
            color="neutral"
            variant="outline"
            disabled
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="pending" class="p-6 flex flex-col gap-2.5">
        <USkeleton v-for="i in 5" :key="i" class="h-10" />
      </div>

      <div v-else-if="error" class="p-6 flex items-center gap-3 text-red-500">
        <UIcon name="i-lucide-alert-circle" class="size-5 shrink-0" />
        <span class="text-sm">Failed to load users. Please refresh.</span>
      </div>

      <template v-else>
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 pb-0">
          <UCard>
            <div class="text-center">
              <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Total Users</div>
              <div class="text-[28px] font-extrabold mt-1">{{ summary.total }}</div>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Active</div>
              <div class="text-[28px] font-extrabold mt-1 text-green-500">{{ summary.active }}</div>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <div class="text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">Inactive</div>
              <div class="text-[28px] font-extrabold mt-1 text-(--ui-text-muted)">{{ summary.inactive }}</div>
            </div>
          </UCard>
        </div>

        <!-- Filter bar + Table -->
        <UCard class="m-4">
          <template #header>
            <div class="flex flex-wrap items-center gap-2">
              <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Search by name or email..."
                size="sm"
                class="w-60"
                @input="() => {}"
              />
              <USelect
                v-model="filterRole"
                :items="roleOptions"
                value-key="value"
                label-key="label"
                size="sm"
                placeholder="Role"
                class="w-36"
              />
              <USelect
                v-model="filterStatus"
                :items="statusOptions"
                value-key="value"
                label-key="label"
                size="sm"
                placeholder="Status"
                class="w-36"
              />
              <UButton
                icon="i-lucide-x"
                label="Clear"
                size="sm"
                color="neutral"
                variant="ghost"
                @click="clearFilters"
              />
              <div class="ms-auto text-xs text-(--ui-text-muted)">
                {{ filtered.length }} user{{ filtered.length !== 1 ? 's' : '' }}
              </div>
            </div>
          </template>

          <UTable :data="filtered" :columns="columns">
            <!-- Name cell -->
            <template #name-cell="{ row }">
              <div class="flex items-center gap-2">
                <div class="size-7 rounded-full bg-(--ui-bg-elevated) flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-user" class="size-3.5 text-(--ui-text-muted)" />
                </div>
                <div>
                  <div class="text-sm font-medium">{{ (row.original as any).name }}</div>
                  <div class="text-xs text-(--ui-text-muted)">{{ (row.original as any).id }}</div>
                </div>
              </div>
            </template>

            <!-- Role cell -->
            <template #role-cell="{ row }">
              <UBadge
                :color="(row.original as any).role === 'Admin' ? 'error' : (row.original as any).role === 'Dispatcher' ? 'info' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ (row.original as any).role }}
              </UBadge>
            </template>

            <!-- Status cell -->
            <template #status-cell="{ row }">
              <div class="flex items-center gap-1.5">
                <span
                  class="size-1.5 rounded-full"
                  :class="(row.original as any).status === 'Active' ? 'bg-green-500' : 'bg-(--ui-text-dimmed)'"
                />
                <span class="text-sm">{{ (row.original as any).status }}</span>
              </div>
            </template>

            <!-- Last Seen cell -->
            <template #last_seen-cell="{ row }">
              <span class="text-xs text-(--ui-text-muted)">{{ formatRelative((row.original as any).last_seen) }}</span>
            </template>

            <!-- Actions cell -->
            <template #actions-cell="{ row }">
              <UDropdownMenu :items="rowActions(row.original as any)">
                <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" />
              </UDropdownMenu>
            </template>
          </UTable>

          <template v-if="filtered.length === 0" #default>
            <div class="py-12 text-center text-(--ui-text-muted)">
              <UIcon name="i-lucide-users" class="size-8 mx-auto mb-2 opacity-40" />
              <p class="text-sm">No users match your filters.</p>
            </div>
          </template>
        </UCard>
      </template>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const toast = useToast()

const { data, pending, error } = await useFetch('/api/users')

const summary = computed(() => (data.value as any)?.summary ?? { total: 0, active: 0, inactive: 0, byRole: { Admin: 0, Dispatcher: 0, Checker: 0 } })
const users = computed(() => (data.value as any)?.users ?? [])

// ── Filters ──
const search = ref('')
const filterRole = ref('all')
const filterStatus = ref('all')

const roleOptions = [
  { label: 'All Roles', value: 'all' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Dispatcher', value: 'Dispatcher' },
  { label: 'Checker', value: 'Checker' },
]
const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
]

function clearFilters() {
  search.value = ''
  filterRole.value = 'all'
  filterStatus.value = 'all'
}

const filtered = computed(() => {
  return users.value.filter((u: any) => {
    const q = search.value.toLowerCase()
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
    if (filterRole.value !== 'all' && u.role !== filterRole.value) return false
    if (filterStatus.value !== 'all' && u.status !== filterStatus.value) return false
    return true
  })
})

// ── Table columns ──
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'last_seen', header: 'Last Seen' },
  { accessorKey: 'actions', header: '' },
]

// ── Relative time ──
function formatRelative(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

// ── Row action menu ──
function rowActions(user: any) {
  return [
    [{
      label: 'View Profile',
      icon: 'i-lucide-user',
      onSelect: () => toast.add({ title: 'View Profile', description: `${user.name} — UI only`, color: 'neutral' })
    }, {
      label: 'Edit Role',
      icon: 'i-lucide-pencil',
      onSelect: () => toast.add({ title: 'Edit Role', description: 'Role management coming soon', color: 'neutral' })
    }],
    [{
      label: user.status === 'Active' ? 'Deactivate' : 'Activate',
      icon: user.status === 'Active' ? 'i-lucide-user-x' : 'i-lucide-user-check',
      onSelect: () => toast.add({ title: `${user.status === 'Active' ? 'Deactivated' : 'Activated'} (UI only)`, description: user.name, color: 'neutral' })
    }]
  ]
}
</script>
