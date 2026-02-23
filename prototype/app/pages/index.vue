<template>
  <UDashboardPanel id="home">
    <template #header>
      <div>
        <h1 class="text-xl font-bold">Dashboard</h1>
        <p class="text-sm text-(--ui-text-muted) mt-1">PT Bukit Asam -- Coal Hauling & Transportation</p>
      </div>
    </template>

    <template #body>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        <UCard v-for="item in navItems" :key="item.to">
          <div class="flex items-start gap-3">
            <div class="p-2.5 rounded-lg bg-(--ui-bg-accented)">
              <UIcon :name="item.icon" class="size-5 text-primary" />
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-sm">{{ item.label }}</h3>
              <p class="text-xs text-(--ui-text-muted) mt-0.5">{{ item.description }}</p>
              <UButton :to="item.to" :label="`Open ${item.label}`" size="xs" variant="soft" class="mt-3" />
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
const navItems = [
  { label: 'Fleet Board', icon: 'i-lucide-truck', to: '/fleet', description: 'Real-time unit tracking with live polling' },
  { label: 'Dispatch', icon: 'i-lucide-clipboard-list', to: '/dispatch', description: 'Assignment management and board view' },
  { label: 'Production', icon: 'i-lucide-bar-chart-3', to: '/production', description: 'Trip ritase, tonnage status and manual entry' },
  { label: 'Availability', icon: 'i-lucide-clock', to: '/availability', description: 'PA/UA and running hour reports' },
  { label: 'Data Quality', icon: 'i-lucide-shield-check', to: '/data-quality', description: 'Anomaly detection and audit trail' },
  { label: 'Master Data', icon: 'i-lucide-database', to: '/master-data/units', description: 'Units, locations, and shift configuration' },
  { label: 'Reports', icon: 'i-lucide-download', to: '/reports', description: 'Analytics dashboard and CSV exports' },
]
</script>
