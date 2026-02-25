import { Sandbox } from '@vercel/sandbox'
import { runCommandInSandbox } from '../commands'
import { TaskLogger } from '@/lib/utils/task-logger'

interface OllamaModel {
  name: string
}

interface OllamaTagsResponse {
  models?: OllamaModel[]
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '')
}

function hasModel(models: string[], model: string): boolean {
  if (models.includes(model)) {
    return true
  }

  if (!model.includes(':') && models.includes(`${model}:latest`)) {
    return true
  }

  return false
}

async function queryModelTags(sandbox: Sandbox, baseUrl: string): Promise<string[] | null> {
  const tagsUrl = `${normalizeBaseUrl(baseUrl)}/api/tags`
  const result = await runCommandInSandbox(sandbox, 'curl', ['-fsS', tagsUrl])

  if (!result.success || !result.output) {
    return null
  }

  try {
    const parsed = JSON.parse(result.output) as OllamaTagsResponse
    const models = parsed.models || []
    return models.map((model) => model.name).filter(Boolean)
  } catch {
    return null
  }
}

async function pullModel(sandbox: Sandbox, baseUrl: string, model: string): Promise<boolean> {
  const pullUrl = `${normalizeBaseUrl(baseUrl)}/api/pull`
  const payload = JSON.stringify({ model, stream: false })
  const result = await runCommandInSandbox(sandbox, 'curl', [
    '-fsS',
    '-X',
    'POST',
    pullUrl,
    '-H',
    'Content-Type: application/json',
    '-d',
    payload,
  ])

  return result.success
}

export async function ensureOllamaModelAvailability(
  sandbox: Sandbox,
  logger: TaskLogger,
  baseUrl: string,
  model: string,
): Promise<boolean> {
  await logger.info('Checking local model runtime')

  const models = await queryModelTags(sandbox, baseUrl)
  if (!models) {
    await logger.error('Local model runtime unavailable')
    return false
  }

  if (hasModel(models, model)) {
    await logger.info('Local model available')
    return true
  }

  await logger.info('Local model not found, attempting pull')

  const pulled = await pullModel(sandbox, baseUrl, model)
  if (!pulled) {
    await logger.error('Failed to pull local model')
    return false
  }

  await logger.info('Verifying pulled local model')

  const refreshedModels = await queryModelTags(sandbox, baseUrl)
  if (!refreshedModels || !hasModel(refreshedModels, model)) {
    await logger.error('Pulled local model is unavailable')
    return false
  }

  await logger.info('Local model ready')
  return true
}
