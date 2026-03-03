<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Sidebar open state (mobile)
const sidebarOpen = ref(false)

// Page title & toolbar (provided to child pages via inject)
const pageTitle = ref('Dashboard')
const showToolbar = ref(false)
provide('pageTitle', pageTitle)
provide('showToolbar', showToolbar)

// Toolbar state
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedRange = ref('daily')
const timeRanges = [
  { label: 'Harian',   value: 'daily' },
  { label: 'Mingguan', value: 'weekly' },
  { label: 'Bulanan',  value: 'monthly' },
]

const navItems: NavigationMenuItem[][] = [
  [
    { label: 'Dashboard',     icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
    { label: 'Fleet',         icon: 'i-lucide-truck',            to: '/fleet' },
    { label: 'Produksi',      icon: 'i-lucide-bar-chart-3',      to: '/production' },
    { label: 'Availabilitas', icon: 'i-lucide-clock',            to: '/availability' },
    { label: 'Laporan',       icon: 'i-lucide-file-bar-chart',   to: '/reports' },
    { label: 'Master Data',   icon: 'i-lucide-database', defaultOpen: false, children: [
      { label: 'Units',     icon: 'i-lucide-truck',     to: '/master-data/units' },
      { label: 'Lokasi',    icon: 'i-lucide-map-pin',   to: '/master-data/locations' },
      { label: 'Shift',     icon: 'i-lucide-clock',     to: '/master-data/shifts' },
    ]},
  ],
]

const userMenuItems = [
  [{ label: 'Logout', icon: 'i-lucide-log-out', disabled: true }]
]
</script>

<template>
  <UDashboardGroup storage="cookie" storage-key="ptba-sidebar" unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="sidebarOpen"
      collapsible
      resizable
      :ui="{ footer: 'lg:border-t lg:border-(--ui-border)' }"
    >
      <!-- Sidebar header: Logo -->
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2" :class="collapsed ? 'justify-center' : ''">
          <UIcon name="i-lucide-hard-hat" class="size-5 shrink-0" />
          <span v-if="!collapsed" class="font-bold text-sm truncate">PTBA CHT</span>
        </div>
      </template>

      <!-- Sidebar body: Navigation -->
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="navItems[0]"
          orientation="vertical"
          tooltip
        />
      </template>

      <!-- Sidebar footer: User dropdown -->
      <template #footer="{ collapsed }">
        <UDropdownMenu :items="userMenuItems" :popper="{ placement: 'top-start' }">
          <UButton
            :avatar="{ icon: 'i-lucide-user' }"
            :label="collapsed ? undefined : 'Dispatcher'"
            color="neutral"
            variant="ghost"
            class="w-full"
            :block="collapsed"
          >
            <template v-if="!collapsed" #trailing>
              <UIcon name="i-lucide-chevrons-up-down" class="size-4 ms-auto text-(--ui-text-muted)" />
            </template>
          </UButton>
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <!-- Page area -->
    <div class="flex flex-col flex-1 min-h-0 overflow-hidden">

      <!-- Navbar -->
      <UDashboardNavbar>
        <template #left>
          <UDashboardSidebarCollapse />
          <span class="font-semibold text-sm text-(--ui-text)">
            {{ pageTitle }}
          </span>
        </template>
      </UDashboardNavbar>

      <!-- Toolbar (conditional) -->
      <UDashboardToolbar v-if="showToolbar">
        <template #left>
          <UInput
            type="date"
            :model-value="selectedDate"
            @update:model-value="selectedDate = $event"
            size="sm"
          />
          <div class="flex gap-1">
            <UButton
              v-for="range in timeRanges"
              :key="range.value"
              :label="range.label"
              size="sm"
              :color="selectedRange === range.value ? 'primary' : 'neutral'"
              :variant="selectedRange === range.value ? 'solid' : 'ghost'"
              @click="selectedRange = range.value"
            />
          </div>
        </template>
      </UDashboardToolbar>

      <!-- Page slot -->
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>

    </div>
  </UDashboardGroup>
</template>
