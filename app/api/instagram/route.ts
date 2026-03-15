import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('username')

  if (!raw) {
    return NextResponse.json({ error: 'Username obrigatório.' }, { status: 400 })
  }

  const username = raw.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30)

  if (!username) {
    return NextResponse.json({ error: 'Username inválido.' }, { status: 400 })
  }

  const commonHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: '*/*',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
    Referer: `https://www.instagram.com/${username}/`,
    'x-ig-app-id': '936619743392459',
  }

  // Tentativa 1: web_profile_info — retorna JSON estruturado com following, posts e foto
  try {
    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      { headers: commonHeaders, next: { revalidate: 0 } }
    )

    if (res.ok) {
      const json = await res.json()
      const user = json?.data?.user

      if (user) {
        return NextResponse.json({
          profile: {
            username: user.username ?? username,
            full_name: user.full_name ?? '',
            followers_count: user.edge_followed_by?.count ?? 0,
            following_count: user.edge_follow?.count ?? 0,
            profile_pic_url: user.profile_pic_url_hd ?? user.profile_pic_url ?? '',
            is_verified: user.is_verified ?? false,
            biography: user.biography ?? '',
            external_url: user.external_url ?? null,
            media_count: user.edge_owner_to_timeline_media?.count ?? 0,
            category: user.category_name ?? null,
            exists: true,
          },
        })
      }
    }
  } catch {
    // continua para próxima tentativa
  }

  // Tentativa 2: scraping da página pública
  try {
    const res = await fetch(
      `https://www.instagram.com/${username}/?__a=1&__d=dis`,
      { headers: commonHeaders, next: { revalidate: 0 } }
    )

    if (res.status === 404) {
      return NextResponse.json(
        { error: 'Perfil não encontrado. Verifique o @ e tente novamente.' },
        { status: 404 }
      )
    }

    if (res.ok) {
      const text = await res.text()
      const match = text.match(/"edge_followed_by":\{"count":(\d+)/)
      if (match) {
        return NextResponse.json({
          profile: {
            username,
            full_name: '',
            followers_count: parseInt(match[1], 10),
            following_count: 0,
            profile_pic_url: '',
            is_verified: false,
            biography: '',
            external_url: null,
            media_count: 0,
            category: null,
            exists: true,
          },
        })
      }
    }
  } catch {
    // continua para fallback
  }

  return NextResponse.json({ profile: buildFallbackProfile(username) })
}

function buildFallbackProfile(username: string) {
  return {
    username,
    full_name: '',
    followers_count: 0,
    following_count: 0,
    profile_pic_url: '',
    is_verified: false,
    biography: '',
    external_url: null,
    media_count: 0,
    category: null,
    exists: true,
  }
}
