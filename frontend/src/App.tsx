import { useAnalyze } from './hooks/useAnalyze'
import { UrlInput } from './components/UrlInput'
import { WordCloud3D } from './components/WordCloud3D'
import { KeywordList } from './components/KeywordList'

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

      {loading && keywords.length === 0 && (
        <div className="canvas-container loading-overlay">
          <span className="spinner" />
          <p className="loading-text">Analysing...</p>
        </div>
      )}

      {keywords.length > 0 ? (
        <main className="main-content">
          <div className="cloud-panel">
            <WordCloud3D keywords={keywords} />
          </div>
          <aside className="keyword-sidebar">
            <KeywordList keywords={keywords} />
          </aside>
        </main>
      ) : (
        !loading && (
          <p className="empty-state">Enter a URL above to generate a word cloud</p>
        )
      )}
    </div>
  )
}

export default App
