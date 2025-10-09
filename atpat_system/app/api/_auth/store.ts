type Role = "admin" | "student"

export type StoredUser = {
  id: string
  name: string
  email: string
  role: Role
  password: string // NOTE: plain for demo only
}

const usersByEmail = new Map<string, StoredUser>()
const usersById = new Map<string, StoredUser>()
const sessions = new Map<string, string>() // token -> userId

export function createUser(u: Omit<StoredUser, "id">): StoredUser {
  const id = crypto.randomUUID()
  const user: StoredUser = { id, ...u }
  usersByEmail.set(user.email.toLowerCase(), user)
  usersById.set(user.id, user)
  return user
}

export function getUserByEmail(email: string): StoredUser | undefined {
  return usersByEmail.get(email.toLowerCase())
}

export function getUserById(id: string): StoredUser | undefined {
  return usersById.get(id)
}

export function verifyUser(email: string, password: string): StoredUser | undefined {
  const u = getUserByEmail(email)
  if (!u) return undefined
  return u.password === password ? u : undefined
}

export function createSession(userId: string, token: string) {
  sessions.set(token, userId)
}

export function getUserIdBySession(token: string | undefined | null): string | undefined {
  if (!token) return undefined
  return sessions.get(token)
}

export function deleteSession(token: string | undefined | null) {
  if (!token) return
  sessions.delete(token)
}

export function publicUser(u: StoredUser) {
  const { password, ...safe } = u
  return safe
}
