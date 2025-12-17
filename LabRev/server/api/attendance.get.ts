import { getDailyAttendance } from '../utils/attendanceStore'
import { getMembersFromStore } from '../utils/memberStore'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const dateStr = query.date as string | undefined

  const stats = await getDailyAttendance(dateStr)
  const members = await getMembersFromStore()

  return members.map(m => ({
    ...m,
    firstEntry: stats[m.id]?.firstEntry || null,
    lastExit: stats[m.id]?.lastExit || null
  }))
})
