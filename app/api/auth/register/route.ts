import { NextResponse, type NextRequest } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { hashPassword } from '@/lib/auth/password'
import { saveSession } from '@/lib/session/create'
import { createLocalSession } from '@/lib/session/create-local'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  username: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(2).max(50).optional(),
  ),
  name: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(2).max(80).optional(),
  ),
})

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function deriveUsername(email: string): string {
  const localPart = email.split('@')[0] || 'user'
  const normalized = localPart.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
  return normalized.slice(0, 50) || 'user'
}

function buildAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}`
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid registration data' }, { status: 400 })
  }

  const normalizedEmail = normalizeEmail(parsed.data.email)
  const username = parsed.data.username?.trim() || deriveUsername(normalizedEmail)
  const name = parsed.data.name?.trim() || username

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.provider, 'local'), eq(users.externalId, normalizedEmail)))
    .limit(1)

  if (existing.length > 0) {
    return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })
  }

  const now = new Date()
  const userId = nanoid()
  const avatarUrl = buildAvatarUrl(username)
  const passwordHash = hashPassword(parsed.data.password)

  await db.insert(users).values({
    id: userId,
    provider: 'local',
    externalId: normalizedEmail,
    accessToken: 'local-auth',
    refreshToken: null,
    scope: 'local',
    passwordHash,
    username,
    email: normalizedEmail,
    name,
    avatarUrl,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  })

  const session = createLocalSession({
    id: userId,
    username,
    email: normalizedEmail,
    name,
    avatarUrl,
  })

  const response = NextResponse.json({ success: true }, { status: 201 })
  await saveSession(response, session)
  return response
}
