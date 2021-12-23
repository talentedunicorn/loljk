import bcrypt from "bcrypt"
import { createCookieSessionStorage, redirect } from "remix"
import { db } from "./db.server"

type TLogin = {
  username: string
  password: string
}
const sessionSecret = process.env.SESSION_SECRET;
if(!sessionSecret) {
  throw new Error("SESSION_SECRET must be set")
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "LOL_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

export const login = async ({ username, password }: TLogin) => {
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true, username: true, passwordHash: true }
  })

  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword) return null

  return user
}

export const logout = async (request: Request) => {
  const session = await getUserSession(request)
  return redirect('/login', {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  })
}

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession()
  session.set("userId", userId)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  })
}

export const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"))
}

export const requireSession = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if(!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo]
    ])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export const getUser = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  try {
    const user = await db.user.findUnique({
      where: { id: userId }
    })
    return user
  } catch {
    throw logout(request)
  }
}

export const createUser = async ({ username, password }: TLogin) => {
  const passwordHash = await bcrypt.hash(password, 10)
  return db.user.create({
    data: {
      username,
      passwordHash
    }
  })
}
