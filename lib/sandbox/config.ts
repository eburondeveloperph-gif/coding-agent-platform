const PLACEHOLDER_PREFIXES = ['your_', 'replace_']
const PLACEHOLDER_EXACT_VALUES = new Set([
  'your_vercel_api_token',
  'your_team_id',
  'your_sandbox_project_id',
  'your_github_personal_access_token',
])

function hasConfiguredValue(value?: string | null): boolean {
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

export function validateEnvironmentVariables(
  selectedAgent: string = 'codemax',
  githubToken?: string | null,
  apiKeys?: {
    OPENAI_API_KEY?: string
    GEMINI_API_KEY?: string
    CURSOR_API_KEY?: string
    ANTHROPIC_API_KEY?: string
    AI_GATEWAY_API_KEY?: string
    OLLAMA_API_KEY?: string
  },
) {
  const errors: string[] = []
  const normalizedAgent = selectedAgent.toLowerCase()
  const hasAiGateway = !!(apiKeys?.AI_GATEWAY_API_KEY || process.env.AI_GATEWAY_API_KEY)
  const hasOllama = !!(apiKeys?.OLLAMA_API_KEY || process.env.OLLAMA_API_KEY)

  // Check for required environment variables based on selected agent
  if ((normalizedAgent === 'claude' || normalizedAgent === 'orbit') && !hasAiGateway) {
    errors.push('AI_GATEWAY_API_KEY is required for Claude CLI. Please add your API key in your profile.')
  }

  if (normalizedAgent === 'cursor' && !apiKeys?.CURSOR_API_KEY && !process.env.CURSOR_API_KEY) {
    errors.push('CURSOR_API_KEY is required for Cursor CLI. Please add your API key in your profile.')
  }

  if ((normalizedAgent === 'codex' || normalizedAgent === 'codemax') && !hasAiGateway && !hasOllama) {
    errors.push(
      'Either OLLAMA_API_KEY or AI_GATEWAY_API_KEY is required for Codex CLI. Please add your API key in your profile.',
    )
  }

  if (
    (normalizedAgent === 'gemini' || normalizedAgent === 'terminal') &&
    !apiKeys?.GEMINI_API_KEY &&
    !process.env.GEMINI_API_KEY
  ) {
    errors.push('GEMINI_API_KEY is required for Gemini CLI. Please add your API key in your profile.')
  }

  if (normalizedAgent === 'opencode') {
    // OpenCode can use either AI Gateway (for GPT models) or Anthropic (for Claude models)
    // We require at least one to be present
    const hasAnthropic = apiKeys?.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY

    if (!hasAiGateway && !hasAnthropic) {
      errors.push(
        'Either AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY is required for OpenCode CLI. Please add at least one API key in your profile.',
      )
    }
  }

  // Local adapters (echo/vision) inject defaults at runtime and do not require cloud keys.

  // Check for GitHub token for private repositories
  // Use user's token if provided
  if (!hasConfiguredValue(githubToken)) {
    errors.push('GitHub is required for repository access. Please connect your GitHub account.')
  }

  // Check for Orbit sandbox environment variables
  if (!hasConfiguredValue(process.env.SANDBOX_VERCEL_TEAM_ID)) {
    errors.push('SANDBOX_VERCEL_TEAM_ID is required for sandbox creation')
  }

  if (!hasConfiguredValue(process.env.SANDBOX_VERCEL_PROJECT_ID)) {
    errors.push('SANDBOX_VERCEL_PROJECT_ID is required for sandbox creation')
  }

  if (!hasConfiguredValue(process.env.SANDBOX_VERCEL_TOKEN)) {
    errors.push('SANDBOX_VERCEL_TOKEN is required for sandbox creation')
  }

  return {
    valid: errors.length === 0,
    error: errors.length > 0 ? errors.join(', ') : undefined,
  }
}

export function createAuthenticatedRepoUrl(repoUrl: string, githubToken?: string | null): string {
  if (!githubToken) {
    return repoUrl
  }

  try {
    const url = new URL(repoUrl)
    if (url.hostname === 'github.com') {
      // Add GitHub token for authentication
      url.username = githubToken
      url.password = 'x-oauth-basic'
    }
    return url.toString()
  } catch {
    // Failed to parse repository URL
    return repoUrl
  }
}

export function createSandboxConfiguration(config: {
  repoUrl: string
  timeout?: string
  ports?: number[]
  runtime?: string
  resources?: { vcpus?: number }
  branchName?: string
}) {
  return {
    template: 'node',
    git: {
      url: config.repoUrl,
      branch: config.branchName || 'main',
    },
    timeout: config.timeout || '20m',
    ports: config.ports || [3000],
    runtime: config.runtime || 'node22',
    resources: config.resources || { vcpus: 4 },
  }
}
