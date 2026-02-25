export type OpenMaxAgent =
  | 'orbit'
  | 'codemax'
  | 'terminal'
  | 'echo'
  | 'vision'
  | 'claude'
  | 'codex'
  | 'gemini'
  | 'opencode'
  | 'opencode_local'
  | 'claudecode_local'
  | 'copilot'
  | 'cursor'

export type ProviderRequirement = 'openai' | 'gemini' | 'cursor' | 'anthropic' | 'aigateway'

export type RoutingTag = 'claw_actions' | 'quick_codegen' | 'local_repo_work' | 'local_code_review' | 'default'

export interface AgentModel {
  value: string
  label: string
}

const CLAUDE_MODELS: AgentModel[] = [
  { value: 'claude-sonnet-4-5', label: 'orbit model 1' },
  { value: 'anthropic/claude-opus-4.6', label: 'orbit model 2' },
  { value: 'claude-haiku-4-5', label: 'orbit model 3' },
]

const CODEMAX_MODELS: AgentModel[] = [
  { value: 'minimax-m2.5:cloud', label: 'eburonmax-1.3' },
  { value: 'openai/gpt-5.1', label: 'eburonmax model 1' },
  { value: 'openai/gpt-5.1-codex', label: 'eburonmax model 2' },
  { value: 'openai/gpt-5.1-codex-mini', label: 'eburonmax model 3' },
  { value: 'openai/gpt-5', label: 'eburonmax model 4' },
  { value: 'gpt-5-codex', label: 'eburonmax model 5' },
  { value: 'openai/gpt-5-mini', label: 'eburonmax model 6' },
  { value: 'openai/gpt-5-nano', label: 'eburonmax model 7' },
  { value: 'gpt-5-pro', label: 'eburonmax model 8' },
  { value: 'openai/gpt-4.1', label: 'eburonmax model 9' },
]

const TERMINAL_MODELS: AgentModel[] = [
  { value: 'gemini-3-pro-preview', label: 'terminal model 1' },
  { value: 'gemini-2.5-pro', label: 'terminal model 2' },
  { value: 'gemini-2.5-flash', label: 'terminal model 3' },
]

const ECHO_MODELS: AgentModel[] = [
  { value: 'qwen2.5-coder:7b', label: 'echo model 1' },
  { value: 'qwen2.5-coder:14b', label: 'echo model 2' },
  { value: 'deepseek-coder-v2:16b', label: 'echo model 3' },
  { value: 'codellama:13b', label: 'echo model 4' },
]

const VISION_MODELS: AgentModel[] = [
  { value: 'llama3.1:8b', label: 'vision model 1' },
  { value: 'qwen2.5-coder:14b', label: 'vision model 2' },
  { value: 'deepseek-coder-v2:16b', label: 'vision model 3' },
]

const OPENCODE_MODELS: AgentModel[] = [
  { value: 'gpt-5', label: 'echo cloud model 1' },
  { value: 'gpt-5-mini', label: 'echo cloud model 2' },
  { value: 'gpt-5-nano', label: 'echo cloud model 3' },
  { value: 'gpt-4.1', label: 'echo cloud model 4' },
  { value: 'claude-sonnet-4-5', label: 'echo cloud model 5' },
  { value: 'claude-opus-4-5', label: 'echo cloud model 6' },
  { value: 'claude-haiku-4-5', label: 'echo cloud model 7' },
]

const CURSOR_MODELS: AgentModel[] = [
  { value: 'auto', label: 'vision remote model 1' },
  { value: 'composer-1', label: 'vision remote model 2' },
  { value: 'sonnet-4.5', label: 'vision remote model 3' },
  { value: 'sonnet-4.5-thinking', label: 'vision remote model 4' },
  { value: 'gpt-5', label: 'vision remote model 5' },
  { value: 'gpt-5-codex', label: 'vision remote model 6' },
  { value: 'opus-4.5', label: 'vision remote model 7' },
  { value: 'opus-4.1', label: 'vision remote model 8' },
  { value: 'grok', label: 'vision remote model 9' },
]

