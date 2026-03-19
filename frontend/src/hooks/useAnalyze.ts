import { useState } from 'react'
import axios from 'axios'
import type { WordWeight } from '../types'

interface UseAnalyzeResult {
  keywords: WordWeight[]
  loading: boolean
  error: string | null
  analyze: (url: string) => Promise<void>
}

export function useAnalyze(): UseAnalyzeResult {
  const [keywords, setKeywords] = useState<WordWeight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze(url: string) {
    setLoading(true)
    setError(null)
    setKeywords([])
    
    // Basic URL validation
    try {
      const response = await axios.post<{ keywords: WordWeight[] }>('/analyze', { url })
      setKeywords(response.data.keywords)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail ?? err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return { keywords, loading, error, analyze }
}
