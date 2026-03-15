export type InstagramProfile = {
  username: string
  full_name: string
  followers_count: number
  following_count: number
  profile_pic_url: string
  is_verified: boolean
  biography: string
  external_url: string | null
  media_count: number
  category: string | null
  exists: boolean
}

export type InstagramCheckResult =
  | { success: true; profile: InstagramProfile }
  | { success: false; error: string }

export async function checkInstagramProfile(
  username: string
): Promise<InstagramCheckResult> {
  const clean = username.replace('@', '').trim().toLowerCase()

  try {
    const res = await fetch(`/api/instagram?username=${clean}`)
    const data = await res.json()

    if (!res.ok || data.error) {
      return { success: false, error: data.error ?? 'Perfil não encontrado.' }
    }

    return { success: true, profile: data.profile }
  } catch {
    return { success: false, error: 'Erro ao verificar perfil. Tente novamente.' }
  }
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
  return String(n)
}
