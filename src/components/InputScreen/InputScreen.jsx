// src/components/InputScreen/InputScreen.jsx
import { useState } from "react";
import { TopBar } from "../TopBar/TopBar";
import styles from "./InputScreen.module.css";

const MIN_CHARS = 50;
const MAX_CHARS = 24000;
const WARN_CHARS = 20000;

const DIFFICULTIES = [
  { id: "facil", label: "Fácil", desc: "Definições e conceitos diretos" },
  { id: "medio", label: "Médio", desc: "Compreensão e relações entre ideias" },
  { id: "dificil", label: "Difícil", desc: "Análise crítica e síntese" },
];

export default function InputScreen({
  error,
  startGeneration,
  theme,
  onToggleTheme,
  onTabChange,
}) {
  const [text, setText] = useState("");
  const [deckName, setDeckName] = useState("");
  const [difficulty, setDifficulty] = useState("medio");

  const length = text.trim().length;
  const remaining = Math.max(0, MIN_CHARS - length);
  const isReady = length >= MIN_CHARS;
  const isNearMax = length >= WARN_CHARS;
  const isOverMax = length > MAX_CHARS;

  function charCountColor() {
    if (isOverMax) return styles.charDanger;
    if (isNearMax) return styles.charWarn;
    return styles.charNormal;
  }

  return (
    <div className={styles.page}>
      <TopBar
        theme={theme}
        onToggleTheme={onToggleTheme}
        activeTab="estudar"
        onTabChange={onTabChange}
      />
      <div className={styles.body}>
        <div className={styles.left}>
          {/* Nome */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Nome do tema</label>
            <input
              className={styles.deckInput}
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Ex: Biologia — Célula"
              maxLength={60}
            />
            <span className={styles.deckHint}>
              Salvo automaticamente na Biblioteca ao terminar o estudo
            </span>
          </div>

          {/* Nível de dificuldade */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Nível de dificuldade</label>
            <div className={styles.difficultyRow}>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  className={`${styles.diffBtn} ${difficulty === d.id ? styles.diffActive : ""} ${styles["diff_" + d.id]}`}
                  onClick={() => setDifficulty(d.id)}
                  title={d.desc}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <span className={styles.diffDesc}>
              {DIFFICULTIES.find((d) => d.id === difficulty)?.desc}
            </span>
          </div>

          {/* Textarea */}
          <div className={`${styles.field} ${styles.fieldGrow}`}>
            <div className={styles.textareaHeader}>
              <label className={styles.fieldLabel}>Texto fonte</label>
              {length > 0 && (
                <span className={`${styles.charCount} ${charCountColor()}`}>
                  {length.toLocaleString("pt-BR")} /{" "}
                  {MAX_CHARS.toLocaleString("pt-BR")}
                </span>
              )}
            </div>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cole aqui o conteúdo que deseja estudar..."
            />
          </div>

          {isNearMax && !isOverMax && (
            <p className={styles.warnMsg}>
              {" "}
              Texto próximo do limite — será truncado automaticamente se
              ultrapassar.
            </p>
          )}
          {isOverMax && (
            <p className={styles.dangerMsg}>
              {" "}
              Texto acima do limite e será cortado automaticamente ao gerar.
            </p>
          )}
          {length > 0 && !isReady && (
            <p className={styles.counter}>
              {remaining} caractere{remaining !== 1 ? "s" : ""} faltando
            </p>
          )}
          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.btnGenerate}
            disabled={!isReady}
            onClick={() =>
              isReady &&
              startGeneration(
                text.trim(),
                deckName.trim() || "Sem título",
                difficulty,
              )
            }
          >
            Gerar flashcards
          </button>
        </div>

        <div className={styles.right}>
          <div className={styles.cardPreview}>
            <span className={styles.previewLabel}>RESPOSTA</span>
            <p className={styles.previewText}>
              {isReady
                ? 'Pronto! Clique em "Gerar flashcards" para começar.'
                : "Seus flashcards aparecerão aqui após a geração."}
            </p>
            <span className={styles.previewHint}>
              Clique para ver a pergunta
            </span>
          </div>
          <div className={styles.previewButtons}>
            <button className={styles.btnKnow} disabled>
              ✕ &nbsp; Não Sei
            </button>
            <button className={styles.btnRemember} disabled>
              ✓ &nbsp; Lembrei
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
