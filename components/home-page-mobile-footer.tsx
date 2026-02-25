'use client'

import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/icons/github-icon'
import { formatAbbreviatedNumber } from '@/lib/utils/format-number'
import { BRAND_GITHUB_URL } from '@/lib/brand'

interface HomePageMobileFooterProps {
  initialStars?: number
}

export function HomePageMobileFooter({ initialStars = 1200 }: HomePageMobileFooterProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
      <div className="flex items-center justify-center gap-3 p-4">
        {/* GitHub Stars Button */}
        {BRAND_GITHUB_URL && (
          <Button asChild variant="ghost" size="default">
            <a
              href={BRAND_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <GitHubIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{formatAbbreviatedNumber(initialStars)}</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
