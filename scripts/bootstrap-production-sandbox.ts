#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { config as loadEnv } from 'dotenv'

const ENV_FILE = path.resolve(process.cwd(), '.env.production')
const VERCEL_API_BASE = 'https://api.vercel.com'
const PLACEHOLDER_PREFIXES = ['your_', 'replace_']
const PLACEHOLDER_EXACT_VALUES = new Set([
  'your_vercel_api_token',
  'your_team_id',
  'your_sandbox_project_id',
  'replace_with_real_value',
])

interface VercelUserResponse {
  user?: {
    id?: string
    uid?: string
  }
  id?: string
  uid?: string
}

interface VercelProject {
  id: string
  name: string
}

interface VercelProjectsResponse {
  projects?: VercelProject[]
}

interface VercelTeam {
  id: string
}

interface VercelTeamsResponse {
  teams?: VercelTeam[]
}

function hasConfiguredValue(value?: string | null): value is string {
  if (!value) {
    return false
  }

  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return false
  }

  if (PLACEHOLDER_EXACT_VALUES.has(normalized)) {
    return false
  }

  return !PLACEHOLDER_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function upsertEnvValue(content: string, key: string, value: string): string {
  const keyRegex = new RegExp(`^\\s*#?\\s*${escapeRegex(key)}=`, 'i')
  const lines = content.split(/\r?\n/)
  const targetLine = `${key}=${value}`

  for (let index = 0; index < lines.length; index += 1) {
    if (keyRegex.test(lines[index])) {
      lines[index] = targetLine
      return lines.join('\n')
    }
  }

  if (lines.length > 0 && lines[lines.length - 1].trim() !== '') {
    lines.push('')
  }
  lines.push(targetLine)
  return lines.join('\n')
}

async function vercelRequest<T>(token: string, endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${VERCEL_API_BASE}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Vercel API request failed')
  }

  return (await response.json()) as T
}

async function resolveAccountId(token: string): Promise<string> {
  const userResponse = await vercelRequest<VercelUserResponse>(token, '/v2/user')
  const accountId = userResponse.user?.id || userResponse.user?.uid || userResponse.id || userResponse.uid

  if (!accountId) {
    throw new Error('Unable to resolve Vercel account ID')
  }

  return accountId
}

async function resolveDefaultTeamId(token: string, fallbackAccountId: string): Promise<string> {
  try {
    const teamsResponse = await vercelRequest<VercelTeamsResponse>(token, '/v2/teams')
    const firstTeamId = teamsResponse.teams?.[0]?.id
    if (firstTeamId) {
      return firstTeamId
    }
  } catch {
    // Fallback to account ID for personal scopes when teams listing is unavailable.
  }

  return fallbackAccountId
}

async function projectExists(token: string, accountId: string, projectId: string): Promise<boolean> {
  try {
    await vercelRequest(token, `/v9/projects/${encodeURIComponent(projectId)}?teamId=${encodeURIComponent(accountId)}`)
    return true
  } catch {
    return false
  }
}

async function findProjectByName(token: string, accountId: string, projectName: string): Promise<VercelProject | null> {
  const projectsResponse = await vercelRequest<VercelProjectsResponse>(
    token,
    `/v9/projects?teamId=${encodeURIComponent(accountId)}&search=${encodeURIComponent(projectName)}&limit=100`,
  )

  const exactMatch = projectsResponse.projects?.find((project) => project.name === projectName)
  return exactMatch || null
}

async function createProject(token: string, accountId: string, projectName: string): Promise<string> {
  const created = await vercelRequest<VercelProject>(token, `/v10/projects?teamId=${encodeURIComponent(accountId)}`, {
    method: 'POST',
    body: JSON.stringify({
      name: projectName,
    }),
  })

  if (!created.id) {
    throw new Error('Vercel project was created without an ID')
  }

  return created.id
}

async function readEnvFile(): Promise<string> {
  try {
    return await readFile(ENV_FILE, 'utf8')
  } catch {
    return ''
  }
}

async function main() {
  loadEnv({ path: ENV_FILE, override: true, quiet: true })

  const token = process.env.SANDBOX_VERCEL_TOKEN || process.env.VERCEL_TOKEN || ''
  if (!hasConfiguredValue(token)) {
    throw new Error('Set SANDBOX_VERCEL_TOKEN (or VERCEL_TOKEN) in .env.production before running sandbox bootstrap.')
  }

  const accountId = await resolveAccountId(token)
  const configuredTeamId = process.env.SANDBOX_VERCEL_TEAM_ID || ''
  const teamId = hasConfiguredValue(configuredTeamId)
    ? configuredTeamId.trim()
    : await resolveDefaultTeamId(token, accountId)

  const configuredProjectId = process.env.SANDBOX_VERCEL_PROJECT_ID || ''
  let projectId = hasConfiguredValue(configuredProjectId) ? configuredProjectId.trim() : ''

  if (projectId) {
    const exists = await projectExists(token, teamId, projectId)
    if (!exists) {
      projectId = ''
    }
  }

  if (!projectId) {
    const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Eburon AI'
    const projectName = `${slugify(brandName)}-sandbox`
    const existingProject = await findProjectByName(token, teamId, projectName)
    projectId = existingProject?.id || (await createProject(token, teamId, projectName))
  }

  let envContent = await readEnvFile()
  envContent = upsertEnvValue(envContent, 'SANDBOX_VERCEL_TOKEN', token)
  envContent = upsertEnvValue(envContent, 'SANDBOX_VERCEL_TEAM_ID', teamId)
  envContent = upsertEnvValue(envContent, 'SANDBOX_VERCEL_PROJECT_ID', projectId)

  const finalContent = envContent.endsWith('\n') ? envContent : `${envContent}\n`
  await writeFile(ENV_FILE, finalContent, 'utf8')

  console.log('Sandbox bootstrap completed')
}

main().catch((error: unknown) => {
  console.error('Sandbox bootstrap failed')
  process.exit(1)
})
