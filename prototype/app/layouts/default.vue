<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { CalendarDate } from '@internationalized/date'

// Force light mode regardless of OS preference or cookie
const colorMode = useColorMode()
colorMode.preference = 'light'

// Sidebar open state (mobile)
const sidebarOpen = ref(false)

// Page title & toolbar type (provided to child pages via inject)
const pageTitle = ref('Dashboard')
const toolbarType = ref<'historical' | 'realtime' | 'none'>('none')
provide('pageTitle', pageTitle)
provide('toolbarType', toolbarType)

// ── Historical toolbar state ──────────────────────────────────────
const today = new Date()
const selectedDateRange = ref<any>({
  start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate() - 6),
  end: new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
})
const selectedGranularity = ref('daily')
const granularityOptions = [
  { label: 'Harian',   value: 'daily' },
  { label: 'Mingguan', value: 'weekly' },
  { label: 'Bulanan',  value: 'monthly' },
]

function formatDateRange(range: { start: any; end: any }) {
  const toDate = (d: any): Date => d instanceof Date ? d : (d?.toDate ? d.toDate('UTC') : new Date())
  const fmt = (d: any) => toDate(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  if (!range?.start) return 'Pilih tanggal'
  if (!range.end) return fmt(range.start)
  const s = toDate(range.start); const e = toDate(range.end)
  if (s.toDateString() === e.toDateString()) return fmt(range.start)
  return fmt(range.start) + ' – ' + fmt(range.end)
}

// ── Realtime toolbar state ────────────────────────────────────────
const realtimeWindow = ref('1h')
const realtimeWindows = ['1h', '6h', '24h']
const autoRefresh = ref(true)
const lastRefresh = ref(new Date())

let refreshTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  refreshTimer = setInterval(() => {
    if (autoRefresh.value && toolbarType.value === 'realtime') {
      lastRefresh.value = new Date()
    }
  }, 60_000)
})
onUnmounted(() => { if (refreshTimer) clearInterval(refreshTimer) })

function fmtTime(d: Date) {
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

// ── Navigation ────────────────────────────────────────────────────
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
        <div class="flex items-center gap-2 px-1" :class="collapsed ? 'justify-center' : ''">
          <UIcon v-if="collapsed" name="i-lucide-mountain" class="size-6 text-primary shrink-0" />
          <img v-else src="/logo.png" alt="BukitAsam" class="h-8 w-auto max-w-[140px]">
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

      <!-- ── Historical Toolbar ── -->
      <UDashboardToolbar v-if="toolbarType === 'historical'">
        <template #left>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              icon="i-lucide-calendar"
              :label="formatDateRange(selectedDateRange)"
              color="neutral"
              variant="outline"
              size="sm"
            />
            <template #content>
              <div class="p-3">
                <UCalendar
                  v-model="selectedDateRange"
                  range
                  :number-of-months="2"
                />
              </div>
            </template>
          </UPopover>

          <USelect
            v-model="selectedGranularity"
            :items="granularityOptions"
            value-key="value"
            label-key="label"
            size="sm"
            variant="ghost"
            class="w-32"
          />
        </template>
      </UDashboardToolbar>

      <!-- ── Realtime Toolbar ── -->
      <UDashboardToolbar v-else-if="toolbarType === 'realtime'">
        <template #left>
          <div class="flex gap-1">
            <UButton
              v-for="w in realtimeWindows"
              :key="w"
              :label="'Last ' + w"
              size="sm"
              :color="realtimeWindow === w ? 'primary' : 'neutral'"
              :variant="realtimeWindow === w ? 'solid' : 'ghost'"
              @click="realtimeWindow = w"
            />
          </div>

          <USeparator orientation="vertical" class="h-4" />

          <UBadge color="neutral" variant="outline" size="sm">
            <UIcon name="i-lucide-clock" class="size-3 mr-1" />
            Refresh: {{ fmtTime(lastRefresh) }}
          </UBadge>
        </template>

        <template #right>
          <div class="flex items-center gap-2 text-sm text-(--ui-text-muted)">
            <span>Auto-refresh</span>
            <USwitch v-model="autoRefresh" size="sm" />
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
