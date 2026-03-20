import { useState } from 'react'

const SAMPLE_URLS = [
  { label: 'Wiki - Machine Learning', url: 'https://en.wikipedia.org/wiki/Machine_learning' },
  { label: 'Wiki - Artificial Intelligence', url: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
  { label: 'IBM Think - Machine Learning', url: 'https://www.ibm.com/think/topics/machine-learning' },
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
          placeholder="Enter the URL here ..."
          required
          disabled={loading}
        />
        <button className="url-submit" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Analyse'}
        </button>
      </form>
      <p className="input-hint">Try one of these sample URLs:</p>
      <div className="sample-pills">
        { 
        SAMPLE_URLS.map(s => (
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
