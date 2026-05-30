// src/services/api.js
//
// Limite do plano gratuito do Groq: 12.000 tokens/min
// ~1 token = 3-4 caracteres, então limitamos o texto a
// 24.000 caracteres para deixar margem para o prompt e resposta.

const PROXY_URL = '/api/flashcards'
const MAX_CHARS = 24000  // limite seguro para o plano gratuito

function buildPrompt(text) {
  return `Analise o texto abaixo e crie entre 6 e 12 flashcards de estudo em português.

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

/**
 * Trunca o texto se for maior que o limite seguro,
 * evitando o erro 413 (Payload Too Large) do Groq.
 */
function truncateText(text) {
  if (text.length <= MAX_CHARS) return { text, truncated: false }
  return {
    text:      text.slice(0, MAX_CHARS),
    truncated: true,
  }
}

export async function generateFlashcards(text) {
  const { text: safeText, truncated } = truncateText(text)

  if (truncated) {
    console.warn(
      `[api.js] Texto truncado de ${text.length} para ${MAX_CHARS} caracteres ` +
      `para respeitar o limite de tokens do Groq.`
    )
  }

  const response = await fetch(PROXY_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'llama-3.3-70b-versatile',
      max_tokens: 1500,
      messages:   [{ role: 'user', content: buildPrompt(safeText) }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`)
  }

  const data    = await response.json()
  const rawText = (data.content || []).map(b => b.text || '').join('')
  const cards   = JSON.parse(sanitizeJson(rawText))

  if (!Array.isArray(cards) || cards.length === 0) {
    throw new Error('Nenhum flashcard gerado.')
  }

  return { cards, truncated }
}
