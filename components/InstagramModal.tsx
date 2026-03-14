'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInstagram } from '@/hooks/useInstagram'
import { trackEvent } from '@/utils/tracking'
import type { LeadFormData } from '@/hooks/useLeadForm'

type Props = {
  formData: LeadFormData
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  onClose: () => void
  extractCleanPhone: (phone: string) => string
}

export function InstagramModal({
  formData,
  utmSource,
  utmMedium,
  utmCampaign,
  onClose,
  extractCleanPhone,
}: Props) {
  const router = useRouter()
  const [instagram, setInstagram] = useState('')
  const { loading, error, verify } = useInstagram()

  async function handleAnalyze() {
    if (!instagram.trim()) return

    const result = await verify(instagram)
    if (!result) return

    const cleanPhone = extractCleanPhone(formData.whatsapp)
    const ddd = cleanPhone.slice(0, 2)

    // Save lead
    try {
      await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          whatsapp: cleanPhone,
          ddd,
          instagram: result.profile.username,
          instagram_followers: result.profile.followers_count,
          instagram_verified: result.profile.is_verified,
          lead_score: result.score.score,
          lead_tier: result.score.tier,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }),
      })
    } catch {
      // Non-blocking: continue even if save fails
    }

    trackEvent('LeadCaptured', {
      tier: result.score.tier,
      score: result.score.score,
      ddd,
    })

    trackEvent('RedirectAgent')
    router.push('/institutional')
  }

  function handleSkip() {
    const cleanPhone = extractCleanPhone(formData.whatsapp)
    const ddd = cleanPhone.slice(0, 2)

    fetch('/api/capture-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: formData.nome,
        whatsapp: cleanPhone,
        ddd,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      }),
    }).catch(() => {})

    trackEvent('LeadCaptured', { ddd, tier: 'curioso' })
    trackEvent('RedirectAgent')
    router.push('/institutional')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-brand-secondary border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition"
          aria-label="Fechar"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-brand rounded-2xl flex items-center justify-center text-2xl mb-5">
          📊
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Análise de presença digital
        </h3>
        <p className="text-white/60 text-sm mb-6">
          Antes da conversa, queremos analisar rapidamente sua presença digital.
          Coloque seu @ do Instagram para a gente personalizar sua estratégia.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-white/80 text-sm font-medium block">
              Seu @ do Instagram
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">
                @
              </span>
              <input
                type="text"
                value={instagram}
                onChange={(e) =>
                  setInstagram(e.target.value.replace('@', '').trim())
                }
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="seuperfil"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !instagram.trim()}
            className="w-full bg-gradient-brand text-white font-bold py-3.5 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analisando perfil...
              </span>
            ) : (
              'Analisar perfil →'
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-full text-white/40 text-sm py-2 hover:text-white/60 transition"
          >
            Pular essa etapa
          </button>
        </div>
      </div>
    </div>
  )
}
