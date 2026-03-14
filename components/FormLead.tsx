'use client'

import { UseFormReturn } from 'react-hook-form'
import { DDDMessage } from './DDDMessage'
import { ProgressBar } from './ProgressBar'
import type { LeadFormData } from '@/hooks/useLeadForm'

type Props = {
  form: UseFormReturn<LeadFormData>
  dddMessage: string
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function FormLead({ form, dddMessage, handlePhoneChange, onSubmit }: Props) {
  const {
    register,
    formState: { errors, isValid, dirtyFields },
    watch,
  } = form

  const nome = watch('nome')
  const whatsapp = watch('whatsapp')
  const progress = [nome?.length >= 2, whatsapp?.replace(/\D/g, '').length >= 10].filter(Boolean).length

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 space-y-5"
    >
      <ProgressBar current={progress} total={2} />

      {/* Nome */}
      <div className="space-y-1.5">
        <label className="text-white/80 text-sm font-medium block">
          Seu nome completo
        </label>
        <input
          {...register('nome')}
          type="text"
          placeholder="João Silva"
          autoComplete="name"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"
        />
        {errors.nome && (
          <p className="text-red-400 text-xs">{errors.nome.message}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <label className="text-white/80 text-sm font-medium block">
          Seu WhatsApp
        </label>
        <input
          type="tel"
          value={watch('whatsapp')}
          onChange={handlePhoneChange}
          placeholder="(11) 99999-9999"
          autoComplete="tel"
          inputMode="numeric"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition"
        />
        {errors.whatsapp && (
          <p className="text-red-400 text-xs">{errors.whatsapp.message}</p>
        )}
      </div>

      {/* DDD Message */}
      {dddMessage && <DDDMessage message={dddMessage} />}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-gradient-brand text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 glow-orange"
      >
        Quero crescer minha empresa →
      </button>

      <p className="text-center text-white/40 text-xs">
        Sem spam. Seus dados são protegidos.
      </p>
    </form>
  )
}
