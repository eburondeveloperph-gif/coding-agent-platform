import type { SVGProps } from 'react'

const Gemini = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...props}>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#0F766E" />
    <path d="m7.2 8.7 3 3.1-3 3.1" stroke="#CCFBF1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15.2h4.8" stroke="#99F6E4" strokeWidth="1.7" strokeLinecap="round" />
    <rect x="12" y="8.8" width="5" height="1.6" rx=".8" fill="#CCFBF1" />
  </svg>
)

export default Gemini
