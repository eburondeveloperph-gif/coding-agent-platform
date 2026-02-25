'use client'

import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/icons/github-icon'
import { formatAbbreviatedNumber } from '@/lib/utils/format-number'
import { BRAND_GITHUB_URL } from '@/lib/brand'

interface GitHubStarsButtonProps {
  initialStars?: number
}

export function GitHubStarsButton({ initialStars = 1200 }: GitHubStarsButtonProps) {
  if (!BRAND_GITHUB_URL) {
    return null
  }

  return (
    <Button asChild variant="ghost" size="sm" className="h-8 px-2 sm:px-3 gap-1.5">
      <a href={BRAND_GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center">
        <GitHubIcon className="h-3.5 w-3.5" />
        <span className="text-sm">{formatAbbreviatedNumber(initialStars)}</span>
      </a>
    </Button>
  )
}
