'use client'

import { useSearchParams } from 'next/navigation'
import { FormLead } from './FormLead'
import { InstagramModal } from './InstagramModal'
import { useLeadForm } from '@/hooks/useLeadForm'
import { trackEvent } from '@/utils/tracking'
import { useEffect } from 'react'

export function LandingPage() {
  const searchParams = useSearchParams()
  const utmSource = searchParams.get('utm_source') ?? undefined
  const utmMedium = searchParams.get('utm_medium') ?? undefined
  const utmCampaign = searchParams.get('utm_campaign') ?? undefined

  const {
    form,
    dddMessage,
    showInstagramModal,
    setShowInstagramModal,
    formData,
    handlePhoneChange,
    onSubmit,
    extractCleanPhone,
  } = useLeadForm()

  useEffect(() => {
    trackEvent('LeadStart')
  }, [])

  return (
    <main className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gradient mb-2">LOAD MAIS</h1>
          <p className="text-white/60 text-sm uppercase tracking-widest">
            Marketing que é engenharia
          </p>
        </div>

        {/* Headline */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            Sua empresa pode{' '}
            <span className="text-gradient">crescer mais rápido</span>{' '}
            do que você imagina.
          </h2>
          <p className="text-white/70 text-lg">
            Deixa a gente analisar seu perfil e montar uma estratégia real para
            o seu negócio.
          </p>
        </div>

        {/* Form */}
        <FormLead
          form={form}
          dddMessage={dddMessage}
          handlePhoneChange={handlePhoneChange}
          onSubmit={onSubmit}
        />
      </div>

      {/* Instagram Modal */}
      {showInstagramModal && formData && (
        <InstagramModal
          formData={formData}
          utmSource={utmSource}
          utmMedium={utmMedium}
          utmCampaign={utmCampaign}
          onClose={() => setShowInstagramModal(false)}
          extractCleanPhone={extractCleanPhone}
        />
      )}
    </main>
  )
}
