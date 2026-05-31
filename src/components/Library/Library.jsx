// src/components/Library/Library.jsx
import { useState } from 'react'
import { TopBar } from '../TopBar/TopBar'
import styles from './Library.module.css'

const DIFFICULTIES = [
  { id: 'facil', label: 'Fácil', cls: 'facil' },
  { id: 'medio', label: 'Médio', cls: 'medio' },
  { id: 'dificil', label: 'Difícil', cls: 'dificil' },
]

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function barColor(pct) {
  if (pct >= 70) return '#3A6B10'
  if (pct >= 40) return '#854F0B'
  return '#A32D2D'
}

function groupByTopic(results = []) {
  const map = {}
  results.forEach(r => {
    if (!map[r.topic]) map[r.topic] = { correct: 0, wrong: 0 }
    map[r.topic][r.correct ? 'correct' : 'wrong']++
  })
  return Object.entries(map)
    .map(([topic, s]) => {
      const total = s.correct + s.wrong
      return { topic, ...s, total, pct: Math.round((s.correct / total) * 100) }
    })
    .sort((a, b) => a.pct - b.pct)
}

// Card individual com selector de dificuldade para regenerar
function DeckCard({ deck, onStudy, onRegenerate, onDelete }) {
  const [showRegen, setShowRegen] = useState(false)
  const [difficulty, setDifficulty] = useState('medio')
  const topics = groupByTopic(deck.lastResults)

  return (
    <div className={styles.card}>

      <div className={styles.cardTop}>
        <h3 className={styles.cardName}>{deck.name}</h3>
        <span className={styles.cardCount}>{deck.total} cards</span>
      </div>

      <p className={styles.cardDate}>
        Última sessão: {formatDate(deck.lastStudied || deck.createdAt)}
      </p>

      {/* Desempenho */}
      {deck.lastResults && deck.lastResults.length > 0 && (
        <div className={styles.performance}>
          <div className={styles.perfHeader}>
            <span className={styles.perfLabel}>Último desempenho</span>
            <span className={styles.perfPct} style={{ color: barColor(deck.pct) }}>{deck.pct}%</span>
          </div>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${deck.pct}%`, background: barColor(deck.pct) }} />
          </div>
          <div className={styles.perfStats}>
            <span className={styles.statCorrect}>✓ {deck.correct} lembrei</span>
            <span className={styles.statWrong}>✕ {deck.wrong} não sei</span>
          </div>
          {topics.length > 0 && (
            <div className={styles.topics}>
              <span className={styles.topicsLabel}>Por tópico</span>
              {topics.map(t => (
                <div key={t.topic} className={styles.topicRow}>
                  <span className={styles.topicName}>{t.topic}</span>
                  <div className={styles.topicTrack}>
                    <div className={styles.topicFill} style={{ width: `${t.pct}%`, background: barColor(t.pct) }} />
                  </div>
                  <span className={styles.topicPct}>{t.pct}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Painel de regenerar */}
      {showRegen && (
        <div className={styles.regenPanel}>
          <p className={styles.regenTitle}>Escolha o nível de dificuldade</p>
          <div className={styles.regenDiffs}>
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                className={`${styles.regenDiffBtn} ${styles['diff_' + d.cls]} ${difficulty === d.id ? styles.diffActive : ''}`}
                onClick={() => setDifficulty(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className={styles.regenActions}>
            <button className={styles.btnConfirmRegen} onClick={() => onRegenerate(deck, difficulty)}>
              ✦ Gerar novas perguntas
            </button>
            <button className={styles.btnCancelRegen} onClick={() => setShowRegen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Botões principais */}
      {!showRegen && (
        <div className={styles.cardActions}>
          <button className={styles.btnStudy} onClick={() => onStudy(deck)}>
            Estudar novamente
          </button>
          {deck.inputText && (
            <button className={styles.btnRegen} onClick={() => setShowRegen(true)} title="Gerar novas perguntas">
              ↻
            </button>
          )}
          <button className={styles.btnDelete} onClick={() => onDelete(deck.id)} title="Excluir">
            🗑
          </button>
        </div>
      )}

    </div>
  )
}

export function Library({ decks, onStudy, onRegenerate, onDelete, theme, onToggleTheme, onTabChange }) {
  return (
    <div className={styles.page}>
      <TopBar theme={theme} onToggleTheme={onToggleTheme} activeTab="biblioteca" onTabChange={onTabChange} />
      <div className={styles.body}>
        <div className={styles.header}>
          <h2 className={styles.title}>Biblioteca</h2>
          <p className={styles.sub}>Seus baralhos salvos — estude com as mesmas perguntas ou gere novas</p>
        </div>

        {decks.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📚</span>
            <p className={styles.emptyTitle}>Nenhum baralho salvo ainda</p>
            <p className={styles.emptySub}>Complete uma sessão de estudo para salvar automaticamente</p>
            <button className={styles.btnStart} onClick={() => onTabChange('estudar')}>
              Criar primeiro baralho →
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {decks.map(deck => (
              <DeckCard
                key={deck.id} deck={deck}
                onStudy={onStudy} onRegenerate={onRegenerate} onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
