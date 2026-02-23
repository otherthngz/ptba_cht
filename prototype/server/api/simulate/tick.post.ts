import { simulateTick } from '~~/server/utils/store'

export default defineEventHandler(() => {
    return simulateTick()
})
