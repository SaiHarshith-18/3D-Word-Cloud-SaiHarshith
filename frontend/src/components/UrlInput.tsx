import { useState } from 'react'

const SAMPLE_URLS = [
  { label: 'Machine Learning', url: 'https://en.wikipedia.org/wiki/Machine_learning' },
  { label: 'Artificial Intelligence', url: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
  { label: 'Climate Change', url: 'https://en.wikipedia.org/wiki/Climate_change' },
  {label: 'BBC News - Climate Change', url: 'https://www.bbc.com/news/articles/c2l799gxjjpo'},
]

interface UrlInputProps {
  onSubmit: (url: string) => void
  loading: boolean
  error: string | null
}

// Component for URL input and submission
export function UrlInput({ onSubmit, loading, error }: UrlInputProps) {
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Machine_learning')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (url.trim()) onSubmit(url.trim())
  }

  return (
    <div className="url-input-wrapper">
      <form className="url-form" onSubmit={handleSubmit}>
        <input
          className="url-input"
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://en.wikipedia.org/wiki/..."
          required
          disabled={loading}
        />
        <button className="url-submit" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Analyse'}
        </button>
      </form>

      <div className="sample-pills">
        {SAMPLE_URLS.map(s => (
          <button
            key={s.url}
            className="pill"
            onClick={() => { setUrl(s.url); onSubmit(s.url) }}
            disabled={loading}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
