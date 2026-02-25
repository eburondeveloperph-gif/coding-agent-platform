import type { SVGProps } from 'react'

const OpenCode = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#111827" />
    <path
      d="M7 9.3c1.2-1.2 2.6-1.8 4.1-1.8 1.4 0 2.8.6 3.9 1.7M6.3 12c1.4-1.4 3.1-2.1 4.8-2.1 1.7 0 3.4.7 4.7 2M5.6 14.8c1.6-1.6 3.6-2.4 5.5-2.4 2 0 3.9.8 5.5 2.3"
      stroke="#E5E7EB"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16.8" r="1.5" fill="#A5B4FC" />
  </svg>
)

export default OpenCode
