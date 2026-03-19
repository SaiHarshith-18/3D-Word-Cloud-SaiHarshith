import { useAnalyze } from './hooks/useAnalyze'
import { UrlInput } from './components/UrlInput'
import { WordCloud3D } from './components/WordCloud3D'

function App() {
  const { keywords, loading, error, analyze } = useAnalyze()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">3D Word Cloud</h1>
        <p className="app-subtitle">Enter a news article or Wikipedia URL to visualise its keywords</p>
      </header>

      <section className="input-section">
        <UrlInput onSubmit={analyze} loading={loading} error={error} />
      </section>

      <main className="cloud-section">
        {keywords.length > 0 ? (
          <>
            <WordCloud3D keywords={keywords} />
            <div className="legend">
              <span className="legend-label">Low</span>
              <div className="legend-gradient" />
              <span className="legend-label">High</span>
            </div>
          </>
        ) : (
          !loading && (
            <p className="empty-state">Enter a URL above to generate a word cloud</p>
          )
        )}
      </main>
    </div>
  )
}

export default App