const COPILOT_MODELS: AgentModel[] = [
  { value: 'claude-sonnet-4.5', label: 'copilot model 1' },
  { value: 'claude-sonnet-4', label: 'copilot model 2' },
  { value: 'claude-haiku-4.5', label: 'copilot model 3' },
  { value: 'gpt-5', label: 'copilot model 4' },
]

export const OPENMAX_AGENT_OPTIONS: Array<{ value: OpenMaxAgent; label: string }> = [
  { value: 'codemax', label: 'eburonmax' },
  { value: 'terminal', label: 'terminal' },
  { value: 'orbit', label: 'orbit' },
  { value: 'echo', label: 'echo' },
  { value: 'vision', label: 'vision' },
]

export const OPENMAX_LEGACY_AGENT_VALUES: OpenMaxAgent[] = [
  'claude',
  'codex',
  'gemini',
  'opencode',
  'opencode_local',
  'claudecode_local',
  'copilot',
  'cursor',
]

export const OPENMAX_ALL_AGENT_VALUES: OpenMaxAgent[] = [
  ...OPENMAX_AGENT_OPTIONS.map((agent) => agent.value),
  ...OPENMAX_LEGACY_AGENT_VALUES,
]

export const OPENMAX_AGENT_MODELS: Record<OpenMaxAgent, AgentModel[]> = {
  orbit: CLAUDE_MODELS,
  claude: CLAUDE_MODELS,

  codemax: CODEMAX_MODELS,
  codex: CODEMAX_MODELS,

  terminal: TERMINAL_MODELS,
  gemini: TERMINAL_MODELS,

  echo: ECHO_MODELS,
  opencode_local: ECHO_MODELS,

  vision: VISION_MODELS,
  claudecode_local: VISION_MODELS,

  opencode: OPENCODE_MODELS,
  cursor: CURSOR_MODELS,
  copilot: COPILOT_MODELS,
}

export const OPENMAX_DEFAULT_MODELS: Record<OpenMaxAgent, string> = {
  orbit: 'claude-sonnet-4-5',
  claude: 'claude-sonnet-4-5',

  codemax: 'minimax-m2.5:cloud',
  codex: 'minimax-m2.5:cloud',

  terminal: 'gemini-3-pro-preview',
  gemini: 'gemini-3-pro-preview',

  echo: 'qwen2.5-coder:7b',
  opencode_local: 'qwen2.5-coder:7b',

  vision: 'llama3.1:8b',
  claudecode_local: 'llama3.1:8b',

  opencode: 'gpt-5',
  cursor: 'auto',
  copilot: 'claude-sonnet-4.5',
}

export const ROUTING_TAG_TO_AGENT: Record<RoutingTag, OpenMaxAgent> = {
  claw_actions: 'codemax',
  quick_codegen: 'terminal',
  local_repo_work: 'echo',
  local_code_review: 'vision',
  default: 'codemax',
}

export function normalizeAgent(agent?: string | null): OpenMaxAgent {
  if (!agent) {
    return 'codemax'
  }

  const normalized = agent.toLowerCase()

  switch (normalized) {
    case 'eburonmax':
    case 'codemax':
    case 'codex':
      return normalized === 'codex' ? 'codemax' : 'codemax'
    case 'terminal':
    case 'gemini':
      return 'terminal'
    case 'orbit':
    case 'claude':
      return 'orbit'
    case 'echo':
      return 'echo'
    case 'vision':
      return 'vision'
    case 'opencode_local':
      return 'echo'
    case 'claudecode_local':
      return 'vision'
    case 'opencode':
      return 'opencode'
    case 'cursor':
      return 'cursor'
    case 'copilot':
      return 'copilot'
    default:
      return 'codemax'
  }
}

