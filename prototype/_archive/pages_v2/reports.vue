<script setup lang="ts">
const reports = [
    { title: 'Production Report', description: 'Complete trip logs including manual and confirmed tonnage.', endpoint: '/api/reports/production.csv', previewApi: '/api/production/trips' },
    { title: 'Audit Trail', description: 'System-wide audit logs for all mutations.', endpoint: '/api/reports/audit.csv', previewApi: null }, // Audit preview via Detail pages usually
    { title: 'Data Quality Issues', description: 'List of all anomalies and their resolution status.', endpoint: '/api/data-quality/issues', isJson: true } // Mock CSV support (reuse existing json endpoint? No, need CSV)
]

function download(endpoint: string) {
    window.open(endpoint, '_blank')
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Reports & Export" />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <UCard v-for="rep in reports" :key="rep.title">
                <template #header>
                    <div class="font-bold text-lg">{{ rep.title }}</div>
                </template>
                <div class="text-gray-600 mb-6 h-12">
                    {{ rep.description }}
                </div>
                <template #footer>
                     <UButton icon="i-heroicons-arrow-down-tray" block color="black" @click="download(rep.endpoint)">Download CSV</UButton>
                </template>
            </UCard>
        </div>
        
        <div class="px-6 text-sm text-gray-500">
            * All exports include data from the current active shift and historical prototype data.
        </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
