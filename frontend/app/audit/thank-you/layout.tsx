import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "You're In — Next Steps | PTG",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
}

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
