# LOAD MAIS — Landing Page de Captura de Leads

## Stack
- Next.js 14 + TypeScript
- TailwindCSS
- React Hook Form + Zod
- Supabase (PostgreSQL + Edge Functions)
- Deploy: Netlify

## Setup

### 1. Clone e instale
```bash
git clone <repo>
cd load-mais
npm install
```

### 2. Variáveis de ambiente
```bash
cp .env.example .env.local
```
Preencha:
- `NEXT_PUBLIC_SUPABASE_URL` — URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (para API routes)
- `NEXT_PUBLIC_META_PIXEL_ID` — ID do Meta Pixel (opcional)
- `NEXT_PUBLIC_GTM_ID` — ID do GTM (opcional)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — Número do WhatsApp do agente (ex: `5511999999999`)

### 3. Banco de dados
Execute o SQL em `supabase/migrations/001_create_leads.sql` no Supabase SQL Editor.

### 4. Rode localmente
```bash
npm run dev
```

## Deploy no Netlify

1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente no painel do Netlify
3. O `netlify.toml` já está configurado com `@netlify/plugin-nextjs`
4. Deploy automático a cada push na branch main

## Estrutura
```
/app
  /api
    /instagram       → Verificação do perfil Instagram
    /capture-lead    → Salvar lead no Supabase
  /institutional     → Página institucional com CTA WhatsApp
  layout.tsx
  page.tsx
/components
  LandingPage.tsx
  FormLead.tsx
  DDDMessage.tsx
  InstagramModal.tsx
  ProgressBar.tsx
  InstitutionalPage.tsx
  PixelScript.tsx
  GTMScript.tsx
/hooks
  useLeadForm.ts
  useInstagram.ts
/lib
  supabase.ts
  instagramCheck.ts
  leadScoring.ts
/utils
  dddMessages.ts
  phoneMask.ts
  tracking.ts
/supabase
  /migrations
    001_create_leads.sql
  /functions
    /captureLead
      index.ts
```

## Lead Scoring
| Critério | Pontos |
|---|---|
| Followers > 10.000 | +25 |
| Bio profissional | +20 |
| Tem site | +15 |
| Posts > 50 | +15 |
| Categoria business | +25 |

| Score | Tier |
|---|---|
| 0–30 | curioso |
| 31–60 | potencial |
| 61–100 | premium |
