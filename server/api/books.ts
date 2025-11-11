import type {Book} from "~/types";

const books: Book[] = [{
  id: 1,
  title: 'Book 1',
  author: 'J.k Rowling',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=18',
  }
  status: 'exist',
  location: 'room'
},{
  id: 2,
  title: 'Book 2',
  author: 'J.k Rowling',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=18',
  }
  status: 'exist',
  location: 'room'
}]

export default eventHandler(async () => {
  return books
})