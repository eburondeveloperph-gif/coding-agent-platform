import 'server-only'

import type { Session } from './types'

interface LocalSessionUser {
  id: string
  username: string
  email?: string | null
  name?: string | null
  avatarUrl?: string | null
}

export function createLocalSession(user: LocalSessionUser): Session {
  return {
    created: Date.now(),
    authProvider: 'local',
    user: {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      name: user.name || user.username,
      avatar: user.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.username)}`,
    },
  }
}
