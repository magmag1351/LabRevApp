import type { Book } from '~/types'

const books: Book[] = [{
  no: 1,
  id: 1234,
  title: '有限要素法',
  category: '教科書',
  status: '室内',
  renter: '山田太郎',
  rentDate: '2023-05-01',
},{
  no: 2,
  id: 5678,
  title: '電磁気学',
  category: '教科書',
  status: '貸出',
  renter: '田中次郎',
  rentDate: '2023-05-02',
}]

export default eventHandler(async () => {
  return books
})
