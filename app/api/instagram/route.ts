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

  const apiKey = process.env.RAPIDAPI_KEY
  const apiHost = process.env.RAPIDAPI_INSTAGRAM_HOST

  if (apiKey && apiHost) {
    try {
      const body = new URLSearchParams({ username_or_url: `https://www.instagram.com/${username}/` })

      const res = await fetch(
        `https://${apiHost}/ig_get_fb_profile_v3.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-rapidapi-host': apiHost,
            'x-rapidapi-key': apiKey,
          },
          body: body.toString(),
          next: { revalidate: 0 },
        }
      )

      if (res.ok) {
        const json = await res.json()
        const user = json?.data ?? json?.user ?? json

        if (user && (user.username || user.user_name)) {
          const rawPic =
            user.profile_pic_url_hd ??
            user.profile_pic_url ??
            user.profile_image ??
            user.profile_pic ??
            user.avatar ??
            user.pic ??
            ''

          const profile_pic_url = rawPic
            ? `/api/proxy-image?url=${encodeURIComponent(rawPic)}`
            : ''

          return NextResponse.json({
            profile: {
              username: user.username ?? user.user_name ?? username,
              full_name: user.full_name ?? user.fullname ?? '',
              followers_count: user.followers ?? user.follower_count ?? user.edge_followed_by?.count ?? 0,
              following_count: user.following ?? user.following_count ?? user.edge_follow?.count ?? 0,
              profile_pic_url,
              is_verified: user.is_verified ?? user.verified ?? false,
              biography: user.biography ?? user.bio ?? '',
              external_url: user.external_url ?? null,
              media_count: user.media_count ?? user.posts ?? user.edge_owner_to_timeline_media?.count ?? 0,
              category: user.category ?? user.category_name ?? null,
              exists: true,
            },
          })
        }
      }
    } catch {
      // continua para fallback
    }
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
