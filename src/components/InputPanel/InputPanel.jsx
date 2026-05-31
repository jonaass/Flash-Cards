// src/components/InputPanel/InputPanel.jsx
//
// Tela inicial: área de texto + botão de geração.
// Layout dividido: textarea à esquerda, placeholder à direita.
//
// Props:
//   onGenerate(text: string) — chamado ao clicar em "Gerar"
//   error: string            — mensagem de erro (vazia = sem erro)

import { useState } from "react";
import "./InputPanel.css";

const MIN_CHARS = 50;

export function InputPanel({ onGenerate, error }) {
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const remaining = MIN_CHARS - trimmed.length;
  const canGenerate = trimmed.length >= MIN_CHARS;

  function handleClick() {
    if (canGenerate) onGenerate(text);
  }

  return (
    <div className="input-layout">
      {/* ── Painel esquerdo: entrada de texto ── */}
      <div className="panel panel--left">
        <span className="label">Seu texto</span>

        <textarea
          className="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole ou digite aqui o conteúdo que deseja estudar..."
        />

        {/* Contador de caracteres faltando */}
        {trimmed.length > 0 && !canGenerate && (
          <p className="char-counter">
            {remaining} caractere{remaining !== 1 ? "s" : ""} faltando
          </p>
        )}

        {/* Mensagem de erro vinda do hook */}
        {error && <p className="error-msg">{error}</p>}

        <button
          className="btn-primary"
          disabled={!canGenerate}
          onClick={handleClick}
        >
          Gerar flashcards →
        </button>
      </div>

      {/* ── Painel direito: estado vazio ── */}
      <div className="panel panel--right">
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <p className="empty-title">Os flashcards aparecerão aqui</p>
          <p className="empty-sub">Cole seu texto e clique em gerar</p>
        </div>
      </div>
    </div>
  );
}
