import type { SVGProps } from 'react'

const Cursor = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#7C2D12" />
    <path
      d="M4.8 12c1.9-2.9 4.5-4.4 7.2-4.4S17.3 9.1 19.2 12c-1.9 2.9-4.5 4.4-7.2 4.4S6.7 14.9 4.8 12Z"
      stroke="#FFEDD5"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.2" fill="#FDBA74" />
  </svg>
)

export default Cursor
