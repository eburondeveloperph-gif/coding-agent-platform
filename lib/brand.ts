const DEFAULT_BRAND_NAME = 'Eburon AI'
const DEFAULT_BRAND_DESCRIPTION = 'Autonomous multi-agent coding platform powered by Orbit Sandbox and AI Gateway.'
const DEFAULT_BRAND_TAGLINE = 'Autonomous multi-agent coding platform'
const DEFAULT_DEPLOY_LABEL = 'Deploy Eburon AI'
const DEFAULT_FALLBACK_STARS = 0

function getEnvValue(value: string | undefined): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function parseInteger(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const BRAND_NAME = getEnvValue(process.env.NEXT_PUBLIC_BRAND_NAME) || DEFAULT_BRAND_NAME
export const BRAND_DESCRIPTION = getEnvValue(process.env.NEXT_PUBLIC_BRAND_DESCRIPTION) || DEFAULT_BRAND_DESCRIPTION
export const BRAND_TAGLINE = getEnvValue(process.env.NEXT_PUBLIC_BRAND_TAGLINE) || DEFAULT_BRAND_TAGLINE
export const BRAND_PLATFORM_NAME = `${BRAND_NAME} Platform`
export const BRAND_DEPLOY_LABEL = getEnvValue(process.env.NEXT_PUBLIC_BRAND_DEPLOY_LABEL) || DEFAULT_DEPLOY_LABEL
export const BRAND_GITHUB_REPO = getEnvValue(process.env.NEXT_PUBLIC_BRAND_GITHUB_REPO)
export const BRAND_GITHUB_URL = BRAND_GITHUB_REPO ? `https://github.com/${BRAND_GITHUB_REPO}` : null
export const BRAND_FALLBACK_STARS = parseInteger(process.env.NEXT_PUBLIC_BRAND_FALLBACK_STARS, DEFAULT_FALLBACK_STARS)
export const BRAND_GIT_AUTHOR_NAME = BRAND_NAME
