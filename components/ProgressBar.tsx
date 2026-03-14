type Props = {
  current: number
  total: number
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.min((current / total) * 100, 100)

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-white/40">
        <span>Progresso</span>
        <span>{current}/{total} campos</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-brand rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
