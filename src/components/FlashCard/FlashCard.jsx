// src/components/FlashCard/FlashCard.jsx
import { useState } from "react";
import styles from "./FlashCard.module.css";

export function FlashCard({ card, onAnswer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Card — clique para revelar */}
      <div
        className={styles.flipScene}
        onClick={() => !flipped && setFlipped(true)}
      >
        <div className={`${styles.flipInner} ${flipped ? styles.flipped : ""}`}>
          {/* Frente: pergunta */}
          <div className={`${styles.face} ${styles.faceFront}`}>
            <span className={styles.faceLabel}>PERGUNTA</span>
            <p className={styles.faceText}>{card.question}</p>
            <span className={styles.hint}>Clique para ver a resposta</span>
          </div>

          {/* Verso: resposta */}
          <div className={`${styles.face} ${styles.faceBack}`}>
            <span className={styles.faceLabel}>RESPOSTA</span>
            <p className={styles.faceText}>{card.answer}</p>
            <span className={styles.hint} onClick={() => setFlipped(false)}>
              Clique para ver a pergunta
            </span>
          </div>
        </div>
      </div>

      {/* Tópico */}
      <span className={styles.topic}>{card.topic}</span>

      {/* Botões aparecem após revelar */}
      <div
        className={`${styles.actions} ${flipped ? styles.actionsVisible : ""}`}
      >
        <button className={styles.btnKnow} onClick={() => onAnswer(false)}>
          ✕ &nbsp; Não Sei
        </button>
        <button className={styles.btnRemember} onClick={() => onAnswer(true)}>
          ✓ &nbsp; Lembrei
        </button>
      </div>

      {!flipped && (
        <p className={styles.flipHint}>
          Clique no card para revelar a resposta
        </p>
      )}
    </div>
  );
}
