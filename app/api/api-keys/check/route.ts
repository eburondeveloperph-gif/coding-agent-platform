import { NextRequest, NextResponse } from 'next/server'
import { getUserApiKey } from '@/lib/api-keys/user-keys'
import { getDisplayAgentName, getRequiredProvidersForAgent } from '@/lib/openmax/agents'

type Provider = 'openai' | 'gemini' | 'cursor' | 'anthropic' | 'aigateway' | 'ollama'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const agent = searchParams.get('agent')
    const model = searchParams.get('model')

    if (!agent) {
      return NextResponse.json({ error: 'Agent parameter is required' }, { status: 400 })
    }

    // Special handling for Copilot - check if user has GitHub token
    if (agent.toLowerCase() === 'copilot') {
      const { getUserGitHubToken } = await import('@/lib/github/user-token')
      const githubToken = await getUserGitHubToken()
      const hasKey = !!githubToken

      return NextResponse.json({
        success: true,
        hasKey,
        provider: 'github',
        agentName: getDisplayAgentName(agent),
      })
    }

    const requiredProviders = getRequiredProvidersForAgent(agent, model)
    const provider = requiredProviders[0] as Provider | undefined

    if (!provider) {
      return NextResponse.json({
        success: true,
        hasKey: true,
        provider: null,
        agentName: getDisplayAgentName(agent),
      })
    }

    // Check if API key is available (either user's or system)
    const apiKey = await getUserApiKey(provider)
    const hasKey = !!apiKey

    return NextResponse.json({
      success: true,
      hasKey,
      provider,
      agentName: getDisplayAgentName(agent),
    })
  } catch (error) {
    console.error('Error checking API key:', error)
    return NextResponse.json({ error: 'Failed to check API key' }, { status: 500 })
  }
}
