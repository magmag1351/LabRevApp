// server/utils/memberStore.ts
import type { LabMember } from '~/types'

// 'online' と 'offline' のみトグルする
const toggleStatus = (status: LabMemberStatus): LabMemberStatus => {
  if (status === 'online') {
    return 'offline' // 在室 -> 帰宅
  }
  // 'offline' または 'afk' の場合は 'online' にする
  return 'online' // 帰宅/AFK -> 在室
}

/**
 * メンバーリストをストレージから取得します。
 * 存在しない場合は初期データで作成します。
 */
export const getMembersFromStore = async (): Promise<LabMember[]> => {
  const storage = useStorage('data') // 'data' はファイルベースのストレージ (開発中に便利)
  let members = await storage.getItem<LabMember[]>('members')

  if (!members) {
    // 初期データ
    const initialMembers: LabMember[] = [
      {
        no: 1,
        id: 1,
        name: 'Kenta Uesugi',
        email: 'uesugi@example.com',
        grade: 'Admin',
        status: 'online',
      },
      {
        no: 2,
        id: 2,
        name: 'Taro Yamada',
        email: 'yamada@example.com',
        grade: 'M1',
        status: 'offline',
      }
    ]
    await storage.setItem('members', initialMembers)
    members = initialMembers
  }
  return members
}

/**
 * IDを指定してメンバーのステータスを更新 (トグル) します。
 */
export const updateMemberStatusInStore = async (id: number): Promise<LabMember | null> => {
  const members = await getMembersFromStore()
  const member = members.find(m => m.id === id)

  if (!member) {
    return null // 該当メンバーなし
  }

  // ステータスをトグル
  member.status = toggleStatus(member.status)

  // ストレージを更新
  const storage = useStorage('data')
  await storage.setItem('members', members)

  return member
}

/**
 * 新しいメンバーを追加します。
 */
export const addMemberToStore = async (memberData: Omit<LabMember, 'no' | 'status'>): Promise<LabMember> => {
  const members = await getMembersFromStore()

  // 新しいNoを生成 (現在の最大No + 1)
  const maxNo = members.reduce((max, m) => Math.max(max, m.no), 0)
  const newNo = maxNo + 1

  const newMember: LabMember = {
    ...memberData,
    no: newNo,
    status: 'offline' // デフォルトは offline
  }

  members.push(newMember)

  const storage = useStorage('data')
  await storage.setItem('members', members)

  return newMember
}

/**
 * IDを指定してメンバーを削除します。
 */
export const deleteMemberFromStore = async (id: number): Promise<boolean> => {
  const members = await getMembersFromStore()
  const index = members.findIndex(m => m.id === id)

  if (index === -1) {
    return false // 該当メンバーなし
  }

  members.splice(index, 1)

  const storage = useStorage('data')
  await storage.setItem('members', members)

  return true
}