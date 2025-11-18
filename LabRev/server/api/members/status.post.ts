// server/api/members/status.post.ts

// import { updateMemberStatusInStore } from '~/server/utils/memberStore'

export default defineEventHandler(async (event) => {
  // 1. リクエストボディから ID を読み取る
  const body = await readBody(event)
  const id = body.id as number

  if (!id || typeof id !== 'number') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: "id" (number) is required.',
    })
  }

  // 2. ストアの更新処理を呼び出す
  const updatedMember = await updateMemberStatusInStore(id)

  if (!updatedMember) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Member not found.', // 404エラーのメッセージをこちらで定義
    })
  }

  // 3. 成功したら、更新後の情報を返す
  return {
    id: updatedMember.id,
    newStatus: updatedMember.status,
    name: updatedMember.name
  }
})