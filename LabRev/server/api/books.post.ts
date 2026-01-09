import { z } from 'zod'
import { addBookToStore } from '../utils/bookStore'

const bookSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  category: z.string().min(1),
  status: z.enum(['室内', '貸出', '不明']),
  renter: z.string().optional().default(''),
  rentDate: z.string().optional().default('')
})

export default eventHandler(async (event) => {
  const body = await readBody(event)

  const result = bookSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.issues
    })
  }

  const newBook = await addBookToStore(result.data)
  return newBook
})
