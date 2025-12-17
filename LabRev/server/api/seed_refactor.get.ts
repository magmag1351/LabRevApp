
import { getMembersFromStore, addMemberToStore, deleteMemberFromStore } from '../utils/memberStore'
import { logAttendance, type DailyAttendanceRecord } from '../utils/attendanceStore'

export default defineEventHandler(async () => {
  try {
    // 1. Clean up bad data first
    const currentMembers = await getMembersFromStore()
    for (const m of currentMembers) {
      if (m.name.startsWith('Test User')) {
        // Delete by ID if exists, or finding index if no ID?
        // deleteMemberFromStore uses ID. If ID undefined, it might fail.
        // We'll access storage directly to wipe clean.
      }
    }

    const storage = useStorage('data')

    // Reset members to just Uesugi (Initial state)
    // Hard reset is safer
    const initialMembers = [
      {
        no: 1,
        id: 315173345658,
        name: 'Kenta Uesugi',
        email: 'test@hiro.kindai.ac.jp',
        grade: 'Admin',
        status: 'online',
      }
    ]
    await storage.setItem('members', initialMembers)

    // Now add fresh test users
    // Re-read members to be sure
    const members = initialMembers // await getMembersFromStore()
    const needed = 4 // we want 5 total

    for (let i = 0; i < needed; i++) {
      const newId = i + 2 // 2, 3, 4, 5
      await addMemberToStore({
        id: newId,
        name: `Test User ${newId}`,
        email: `test${newId}@example.com`,
        grade: 'B4'
      })
    }

    const updatedMembers = await getMembersFromStore()

    const today = new Date()
    // Use attendanceStore logic for date key
    const getLogicalDate = (date: Date): string => {
      const d = new Date(date)
      if (d.getHours() < 5) {
        d.setDate(d.getDate() - 1)
      }
      return d.toISOString().split('T')[0]
    }

    const logicalDate = getLogicalDate(today)

    const setTime = (hours: number, minutes: number) => {
      const d = new Date(today)
      d.setHours(hours, minutes, 0, 0)
      return d.toISOString()
    }

    const records: DailyAttendanceRecord[] = [] // Reset records too for clean test

    const scenarios = [
      { start: 9, end: 17 }, // Uesugi (Index 0)
      { start: 8, end: 12 }, // Test 2
      { start: 13, end: 19 }, // Test 3
      { start: 10, end: null }, // Test 4
      { start: 6, end: 7 } // Test 5
    ]

    for (let i = 0; i < 5; i++) {
      const member = updatedMembers[i]
      const scenario = scenarios[i]

      if (member && scenario) {
        records.push({
          memberId: member.id,
          date: logicalDate,
          firstEntry: setTime(scenario.start, 0),
          lastExit: scenario.end ? setTime(scenario.end, 0) : null
        })
      }
    }

    await storage.setItem('attendance_records', records)

    return { success: true, message: `Seeded fresh data for date ${logicalDate}. Members: ${updatedMembers.length}` }
  } catch (e) {
    return { success: false, error: String(e) }
  }
})
