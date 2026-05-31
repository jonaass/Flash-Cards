// StudyScreen.jsx — Tela de estudo com painel de texto colapsável
import { useState } from "react";
import { FlashCard } from "../FlashCard/FlashCard";
import { TopBar } from "../TopBar/TopBar";
import styles from "./StudyScreen.module.css";

export function StudyScreen({
  card,
  total,
  currentIndex,
  correctCount,
  wrongCount,
  inputText,
  onAnswer,
  onRestart,
  theme,
  onToggleTheme,
}) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((currentIndex / total) * 100);

  return (
    <div className={styles.page}>
      <TopBar theme={theme} onToggleTheme={onToggleTheme} activeTab="estudar" />
      <div className={styles.body}>
        {/* ── Painel esquerdo: texto colapsável ── */}
        <div
          className={`${styles.left} ${expanded ? styles.leftExpanded : styles.leftCollapsed}`}
        >
          {/* Cabeçalho sempre visível */}
          <button
            className={styles.toggleBtn}
            onClick={() => setExpanded((e) => !e)}
          >
            <span className={styles.leftLabel}>Texto fonte</span>
            <span className={styles.toggleIcon}>
              {expanded ? "▲ Recolher" : "▼ Ver texto"}
            </span>
          </button>

          {/* Texto: só aparece quando expandido */}
          {expanded && (
            <>
              <div className={styles.sourceText}>{inputText}</div>
              <button className={styles.btnNew} onClick={onRestart}>
                ← Novo texto
              </button>
            </>
          )}

          {/* Botão novo texto quando colapsado */}
          {!expanded && (
            <button className={styles.btnNewSmall} onClick={onRestart}>
              ← Novo texto
            </button>
          )}
        </div>

        {/* ── Painel direito: card ── */}
        <div className={styles.right}>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>
              {currentIndex + 1} de {total}
            </span>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={styles.scoreLabel}>
              ✓ {correctCount} &nbsp; ✕ {wrongCount}
            </span>
          </div>
          <FlashCard key={currentIndex} card={card} onAnswer={onAnswer} />
        </div>
      </div>
    </div>
  );
}
