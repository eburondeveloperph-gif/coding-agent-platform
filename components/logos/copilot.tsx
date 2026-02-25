import type { SVGProps } from 'react'

const Copilot = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#14532D" />
    <rect x="6.2" y="8.4" width="11.6" height="7.8" rx="3.9" stroke="#ECFDF5" strokeWidth="1.5" />
    <circle cx="9.6" cy="12.3" r="1.1" fill="#A7F3D0" />
    <circle cx="14.4" cy="12.3" r="1.1" fill="#A7F3D0" />
    <path d="M9 17.6h6" stroke="#ECFDF5" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default Copilot
