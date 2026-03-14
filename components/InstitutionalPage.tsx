'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/utils/tracking'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'
const WA_MESSAGE = encodeURIComponent(
  'Olá! Vim pelo site da LOAD MAIS e quero saber mais sobre como estruturar o crescimento da minha empresa.'
)
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`

const results = [
  { metric: '3x', label: 'mais leads qualificados' },
  { metric: '68%', label: 'redução no custo por lead' },
  { metric: '40+', label: 'empresas aceleradas' },
  { metric: '5★', label: 'avaliação média' },
]

const pillars = [
  {
    icon: '🤖',
    title: 'IA & Automação',
    desc: 'Sistemas inteligentes que trabalham 24h por você, qualificando leads e nutrindo relacionamentos.',
  },
  {
    icon: '📊',
    title: 'Inteligência de Dados',
    desc: 'Decisões baseadas em dados reais, não em achismo. Analytics que geram insight acionável.',
  },
  {
    icon: '🎯',
    title: 'Estratégia Humana',
    desc: 'Time especialista que combina tecnologia com visão estratégica para escalar seu negócio.',
  },
]

export function InstitutionalPage() {
  useEffect(() => {
    trackEvent('LeadCaptured')
  }, [])

  function handleCTA() {
    trackEvent('RedirectAgent')
    window.open(WA_URL, '_blank')
  }

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 flex flex-col items-center text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            LOAD MAIS — Marketing que é Engenharia
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Marketing não precisa ser{' '}
            <span className="text-gradient">tentativa</span>.
            <br />
            Pode ser{' '}
            <span className="text-gradient">engenharia</span>.
          </h1>

          <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto">
            Estamos estruturando empresas com IA, automação e inteligência
            humana. Chega de impulsionar post e torcer. Hora de construir
            máquinas de crescimento.
          </p>

          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-3 bg-gradient-brand text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:opacity-90 hover:scale-105 active:scale-95 glow-orange"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.524 5.845L.057 23.998l6.306-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.36-.214-3.733.979 1-3.642-.234-.373A9.818 9.818 0 0112 2.182c5.428 0 9.818 4.39 9.818 9.818 0 5.429-4.39 9.818-9.818 9.818z" />
            </svg>
            Falar com especialista agora
          </button>

          <p className="text-white/40 text-sm mt-4">
            Resposta em até 5 minutos no horário comercial.
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 py-16 bg-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((r) => (
            <div key={r.metric} className="text-center">
              <div className="text-4xl font-black text-gradient mb-1">{r.metric}</div>
              <div className="text-white/60 text-sm">{r.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Como a gente trabalha
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-primary/40 transition-colors"
              >
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para parar de tentar e começar a{' '}
            <span className="text-gradient">crescer de verdade</span>?
          </h2>
          <p className="text-white/60 mb-8">
            Nosso time vai analisar seu negócio e montar uma estratégia
            personalizada. Sem enrolação.
          </p>
          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-3 bg-gradient-brand text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:opacity-90 hover:scale-105 active:scale-95 glow-orange"
          >
            Falar com especialista agora →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8 text-center">
        <p className="text-white/30 text-sm">
          © {new Date().getFullYear()} LOAD MAIS. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  )
}
