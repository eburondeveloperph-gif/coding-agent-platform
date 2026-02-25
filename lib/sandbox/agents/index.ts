import { Sandbox } from '@vercel/sandbox'
import { AgentExecutionResult } from '../types'
import { executeClaudeInSandbox } from './claude'
import { executeCodexInSandbox } from './codex'
import { executeCopilotInSandbox } from './copilot'
import { executeCursorInSandbox } from './cursor'
import { executeGeminiInSandbox } from './gemini'
import { executeOpenCodeInSandbox } from './opencode'
import { executeOpenCodeLocalInSandbox } from './opencode-local'
import { executeClaudeCodeLocalInSandbox } from './claudecode-local'
import { TaskLogger } from '@/lib/utils/task-logger'
import { Connector } from '@/lib/db/schema'
import {
  parseRoutingTagFromInstruction,
  resolveExecutionAgent,
  ROUTING_TAG_TO_AGENT,
  type OpenMaxAgent,
} from '@/lib/openmax/agents'

export type AgentType = OpenMaxAgent

// Re-export types
export type { AgentExecutionResult } from '../types'

function wrapSubAgentResult(result: AgentExecutionResult, agent: OpenMaxAgent): AgentExecutionResult {
  return {
    ...result,
    agentResponse: JSON.stringify({
      subagent_name: agent,
      confidence: result.success ? 0.85 : 0.25,
      result: result.agentResponse || result.output || '',
      artifacts: [],
    }),
  }
}

