import type { Book } from '~/types'

const books: Book[] = [{
  id: 1,
  title: 'Alex Smith',
  category: 'alex.smith@example.com',
  status: '室内',
},{
  id: 2,
  title: 'Jordan Brown',
  category: 'jordan.brown@example.com',
  status: '貸出',
}]

export default eventHandler(async () => {
  return books
})
