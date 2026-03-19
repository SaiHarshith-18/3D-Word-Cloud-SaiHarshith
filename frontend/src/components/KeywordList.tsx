import type { WordWeight } from '../types'
import { weightToColor, weightToFontWeight } from './WordCloud3D'

interface KeywordListProps {
  keywords: WordWeight[]
}

export function KeywordList({ keywords }: KeywordListProps) {
  const sorted = [...keywords].sort((a, b) => b.weight - a.weight)

  return (
    <>
      <h2 className="keyword-list-header">Keywords</h2>

      <div className="keyword-list-scroll">
        {sorted.map((entry, i) => (
          <div className="keyword-row" key={entry.word}>
            <span className="keyword-rank">{i + 1}</span>
            <span className="keyword-word" style={{ fontWeight: weightToFontWeight(entry.weight) }}>{entry.word}</span>
            <div className="keyword-bar-track">
              <div
                className="keyword-bar-fill"
                style={{
                  width: `${entry.weight * 100}%`,
                  background: weightToColor(entry.weight),
                }}
              />
            </div>
            <span className="keyword-pct">{(entry.weight * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      <div className="legend">
        <span className="legend-label">Low</span>
        <div className="legend-blocks">
          {[0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95].map(w => (
            <div key={w} className="legend-block" style={{ background: weightToColor(w) }} />
          ))}
        </div>
        <span className="legend-label">High</span>
      </div>
    </>
  )
}
