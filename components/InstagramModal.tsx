'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInstagram } from '@/hooks/useInstagram'
import { formatCount } from '@/lib/instagramCheck'
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
  const [saving, setSaving] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const { loading, error, profile, score, verify, reset } = useInstagram()

  async function handleVerify() {
    if (!instagram.trim()) return
    setAvatarError(false)
    await verify(instagram)
  }

  async function handleConfirm() {
    if (!profile || !score) return
    setSaving(true)

    const cleanPhone = extractCleanPhone(formData.whatsapp)
    const ddd = cleanPhone.slice(0, 2)

    try {
      await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          whatsapp: cleanPhone,
          ddd,
          instagram: profile.username,
          instagram_followers: profile.followers_count,
          instagram_verified: profile.is_verified,
          lead_score: score.score,
          lead_tier: score.tier,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }),
      })
    } catch {
      // Non-blocking
    }

    trackEvent('LeadCaptured', { tier: score.tier, score: score.score, ddd })
    trackEvent('RedirectAgent')
    router.push(`/institutional?nome=${encodeURIComponent(formData.nome)}`)
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
    router.push(`/institutional?nome=${encodeURIComponent(formData.nome)}`)
  }

  const firstName = formData.nome.split(' ')[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-brand-secondary border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition"
          aria-label="Fechar"
        >
          ✕
        </button>

        {!profile ? (
          /* ── Passo 1: input do @ ── */
          <>
            <div className="w-14 h-14 bg-gradient-brand rounded-2xl flex items-center justify-center text-2xl mb-5">
              📊
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Quase lá, {firstName}!
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Coloque seu @ do Instagram para analisarmos sua presença digital e
              montarmos uma estratégia personalizada.
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
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="seuperfil"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"
                  />
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || !instagram.trim()}
                className="w-full bg-gradient-brand text-white font-bold py-3.5 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Verificando perfil...
                  </span>
                ) : (
                  'Verificar perfil →'
                )}
              </button>

              <button
                onClick={handleSkip}
                className="w-full text-white/40 text-sm py-2 hover:text-white/60 transition"
              >
                Pular essa etapa
              </button>
            </div>
          </>
        ) : (
          /* ── Passo 2: card do perfil ── */
          <>
            <h3 className="text-lg font-bold text-white mb-5">
              Perfil encontrado — é você?
            </h3>

            {/* Avatar + nome + username */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative flex-shrink-0">
                {!avatarError && profile.profile_pic_url ? (
                  <img
                    src={profile.profile_pic_url}
                    alt={profile.username}
                    onError={() => setAvatarError(true)}
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand-primary/40"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center text-2xl font-black text-white">
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
                {profile.is_verified && (
                  <span className="absolute -bottom-1 -right-1 text-base">✅</span>
                )}
              </div>

              <div className="min-w-0">
                {profile.full_name && (
                  <p className="text-white font-semibold truncate">{profile.full_name}</p>
                )}
                <p className="text-white/50 text-sm">@{profile.username}</p>
                {profile.category && (
                  <p className="text-brand-primary text-xs mt-0.5">{profile.category}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Seguidores', value: profile.followers_count },
                { label: 'Seguindo', value: profile.following_count },
                { label: 'Posts', value: profile.media_count },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/10 rounded-xl py-3 text-center"
                >
                  <p className="text-white font-bold text-lg leading-none">
                    {value > 0 ? formatCount(value) : '—'}
                  </p>
                  <p className="text-white/50 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Bio */}
            {profile.biography && (
              <p className="text-white/60 text-sm leading-relaxed mb-5 line-clamp-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                {profile.biography}
              </p>
            )}

            {/* Ações */}
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="w-full bg-gradient-brand text-white font-bold py-3.5 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  'Sim, é esse! Continuar →'
                )}
              </button>

              <button
                onClick={() => { reset(); setInstagram(''); setAvatarError(false) }}
                className="w-full text-white/40 text-sm py-2 hover:text-white/60 transition"
              >
                Não é esse, quero tentar outro @
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
