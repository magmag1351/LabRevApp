import { z } from 'zod'
import { addMemberToStore } from '../utils/memberStore'

const memberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  id: z.number(),
  grade: z.enum(['Admin', 'M2', 'M1', 'B4', 'B3'])
})

export default eventHandler(async (event) => {
  const body = await readBody(event)

  const result = memberSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.issues
    })
  }

  const newMember = await addMemberToStore(result.data)
  return newMember
})
