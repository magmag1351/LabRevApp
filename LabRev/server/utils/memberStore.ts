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
        no:2,
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