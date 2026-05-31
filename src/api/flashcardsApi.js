/**
 * flashcardsApi.js — Comunicação com o servidor proxy
 *
 * Responsabilidade única: enviar o texto para a rota /api/flashcards
 * (server.js) e retornar os flashcards gerados pelo Claude.
 *
 * Não conhece React, componentes ou estado da aplicação.
 *
 * @param {string} text — Texto fornecido pelo usuário
 * @returns {Promise<Array<{topic, question, answer}>>}
 */

const PROXY_URL = '/api/flashcards'

function buildPrompt(text) {
  return `Analise o texto abaixo e crie entre 6 e 25 flashcards de estudo em português.

Retorne APENAS um JSON válido (sem markdown, sem backticks, sem texto extra), no formato:
[{"topic":"nome do tópico","question":"pergunta objetiva","answer":"resposta clara e concisa"}]

Regras:
- Perguntas devem testar compreensão real, não memorização trivial
- Agrupe por tópicos relacionados (use o mesmo "topic" para assuntos similares)
- Respostas devem ter entre 1 e 3 frases
- Use linguagem clara e direta

Texto:
${text}`
}

function sanitizeJson(raw) {
  return raw.replace(/```json/gi, '').replace(/```/g, '').trim()
}

export async function generateFlashcards(text) {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: buildPrompt(text) }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`)
  }

  const data = await response.json()
  const rawText = (data.content || []).map(b => b.text || '').join('')
  const cards = JSON.parse(sanitizeJson(rawText))

  if (!Array.isArray(cards) || cards.length === 0) {
    throw new Error('Nenhum flashcard gerado.')
  }

  return cards
}
