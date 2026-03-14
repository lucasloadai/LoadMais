import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const schema = z.object({
  nome: z.string().min(2).max(100).trim(),
  whatsapp: z.string().min(10).max(20),
  ddd: z.string().length(2),
  instagram: z.string().max(50).optional(),
  instagram_followers: z.number().int().min(0).optional(),
  instagram_verified: z.boolean().optional(),
  lead_score: z.number().int().min(0).optional(),
  lead_tier: z.enum(['curioso', 'potencial', 'premium']).optional(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const { error } = await supabase.from('leads').insert([data])

    if (error) {
      return NextResponse.json({ error: 'Erro ao salvar lead.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }
}
