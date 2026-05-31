// Results.jsx — Tela de resultados no novo estilo
import { TopBar } from "../TopBar/TopBar";
import styles from "./Results.module.css";

function calcStats(results) {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const wrong = total - correct;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const topicMap = {};
  results.forEach((r) => {
    if (!topicMap[r.topic]) topicMap[r.topic] = { correct: 0, wrong: 0 };
    topicMap[r.topic][r.correct ? "correct" : "wrong"]++;
  });
  const topics = Object.entries(topicMap)
    .map(([name, s]) => {
      const t = s.correct + s.wrong;
      return { name, ...s, total: t, pctOk: Math.round((s.correct / t) * 100) };
    })
    .sort((a, b) => b.pctOk - a.pctOk);
  return { total, correct, wrong, pct, topics };
}

function barColor(pct) {
  if (pct >= 70) return "var(--success-text)";
  if (pct >= 40) return "var(--warn-text)";
  return "var(--danger-text)";
}

export function Results({ results, onRestart, theme, onToggleTheme }) {
  const { correct, wrong, pct, topics } = calcStats(results);
  const hardest = [...topics].sort((a, b) => a.pctOk - b.pctOk)[0];

  return (
    <div className={styles.page}>
      <TopBar theme={theme} onToggleTheme={onToggleTheme} activeTab="estudar" />
      <div className={styles.center}>
        <div className={styles.card}>
          <h2 className={styles.title}>Sessão concluída</h2>
          <p className={styles.sub}>
            Veja seu desempenho e onde focar na revisão
          </p>

          <div className={styles.metrics}>
            <div className={`${styles.metric} ${styles.metricSuccess}`}>
              <span className={styles.metricVal}>{correct}</span>
              <span className={styles.metricLbl}>Lembrei</span>
            </div>
            <div className={`${styles.metric} ${styles.metricDanger}`}>
              <span className={styles.metricVal}>{wrong}</span>
              <span className={styles.metricLbl}>Não Sei</span>
            </div>
            <div className={`${styles.metric} ${styles.metricInfo}`}>
              <span className={styles.metricVal}>{pct}%</span>
              <span className={styles.metricLbl}>Aproveit.</span>
            </div>
          </div>

          {hardest && hardest.wrong > 0 && (
            <div className={styles.hardest}>
              <span className={styles.hardestLabel}>Principal dificuldade</span>
              <p className={styles.hardestTopic}>{hardest.name}</p>
              <p className={styles.hardestDesc}>
                {hardest.wrong} erro{hardest.wrong !== 1 ? "s" : ""} neste
                tópico — revise com atenção
              </p>
            </div>
          )}

          <div className={styles.breakdown}>
            <span className={styles.breakdownLabel}>Desempenho por tópico</span>
            {topics.map((t) => (
              <div key={t.name} className={styles.row}>
                <div className={styles.rowHeader}>
                  <span>{t.name}</span>
                  <span className={styles.rowStat}>
                    {t.correct}/{t.total} — {t.pctOk}%
                  </span>
                </div>
                <div className={styles.track}>
                  <div
                    className={styles.fill}
                    style={{
                      width: `${t.pctOk}%`,
                      background: barColor(t.pctOk),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className={styles.btnRestart} onClick={onRestart}>
            Novo baralho
          </button>
        </div>
      </div>
    </div>
  );
}
