// src/services/api.js

const PROXY_URL = '/api/flashcards'
const MAX_CHARS = 24000

const DIFFICULTY_PROMPTS = {
  facil: `
- Crie perguntas DIRETAS e OBJETIVAS testando definições e conceitos básicos
- As respostas devem ser simples, com 1 frase clara
- Evite perguntas que exijam raciocínio complexo`,

  medio: `
- Crie perguntas de COMPREENSÃO testando a relação entre conceitos
- As respostas devem explicar o "porquê" ou "como", com 1 a 2 frases
- Misture perguntas diretas com perguntas de aplicação`,

  dificil: `
- Crie perguntas DESAFIADORAS de análise, síntese e raciocínio crítico
- As respostas devem conectar múltiplos conceitos, com 2 a 3 frases
- Evite perguntas com respostas óbvias — o usuário deve pensar antes de responder`,
}

function buildPrompt(text, difficulty = 'medio') {
  const difficultyInstruction = DIFFICULTY_PROMPTS[difficulty] || DIFFICULTY_PROMPTS.medio

  return `Analise o texto abaixo e crie entre 6 e 12 flashcards de estudo em português.

Retorne APENAS um JSON válido (sem markdown, sem backticks, sem texto extra), no formato:
[{"topic":"nome do tópico","question":"pergunta objetiva","answer":"resposta clara e concisa"}]

Regras gerais:
- Agrupe por tópicos relacionados (use o mesmo "topic" para assuntos similares)
- Use linguagem clara e direta

Nível de dificuldade: ${difficulty.toUpperCase()}${difficultyInstruction}

Texto:
${text}`
}

function sanitizeJson(raw) {
  return raw.replace(/```json/gi, '').replace(/```/g, '').trim()
}

function truncateText(text) {
  if (text.length <= MAX_CHARS) return { text, truncated: false }
  return { text: text.slice(0, MAX_CHARS), truncated: true }
}

export async function generateFlashcards(text, difficulty = 'medio') {
  const { text: safeText, truncated } = truncateText(text)

  if (truncated) {
    console.warn(`[api.js] Texto truncado para ${MAX_CHARS} caracteres.`)
  }

  const response = await fetch(PROXY_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'llama-3.3-70b-versatile',
      max_tokens: 1500,
      messages:   [{ role: 'user', content: buildPrompt(safeText, difficulty) }],
    }),
  })

  if (!response.ok) throw new Error(`Erro na API: ${response.status}`)

  const data    = await response.json()
  const rawText = (data.content || []).map(b => b.text || '').join('')
  const cards   = JSON.parse(sanitizeJson(rawText))

  if (!Array.isArray(cards) || cards.length === 0) {
    throw new Error('Nenhum flashcard gerado.')
  }

  return { cards, truncated }
}
