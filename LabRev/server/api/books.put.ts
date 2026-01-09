import { z } from 'zod'
import { updateBookInStore } from '../utils/bookStore'

const updateBookSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  status: z.enum(['室内', '貸出', '不明']).optional(),
  renter: z.string().optional(),
  rentDate: z.string().optional()
})

export default eventHandler(async (event) => {
  const body = await readBody(event)

  const result = updateBookSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.issues
    })
  }

  const { id, ...data } = result.data
  const updatedBook = await updateBookInStore(id, data)

  if (!updatedBook) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found'
    })
  }

  return updatedBook
})
