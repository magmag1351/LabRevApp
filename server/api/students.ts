import type {User} from "~/types";

const members: User[] = [{
  id: 1,
  name: 'John Doe',
  email: 'bDy0W@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=18',
    alt: 'John Doe'
  },
  status: 'active',
  grade: 'A'
},{
  id: 2,
  name: 'John Doe',
  email: 'bDy0W@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=18',
    alt: 'John Doe'
  },
  status: 'active',
  grade: 'A'
},{
  id: 3,
  name: 'John Doe',
  email: 'bDy0W@example.com',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=18',
    alt: 'John Doe'
  },
  status: 'active',
  grade: 'A'
}]

export default eventHandler(async () => {
  return members
})