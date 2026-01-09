import { deleteBookFromStore } from '../utils/bookStore'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  const success = await deleteBookFromStore(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found'
    })
  }

  return { success: true }
})
