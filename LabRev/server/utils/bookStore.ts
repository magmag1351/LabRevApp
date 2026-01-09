// server/utils/bookStore.ts
import type { Book } from '~/types'

/**
 * 蔵書リストをストレージから取得します。
 * 存在しない場合は初期データで作成します。
 */
export const getBooksFromStore = async (): Promise<Book[]> => {
  const storage = useStorage('data')
  let books = await storage.getItem<Book[]>('books.json')

  if (!books) {
    // 初期データ
    const initialBooks: Book[] = [{
      no: 1,
      id: 1234,
      title: '有限要素法',
      category: '教科書',
      status: '室内',
      renter: '山田太郎',
      rentDate: '2023-05-01',
    }, {
      no: 2,
      id: 5678,
      title: '電磁気学',
      category: '教科書',
      status: '貸出',
      renter: '田中次郎',
      rentDate: '2023-05-02',
    }]
    await storage.setItem('books.json', initialBooks)
    books = initialBooks
  }
  return books
}

/**
 * IDを指定して蔵書情報を更新します。
 */
export const updateBookInStore = async (id: number, data: Partial<Omit<Book, 'id' | 'no'>>): Promise<Book | null> => {
  const books = await getBooksFromStore()
  const book = books.find(b => b.id === id)

  if (!book) {
    return null
  }

  // データを更新
  Object.assign(book, data)

  // ストレージを更新
  const storage = useStorage('data')
  await storage.setItem('books.json', books)

  return book
}

/**
 * 新しい蔵書を追加します。
 */
export const addBookToStore = async (bookData: Omit<Book, 'no'>): Promise<Book> => {
  const books = await getBooksFromStore()

  // 新しいNoを生成
  const maxNo = books.reduce((max, b) => Math.max(max, b.no), 0)
  const newNo = maxNo + 1

  const newBook: Book = {
    ...bookData,
    no: newNo,
  }

  books.push(newBook)

  const storage = useStorage('data')
  await storage.setItem('books.json', books)

  return newBook
}

/**
 * IDを指定して蔵書を削除します。
 */
export const deleteBookFromStore = async (id: number): Promise<boolean> => {
  const books = await getBooksFromStore()
  const index = books.findIndex(b => b.id === id)

  if (index === -1) {
    return false
  }

  books.splice(index, 1)

  const storage = useStorage('data')
  await storage.setItem('books.json', books)

  return true
}
