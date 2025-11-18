import type { AvatarProps } from '@nuxt/ui'

export type Grade = 'Admin' | 'M2' | 'M1' | 'B4' | 'B3'
export type LabMemberStatus = 'online' | 'offline' | 'afk'

export interface LabMember {
  no: number
  id: number
  name: string
  email: string
  grade: Grade
  status: LabMemberStatus
}

export type BookStatus = '室内' | '貸出' | '不明'

export interface Book {
  no: number
  id: number
  title: string
  category: string
  status: BookStatus
  Renter: string
  RentDate: string
}

// This was the old Member type, renaming to avoid conflict
export interface SettingsMember {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}
