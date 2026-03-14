import { Suspense } from 'react'
import { LandingPage } from '@/components/LandingPage'

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark" />}>
      <LandingPage />
    </Suspense>
  )
}
