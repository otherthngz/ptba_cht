<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Sidebar open state (mobile)
const sidebarOpen = ref(false)

const navItems: NavigationMenuItem[][] = [
  [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
    { label: 'Reports', icon: 'i-lucide-file-bar-chart', to: '/reports' },
    { label: 'Fleet Control', icon: 'i-lucide-truck', to: '/fleet' },
    { label: 'Availability', icon: 'i-lucide-clock', to: '/availability' },
    { label: 'Production', icon: 'i-lucide-bar-chart-3', to: '/production' },
    { label: 'Master Data', icon: 'i-lucide-database', defaultOpen: true, children: [
      { label: 'Units', icon: 'i-lucide-truck', to: '/master-data/units' },
      { label: 'Locations', icon: 'i-lucide-map-pin', to: '/master-data/locations' },
      { label: 'Shifts', icon: 'i-lucide-clock', to: '/master-data/shifts' },
    ]},
    { label: 'Users', icon: 'i-lucide-users', to: '/users' },
  ],
]

const userMenuItems = [
  [{
    label: 'Profile',
    icon: 'i-lucide-user',
    disabled: true
  }, {
    label: 'Settings',
    icon: 'i-lucide-settings',
    disabled: true
  }, {
    label: 'Billing',
    icon: 'i-lucide-credit-card',
    disabled: true
  }],
  [{
    label: 'Appearance',
    icon: colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon',
    onSelect: () => toggleTheme()
  }],
  [{
    label: 'Documentation',
    icon: 'i-lucide-book-open',
    disabled: true
  }, {
    label: 'GitHub',
    icon: 'i-lucide-github',
    disabled: true
  }],
  [{
    label: 'Logout',
    icon: 'i-lucide-log-out',
    disabled: true
  }]
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

      <!-- Sidebar body: Search + Navigation -->
      <template #default="{ collapsed }">
        <UButton
          :label="collapsed ? undefined : 'Search...'"
          icon="i-lucide-search"
          color="neutral"
          variant="outline"
          block
          :square="collapsed"
        >
          <template v-if="!collapsed" #trailing>
            <div class="flex items-center gap-0.5 ms-auto">
              <UKbd value="meta" variant="subtle" />
              <UKbd value="K" variant="subtle" />
            </div>
          </template>
        </UButton>

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

    <slot />
  </UDashboardGroup>
</template>
