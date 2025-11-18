// server/api/members.ts

// memberStore.ts から関数をインポート（自動インポートが効くはず）
// import { getMembersFromStore } from '~/server/utils/memberStore'

export default eventHandler(async () => {
  // 静的な配列を返す代わりに、ストアから取得する
  const members = await getMembersFromStore()
  return members
})