export function canonicalizeStoredAgent(agent?: string | null): OpenMaxAgent {
  if (!agent) {
    return 'codemax'
  }

  const normalized = agent.toLowerCase()
  if (OPENMAX_ALL_AGENT_VALUES.includes(normalized as OpenMaxAgent)) {
    return normalized as OpenMaxAgent
  }

  return normalizeAgent(normalized)
}

export function getDisplayAgentName(agent?: string | null): string {
  if (!agent) {
    return 'eburonmax'
  }

  const normalized = agent.toLowerCase()

  switch (normalized) {
    case 'claude':
    case 'orbit':
      return 'orbit'
    case 'eburonmax':
    case 'codex':
    case 'codemax':
      return 'eburonmax'
    case 'gemini':
    case 'terminal':
      return 'terminal'
    case 'opencode':
    case 'opencode_local':
    case 'echo':
      return 'echo'
    case 'cursor':
    case 'claudecode_local':
    case 'vision':
      return 'vision'
    case 'copilot':
      return 'orbit'
    default:
      return normalizeAgent(agent) === 'codemax' ? 'eburonmax' : normalizeAgent(agent)
  }
}

export function getModelsForAgent(agent?: string | null): AgentModel[] {
  const normalized = canonicalizeStoredAgent(agent)
  return OPENMAX_AGENT_MODELS[normalized] || OPENMAX_AGENT_MODELS.codemax
}

export function getDefaultModelForAgent(agent?: string | null): string {
  const normalized = canonicalizeStoredAgent(agent)
  return OPENMAX_DEFAULT_MODELS[normalized] || OPENMAX_DEFAULT_MODELS.codemax
}

export function getRequiredProvidersForAgent(agent?: string | null, model?: string | null): ProviderRequirement[] {
  const normalized = canonicalizeStoredAgent(agent)

  if (normalized === 'codemax' || normalized === 'codex') {
    return ['aigateway']
  }
  if (normalized === 'terminal' || normalized === 'gemini') {
    return ['gemini']
  }
  if (normalized === 'orbit' || normalized === 'claude') {
    return ['aigateway']
  }
  if (normalized === 'cursor') {
    return ['cursor']
  }
  if (normalized === 'copilot') {
    return []
  }
  if (
    normalized === 'echo' ||
    normalized === 'vision' ||
    normalized === 'opencode_local' ||
    normalized === 'claudecode_local'
  ) {
    return []
  }

  if (normalized === 'opencode') {
    const selectedModel = model || ''
    const modelLower = selectedModel.toLowerCase()
    if (modelLower.includes('claude') || modelLower.includes('sonnet') || modelLower.includes('opus')) {
      return ['anthropic']
    }
    return ['aigateway']
  }

  return []
}

export function parseRoutingTagFromInstruction(instruction: string): RoutingTag | null {
  const directMatch = instruction.match(/\b(claw_actions|quick_codegen|local_repo_work|local_code_review|default)\b/i)
  if (directMatch?.[1]) {
    return directMatch[1].toLowerCase() as RoutingTag
  }

  const routeMatch = instruction.match(/route[_\s-]?tag\s*:\s*([a-z_]+)/i)
  if (routeMatch?.[1]) {
    const candidate = routeMatch[1].toLowerCase()
    if (candidate in ROUTING_TAG_TO_AGENT) {
      return candidate as RoutingTag
    }
  }

  return null
}

export function resolveExecutionAgent(agent?: string | null): OpenMaxAgent {
  const normalized = canonicalizeStoredAgent(agent)

  switch (normalized) {
    case 'codemax':
      return 'codex'
    case 'terminal':
      return 'gemini'
    case 'orbit':
      return 'claude'
    case 'echo':
      return 'opencode_local'
    case 'vision':
      return 'claudecode_local'
    default:
      return normalized
  }
}

export function isOllamaAgent(agent?: string | null): boolean {
  const normalized = canonicalizeStoredAgent(agent)
  return ['echo', 'vision', 'opencode_local', 'claudecode_local'].includes(normalized)
}
