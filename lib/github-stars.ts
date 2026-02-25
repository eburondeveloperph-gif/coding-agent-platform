import { BRAND_FALLBACK_STARS, BRAND_GITHUB_REPO } from '@/lib/brand'

const CACHE_DURATION = 5 * 60 // 5 minutes in seconds

export async function getGitHubStars(): Promise<number> {
  if (!BRAND_GITHUB_REPO) {
    return BRAND_FALLBACK_STARS
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${BRAND_GITHUB_REPO}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'eburon-ai',
      },
      next: { revalidate: CACHE_DURATION },
    })

    if (!response.ok) {
      throw new Error('GitHub API request failed')
    }

    const data = await response.json()
    return data.stargazers_count || BRAND_FALLBACK_STARS
  } catch (error) {
    console.error('Error fetching GitHub stars:', error)
    return BRAND_FALLBACK_STARS
  }
}
