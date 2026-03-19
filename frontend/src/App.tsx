import { useAnalyze } from './hooks/useAnalyze'
import { UrlInput } from './components/UrlInput'

function App() {
  const { keywords, loading, error, analyze } = useAnalyze()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">3D Word Cloud</h1>
        <p className="app-subtitle">Enter a news article or Wikipedia URL to visualise its keywords</p>
      </header>

      <main className="app-main">
        <UrlInput onSubmit={analyze} loading={loading} error={error} />
        {}
        {keywords.length > 0 && (
          <p className="keyword-count">{keywords.length} keywords extracted</p>
        )}
      </main>
    </div>
  )
}

export default App
