'use client'

import { useState, useCallback } from 'react'
import { checkInstagramProfile } from '@/lib/instagramCheck'
import { calculateLeadScore } from '@/lib/leadScoring'
import { trackEvent } from '@/utils/tracking'
import type { InstagramProfile } from '@/lib/instagramCheck'
import type { LeadScore } from '@/lib/leadScoring'

type InstagramState = {
  loading: boolean
  error: string | null
  profile: InstagramProfile | null
  score: LeadScore | null
}

export function useInstagram() {
  const [state, setState] = useState<InstagramState>({
    loading: false,
    error: null,
    profile: null,
    score: null,
  })

  const verify = useCallback(async (username: string) => {
    setState({ loading: true, error: null, profile: null, score: null })

    const result = await checkInstagramProfile(username)

    if (!result.success) {
      setState({ loading: false, error: result.error, profile: null, score: null })
      return null
    }

    const score = calculateLeadScore(result.profile)
    setState({ loading: false, error: null, profile: result.profile, score })
    trackEvent('InstagramValidated', {
      followers: result.profile.followers_count,
      tier: score.tier,
      score: score.score,
    })

    return { profile: result.profile, score }
  }, [])

  return { ...state, verify }
}
