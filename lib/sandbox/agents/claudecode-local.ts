import { Sandbox } from '@vercel/sandbox'
import { AgentExecutionResult } from '../types'
import { TaskLogger } from '@/lib/utils/task-logger'
import { connectors } from '@/lib/db/schema'
import { executeOpenCodeLocalInSandbox } from './opencode-local'

type Connector = typeof connectors.$inferSelect

const DEFAULT_VISION_MODEL = 'llama3.1:8b'

export async function executeClaudeCodeLocalInSandbox(
  sandbox: Sandbox,
  instruction: string,
  logger: TaskLogger,
  selectedModel?: string,
  mcpServers?: Connector[],
  isResumed?: boolean,
  sessionId?: string,
): Promise<AgentExecutionResult> {
  await logger.info('Starting local code review adapter')

  const result = await executeOpenCodeLocalInSandbox(
    sandbox,
    instruction,
    logger,
    selectedModel || DEFAULT_VISION_MODEL,
    mcpServers,
    isResumed,
    sessionId,
  )

  return {
    ...result,
    cliName: 'claudecode_local',
  }
}
