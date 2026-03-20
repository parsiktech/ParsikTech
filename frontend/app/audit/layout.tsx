import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Systems Audit – $750 Flat | PTG',
}

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
