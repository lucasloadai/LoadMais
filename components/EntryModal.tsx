'use client'

import { FormLead } from './FormLead'
import type { UseFormReturn } from 'react-hook-form'
import type { LeadFormData } from '@/hooks/useLeadForm'

type Props = {
  form: UseFormReturn<LeadFormData>
  dddMessage: string
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function EntryModal({ form, dddMessage, handlePhoneChange, onSubmit, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Overlay bloqueante — sem onClick */}
      <div className="absolute inset-0 bg-[#080E18]/85 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-md">
        {/* Glow de fundo */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#FF6B00]/[0.07] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative bg-[#0C1524] border border-[#FF6B00]/25 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,107,0,0.1)] overflow-hidden">
          {/* Barra laranja topo */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#1A6BFF]" />

          <div className="px-7 pt-7 pb-6">
            {/* Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[1.5px] text-[#FF6B00] px-3 py-1 rounded-full border border-[#FF6B00]/40 bg-[#FF6B00]/[0.08]">
                <span className="font-black text-sm leading-none">+</span>
                Acesso exclusivo
              </div>
              <div className="w-6" />
            </div>

            <h2 className="text-2xl font-extrabold leading-tight tracking-tight mb-2">
              Antes de continuar,{' '}
              <span className="text-[#FF6B00]">essa página não é para curiosos.</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              É uma experiência única e imersiva — mas só para quem está pronto. Deixa seus dados e confira.
            </p>

            <FormLead
              form={form}
              dddMessage={dddMessage}
              handlePhoneChange={handlePhoneChange}
              onSubmit={onSubmit}
            />
          </div>

          <div className="px-7 pb-5 text-center">
            <p className="text-white/20 text-xs">🔒 Dados protegidos. Sem spam.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
