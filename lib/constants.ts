import { BRAND_NAME } from '@/lib/brand'

// Rate limiting configuration
export const MAX_MESSAGES_PER_DAY = parseInt(process.env.MAX_MESSAGES_PER_DAY || '5', 10)

// Sandbox configuration (in minutes)
export const MAX_SANDBOX_DURATION = parseInt(process.env.MAX_SANDBOX_DURATION || '300', 10)

function slugifyBrandName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const deployRepositoryUrl = process.env.NEXT_PUBLIC_VERCEL_DEPLOY_REPOSITORY_URL?.trim() || ''
const fallbackSlug = slugifyBrandName(BRAND_NAME) || 'eburon-ai'
const deployProjectName = process.env.NEXT_PUBLIC_VERCEL_DEPLOY_PROJECT_NAME?.trim() || fallbackSlug
const deployRepositoryName = process.env.NEXT_PUBLIC_VERCEL_DEPLOY_REPOSITORY_NAME?.trim() || fallbackSlug

const deployQuery = new URLSearchParams({
  'repository-url': deployRepositoryUrl,
  env: 'SANDBOX_VERCEL_TEAM_ID,SANDBOX_VERCEL_PROJECT_ID,SANDBOX_VERCEL_TOKEN,JWE_SECRET,ENCRYPTION_KEY',
  envDescription:
    'Required environment variables for the Eburon AI platform. You must also configure at least one OAuth provider (GitHub or Vercel) after deployment. Optional API keys can be added later.',
  stores: '[{"type":"postgres"}]',
  'project-name': deployProjectName,
  'repository-name': deployRepositoryName,
})

// Vercel deployment configuration
export const VERCEL_DEPLOY_URL = deployRepositoryUrl
  ? `https://vercel.com/new/clone?${deployQuery.toString()}`
  : 'https://vercel.com/new'

// Vercel button URL for markdown
export const VERCEL_DEPLOY_BUTTON_URL = `[![Deploy with Vercel](https://vercel.com/button)](${VERCEL_DEPLOY_URL})`