// Main agent execution function
export async function executeAgentInSandbox(
  sandbox: Sandbox,
  instruction: string,
  agentType: AgentType,
  logger: TaskLogger,
  selectedModel?: string,
  mcpServers?: Connector[],
  onCancellationCheck?: () => Promise<boolean>,
  apiKeys?: {
    OPENAI_API_KEY?: string
    GEMINI_API_KEY?: string
    CURSOR_API_KEY?: string
    ANTHROPIC_API_KEY?: string
    AI_GATEWAY_API_KEY?: string
    OLLAMA_API_KEY?: string
  },
  isResumed?: boolean,
  sessionId?: string,
  taskId?: string,
  agentMessageId?: string,
): Promise<AgentExecutionResult> {
  // Check for cancellation before starting agent execution
  if (onCancellationCheck && (await onCancellationCheck())) {
    await logger.info('Task was cancelled before agent execution')
    return {
      success: false,
      error: 'Task was cancelled',
      cliName: agentType,
      changesDetected: false,
    }
  }

  const executionAgent = resolveExecutionAgent(agentType)
  let routedAgent = executionAgent
  let shouldWrapOutput = false

  if (agentType === 'codemax') {
    const routingTag = parseRoutingTagFromInstruction(instruction)
    if (routingTag) {
      routedAgent = resolveExecutionAgent(ROUTING_TAG_TO_AGENT[routingTag])
      shouldWrapOutput = routedAgent !== 'codex'
      await logger.info('Orchestrator routing policy applied')
    }
  }

  // For Copilot agent, get the GitHub token from the user's GitHub account
  let githubToken: string | undefined
  if (routedAgent === 'copilot') {
    const { getUserGitHubToken } = await import('@/lib/github/user-token')
    githubToken = (await getUserGitHubToken()) || undefined
  }

  // Temporarily override process.env with user's API keys if provided
  const originalEnv = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    CURSOR_API_KEY: process.env.CURSOR_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    OLLAMA_API_KEY: process.env.OLLAMA_API_KEY,
    GH_TOKEN: process.env.GH_TOKEN,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  }

  if (apiKeys?.OPENAI_API_KEY) process.env.OPENAI_API_KEY = apiKeys.OPENAI_API_KEY
  if (apiKeys?.GEMINI_API_KEY) process.env.GEMINI_API_KEY = apiKeys.GEMINI_API_KEY
  if (apiKeys?.CURSOR_API_KEY) process.env.CURSOR_API_KEY = apiKeys.CURSOR_API_KEY
  if (apiKeys?.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = apiKeys.ANTHROPIC_API_KEY
  if (apiKeys?.AI_GATEWAY_API_KEY) process.env.AI_GATEWAY_API_KEY = apiKeys.AI_GATEWAY_API_KEY
  if (apiKeys?.OLLAMA_API_KEY) process.env.OLLAMA_API_KEY = apiKeys.OLLAMA_API_KEY
  if (githubToken) {
    process.env.GH_TOKEN = githubToken
    process.env.GITHUB_TOKEN = githubToken
  }

  try {
    switch (routedAgent) {
      case 'claude': {
        const claudeResult = await executeClaudeInSandbox(
          sandbox,
          instruction,
          logger,
          selectedModel,
          mcpServers,
          isResumed,
          sessionId,
          taskId,
          agentMessageId,
        )
        return shouldWrapOutput ? wrapSubAgentResult(claudeResult, routedAgent) : claudeResult
      }

      case 'codex': {
        const codexResult = await executeCodexInSandbox(
          sandbox,
          instruction,
          logger,
          selectedModel,
          mcpServers,
          isResumed,
          sessionId,
        )
        return shouldWrapOutput ? wrapSubAgentResult(codexResult, routedAgent) : codexResult
      }

      case 'copilot': {
        const copilotResult = await executeCopilotInSandbox(
          sandbox,
          instruction,
          logger,
          selectedModel,
          mcpServers,
          isResumed,
          sessionId,
          taskId,
        )
        return shouldWrapOutput ? wrapSubAgentResult(copilotResult, routedAgent) : copilotResult
      }

      case 'cursor': {
        const cursorResult = await executeCursorInSandbox(
          sandbox,
          instruction,
          logger,
          selectedModel,
          mcpServers,
          isResumed,
          sessionId,
          taskId,
        )
        return shouldWrapOutput ? wrapSubAgentResult(cursorResult, routedAgent) : cursorResult
      }

      case 'gemini': {
        const geminiResult = await executeGeminiInSandbox(sandbox, instruction, logger, selectedModel, mcpServers)
        return shouldWrapOutput ? wrapSubAgentResult(geminiResult, routedAgent) : geminiResult
      }

      case 'opencode': {
        const opencodeResult = await executeOpenCodeInSandbox(
          sandbox,
          instruction,
          logger,
          selectedModel,
          mcpServers,
          isResumed,
          sessionId,
        )
        return shouldWrapOutput ? wrapSubAgentResult(opencodeResult, routedAgent) : opencodeResult
      }

      case 'opencode_local': {
        const opencodeLocalResult = await executeOpenCodeLocalInSandbox(
          sandbox,
          instruction,
          logger,
          selectedModel,
          mcpServers,
          isResumed,
          sessionId,
        )
        return shouldWrapOutput ? wrapSubAgentResult(opencodeLocalResult, routedAgent) : opencodeLocalResult
      }

      case 'claudecode_local': {
        const claudecodeLocalResult = await executeClaudeCodeLocalInSandbox(
          sandbox,
          instruction,
          logger,
          selectedModel,
          mcpServers,
          isResumed,
          sessionId,
        )
        return shouldWrapOutput ? wrapSubAgentResult(claudecodeLocalResult, routedAgent) : claudecodeLocalResult
      }

      default:
        return {
          success: false,
          error: `Unknown agent type: ${routedAgent}`,
          cliName: routedAgent,
          changesDetected: false,
        }
    }
  } finally {
    // Restore original environment variables
    process.env.OPENAI_API_KEY = originalEnv.OPENAI_API_KEY
    process.env.GEMINI_API_KEY = originalEnv.GEMINI_API_KEY
    process.env.CURSOR_API_KEY = originalEnv.CURSOR_API_KEY
    process.env.ANTHROPIC_API_KEY = originalEnv.ANTHROPIC_API_KEY
    process.env.AI_GATEWAY_API_KEY = originalEnv.AI_GATEWAY_API_KEY
    process.env.OLLAMA_API_KEY = originalEnv.OLLAMA_API_KEY
    process.env.GH_TOKEN = originalEnv.GH_TOKEN
    process.env.GITHUB_TOKEN = originalEnv.GITHUB_TOKEN
  }
}
