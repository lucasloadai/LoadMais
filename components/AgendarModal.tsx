'use client'

import { useState } from 'react'

type Props = {
  leadName: string
  onClose: () => void
}

function getNextDays(count: number) {
  const days: { label: string; date: string; weekday: string }[] = []
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const today = new Date()

  for (let i = 1; i <= count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    // pula domingo
    if (d.getDay() === 0) continue
    days.push({
      label: `${d.getDate()} ${months[d.getMonth()]}`,
      date: d.toISOString().split('T')[0],
      weekday: weekdays[d.getDay()],
    })
    if (days.length === 6) break
  }
  return days
}

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export function AgendarModal({ leadName, onClose }: Props) {
  const days = getNextDays(10)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const firstName = leadName ? leadName.split(' ')[0] : ''

  function confirm() {
    if (!selectedDay && !selectedTime) return
    setConfirmed(true)
  }

  const selectedDayLabel = days.find((d) => d.date === selectedDay)

  if (confirmed) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[#080E18]/80 backdrop-blur-md" onClick={onClose} />
        <div className="relative z-10 w-full max-w-sm bg-[#0C1524] border border-[#1A6BFF]/30 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] text-center px-8 py-10">
          <div className="w-14 h-14 rounded-full bg-[#1A6BFF]/15 border border-[#1A6BFF]/30 flex items-center justify-center mx-auto mb-5 text-[#1A6BFF]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold mb-2">
            {firstName ? `Perfeito, ${firstName}!` : 'Agendado!'}
          </h3>
          <p className="text-white/55 text-sm leading-relaxed mb-1">
            {selectedDayLabel?.weekday}, {selectedDayLabel?.label} às {selectedTime}
          </p>
          <p className="text-white/40 text-xs mt-3 mb-7">
            Você receberá a confirmação no WhatsApp antes do horário.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#1A6BFF] hover:bg-[#1557D4] text-white font-semibold text-sm rounded-xl transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#080E18]/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#0C1524] border border-white/[0.08] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Barra topo */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#1A6BFF]" />

        <div className="px-6 pt-6 pb-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[1.5px] text-[#FF6B00] px-3 py-1 rounded-full border border-[#FF6B00]/40 bg-[#FF6B00]/[0.08] mb-3">
                <span className="font-black text-sm leading-none">+</span>
                Análise gratuita
              </div>
              <h2 className="text-xl font-extrabold leading-tight">
                {firstName
                  ? `${firstName}, escolha o melhor horário`
                  : 'Escolha o melhor horário'}
              </h2>
              <p className="text-white/45 text-xs mt-1">20 min · Diagnóstico estratégico gratuito</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/70 transition text-lg leading-none mt-1 ml-4"
            >
              ✕
            </button>
          </div>

          {/* Dias */}
          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-white/35 mb-3">Selecione o dia</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {days.map((d) => (
              <button
                key={d.date}
                onClick={() => { setSelectedDay(d.date); setSelectedTime(null) }}
                className={`flex flex-col items-center py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  selectedDay === d.date
                    ? 'bg-[#FF6B00]/15 border-[#FF6B00]/60 text-[#FF6B00] shadow-[0_0_14px_rgba(255,107,0,0.2)]'
                    : 'border-white/[0.07] bg-white/[0.025] text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="text-[0.62rem] uppercase tracking-widest mb-0.5 opacity-60">{d.weekday}</span>
                {d.label}
              </button>
            ))}
          </div>

          {/* Horários */}
          {selectedDay && (
            <>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-white/35 mb-3">Selecione o horário</p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                      selectedTime === t
                        ? 'bg-[#1A6BFF]/20 border-[#1A6BFF]/60 text-[#1A6BFF] shadow-[0_0_14px_rgba(26,107,255,0.2)]'
                        : 'border-white/[0.07] bg-white/[0.025] text-white/60 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <button
            onClick={confirm}
            disabled={!selectedDay || !selectedTime}
            className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-[0_4px_20px_rgba(255,107,0,0.35)] hover:shadow-[0_6px_28px_rgba(255,107,0,0.45)] hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            Confirmar agendamento
          </button>
        </div>
      </div>
    </div>
  )
}
