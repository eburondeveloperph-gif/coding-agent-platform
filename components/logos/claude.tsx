import type { SVGProps } from 'react'

const Claude = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#1D4ED8" />
    <circle cx="12" cy="12" r="4.5" stroke="#FFFFFF" strokeWidth="1.6" />
    <circle cx="18.2" cy="9.4" r="1.4" fill="#F8FAFC" />
    <path
      d="M6.8 8.9a5.8 5.8 0 0 1 5.9-3.4M8.2 16.8A5.8 5.8 0 0 1 5.6 11M16.9 15.6a5.8 5.8 0 0 1-5.7 2.9"
      stroke="#93C5FD"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)

export default Claude
