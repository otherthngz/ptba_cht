import { units, locations, shifts } from '~~/server/utils/store'
export default defineEventHandler(() => ({ units, locations, shifts }))
