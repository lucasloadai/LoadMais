import type { InstagramProfile } from './instagramCheck'

export type LeadTier = 'curioso' | 'potencial' | 'premium'

export type LeadScore = {
  score: number
  tier: LeadTier
  breakdown: Record<string, number>
}

const PROFESSIONAL_KEYWORDS = [
  'ceo', 'founder', 'marketing', 'vendas', 'empresário', 'empresaria',
  'negócios', 'negocios', 'consultor', 'consultora', 'gestor', 'gestora',
  'empreendedor', 'empreendedora', 'diretor', 'diretora', 'estrategista',
  'agência', 'agencia', 'digital', 'oficial', 'comercial',
]

const BUSINESS_CATEGORIES = [
  'Advertising/Marketing', 'Consulting Agency', 'Digital creator',
  'Business person', 'Entrepreneur', 'Brand', 'Product/service',
  'Local business',
]

export function calculateLeadScore(profile: InstagramProfile): LeadScore {
  const breakdown: Record<string, number> = {}
  let score = 0

  // Followers
  if (profile.followers_count > 10000) {
    breakdown['followers_10k+'] = 25
    score += 25
  } else if (profile.followers_count > 1000) {
    breakdown['followers_1k+'] = 10
    score += 10
  }

  // Bio profissional
  const bioLower = (profile.biography ?? '').toLowerCase()
  const hasProfessionalBio = PROFESSIONAL_KEYWORDS.some((kw) =>
    bioLower.includes(kw)
  )
  if (hasProfessionalBio) {
    breakdown['bio_profissional'] = 20
    score += 20
  }

  // Tem site
  if (profile.external_url) {
    breakdown['tem_site'] = 15
    score += 15
  }

  // Posts > 50
  if (profile.media_count > 50) {
    breakdown['posts_50+'] = 15
    score += 15
  }

  // Categoria business
  const isBusiness = BUSINESS_CATEGORIES.some(
    (cat) => profile.category?.toLowerCase().includes(cat.toLowerCase())
  )
  if (isBusiness) {
    breakdown['categoria_business'] = 25
    score += 25
  }

  const tier: LeadTier =
    score >= 61 ? 'premium' : score >= 31 ? 'potencial' : 'curioso'

  return { score, tier, breakdown }
}
