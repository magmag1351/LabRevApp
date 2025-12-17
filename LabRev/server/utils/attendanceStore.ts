import type { LabMemberStatus } from '~/types'

export interface DailyAttendanceRecord {
  memberId: number
  date: string // YYYY-MM-DD (Logical Day)
  firstEntry: string | null
  lastExit: string | null
}

const getLogicalDate = (date: Date): string => {
  // 5:00 AM cutoff
  const d = new Date(date)
  if (d.getHours() < 5) {
    d.setDate(d.getDate() - 1)
  }
  return d.toISOString().split('T')[0]
}

export const logAttendance = async (memberId: number, status: LabMemberStatus) => {
  const storage = useStorage('data')
  // Store usage: 'attendance_records' -> DailyAttendanceRecord[]
  const records = (await storage.getItem<DailyAttendanceRecord[]>('attendance_records')) || []

  const now = new Date()
  const today = getLogicalDate(now)

  let record = records.find(r => r.memberId === memberId && r.date === today)

  if (!record) {
    record = {
      memberId,
      date: today,
      firstEntry: null,
      lastExit: null
    }
    records.push(record)
  }

  if (status === 'online') {
    if (!record.firstEntry) {
      record.firstEntry = now.toISOString()
    }
  } else if (status === 'offline') {
    record.lastExit = now.toISOString()
  }

  await storage.setItem('attendance_records', records)
}

export const getDailyAttendance = async (dateStr?: string) => {
  const storage = useStorage('data')
  const records = (await storage.getItem<DailyAttendanceRecord[]>('attendance_records')) || []

  const targetDate = dateStr || getLogicalDate(new Date())

  // Filter for target date
  const dayRecords = records.filter(r => r.date === targetDate)

  // Return as map for easy lookup
  const stats: Record<number, { firstEntry: string | null, lastExit: string | null }> = {}

  for (const r of dayRecords) {
    stats[r.memberId] = {
      firstEntry: r.firstEntry,
      lastExit: r.lastExit
    }
  }

  return stats
}
