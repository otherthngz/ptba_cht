export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark'
  },
  compatibilityDate: '2025-01-01',
  icon: {
    clientBundle: {
      scan: true
    }
  },
  app: {
    head: {
      title: 'PTBA CHT Hauling Portal',
      meta: [
        { name: 'description', content: 'PT Bukit Asam CHT Hauling Web Portal' }
      ]
    }
  }
})
