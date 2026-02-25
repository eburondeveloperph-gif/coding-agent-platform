import { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/brand'

interface LayoutProps {
  params: Promise<{
    owner: string
    repo: string
  }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { owner, repo } = await params

  return {
    title: `${owner}/${repo} - ${BRAND_NAME}`,
    description: `Create AI-powered tasks for ${owner}/${repo}`,
  }
}

export default function Layout({ children }: LayoutProps) {
  return children
}
