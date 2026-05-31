/**
 * ProgressBar.jsx — Barra de progresso reutilizável
 *
 * Componente puro: recebe um valor entre 0 e 100 e renderiza a barra.
 * Pode ser usado em qualquer parte da aplicação.
 *
 * Props:
 *   value {number} — percentual preenchido (0-100)
 */
import React from "react";
import styles from "./ProgressBar.module.css";

export default function ProgressBar({ value = 0 }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
}
