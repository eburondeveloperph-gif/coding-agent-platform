import { NextResponse, type NextRequest } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { verifyPassword } from '@/lib/auth/password'
import { saveSession } from '@/lib/session/create'
import { createLocalSession } from '@/lib/session/create-local'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid login data' }, { status: 400 })
  }

  const normalizedEmail = normalizeEmail(parsed.data.email)

  const matches = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(and(eq(users.provider, 'local'), eq(users.externalId, normalizedEmail)))
    .limit(1)

  const user = matches[0]

  if (!user?.passwordHash || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const now = new Date()
  await db
    .update(users)
    .set({
      updatedAt: now,
      lastLoginAt: now,
    })
    .where(eq(users.id, user.id))

  const session = createLocalSession({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  })

  const response = NextResponse.json({ success: true })
  await saveSession(response, session)
  return response
}
