import { Sandbox } from '@vercel/sandbox'
import { AgentExecutionResult } from '../types'
import { TaskLogger } from '@/lib/utils/task-logger'
import { connectors } from '@/lib/db/schema'
import { executeOpenCodeInSandbox } from './opencode'
import { ensureOllamaModelAvailability } from './ollama-api'

type Connector = typeof connectors.$inferSelect

const DEFAULT_OLLAMA_BASE_URL = 'http://host.docker.internal:11434'
const DEFAULT_ECHO_MODEL = 'qwen2.5-coder:7b'

export async function executeOpenCodeLocalInSandbox(
  sandbox: Sandbox,
  instruction: string,
  logger: TaskLogger,
  selectedModel?: string,
  mcpServers?: Connector[],
  isResumed?: boolean,
  sessionId?: string,
): Promise<AgentExecutionResult> {
  const originalOpenAiKey = process.env.OPENAI_API_KEY
  const originalOpenAiBaseUrl = process.env.OPENAI_BASE_URL
  const originalOllamaBaseUrl = process.env.OLLAMA_BASE_URL
  const originalAnthropicKey = process.env.ANTHROPIC_API_KEY

  try {
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL
    const modelToUse = selectedModel || DEFAULT_ECHO_MODEL

    process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'ollama'
    process.env.OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || `${ollamaBaseUrl}/v1`
    process.env.OLLAMA_BASE_URL = ollamaBaseUrl

    // Force local runtime for this adapter by clearing Anthropic fallback.
    delete process.env.ANTHROPIC_API_KEY

    await logger.info('Starting local Ollama adapter')

    const modelReady = await ensureOllamaModelAvailability(sandbox, logger, ollamaBaseUrl, modelToUse)
    if (!modelReady) {
      return {
        success: false,
        error: 'Local model runtime unavailable. Ensure Ollama is running and the model is available.',
        cliName: 'opencode_local',
        changesDetected: false,
      }
    }

    const result = await executeOpenCodeInSandbox(
      sandbox,
      instruction,
      logger,
      modelToUse,
      mcpServers,
      isResumed,
      sessionId,
    )

    return {
      ...result,
      cliName: 'opencode_local',
    }
  } finally {
    process.env.OPENAI_API_KEY = originalOpenAiKey
    process.env.OPENAI_BASE_URL = originalOpenAiBaseUrl
    process.env.OLLAMA_BASE_URL = originalOllamaBaseUrl
    process.env.ANTHROPIC_API_KEY = originalAnthropicKey
  }
}
