import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return new NextResponse(null, { status: 400 })
  }

  try {
    const decoded = decodeURIComponent(url)

    // Only allow Instagram CDN domains
    const allowed = [
      'cdninstagram.com',
      'scontent',
      'instagram.com',
      'fbcdn.net',
    ]
    if (!allowed.some((d) => decoded.includes(d))) {
      return new NextResponse(null, { status: 403 })
    }

    const res = await fetch(decoded, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.instagram.com/',
      },
    })

    if (!res.ok) {
      return new NextResponse(null, { status: 404 })
    }

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse(null, { status: 500 })
  }
}
