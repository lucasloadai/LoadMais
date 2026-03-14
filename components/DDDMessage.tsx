'use client'

import { useEffect, useState } from 'react'

type Props = {
  message: string
}

export function DDDMessage({ message }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [message])

  return (
    <div
      className={`transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-start gap-3 bg-brand-primary/10 border border-brand-primary/30 rounded-xl px-4 py-3">
        <span className="text-brand-primary text-lg mt-0.5">📍</span>
        <p className="text-white/90 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
