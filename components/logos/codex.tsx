import type { SVGProps } from 'react'

const Codex = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#0B1324" />
    <path d="M7 7h10v2H9v2h6v2H9v2h8v2H7V7Z" fill="#E2E8F0" />
    <path d="M16 7h1.5v10H16z" fill="#22D3EE" />
  </svg>
)

export default Codex
