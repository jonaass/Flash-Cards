// src/hooks/useFlashcards.js
import { useState, useCallback } from 'react'
import { generateFlashcards } from '../services/api'

const INITIAL_STATE = {
  phase: 'input', cards: [], currentIndex: 0,
  results: [], inputText: '', error: '', warning: '',
  deckName: '', deckId: null, createdAt: null,
  difficulty: 'medio',
}

export function useFlashcards({ saveToLibrary } = {}) {
  const [state, setState] = useState(INITIAL_STATE)

  const update = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }))
  }, [])

  // Gera cards a partir de texto novo
  const handleGenerate = useCallback(async (text, deckName, difficulty = 'medio') => {
    if (text.trim().length < 50) {
      update({ error: 'Digite um texto com pelo menos 50 caracteres.' })
      return
    }
    const deckId    = Date.now().toString()
    const createdAt = new Date().toISOString()
    update({ error: '', warning: '', phase: 'loading', inputText: text.trim(), deckName: deckName || 'Sem título', deckId, createdAt, results: [], difficulty })
    try {
      const { cards, truncated } = await generateFlashcards(text.trim(), difficulty)
      setState(prev => ({
        ...prev, cards, currentIndex: 0, phase: 'study',
        warning: truncated ? 'Texto longo: apenas os primeiros 24.000 caracteres foram usados.' : '',
      }))
    } catch (err) {
      console.error('[useFlashcards] Erro:', err)
      update({ phase: 'input', error: 'Não foi possível gerar os flashcards. Tente novamente.' })
    }
  }, [update])

  // Estuda baralho salvo com os MESMOS cards
  const handleStudyDeck = useCallback((deck) => {
    setState(prev => ({
      ...prev, cards: deck.cards, inputText: deck.inputText || '',
      deckName: deck.name, deckId: deck.id, createdAt: deck.createdAt,
      results: [], currentIndex: 0, phase: 'study', error: '', warning: '',
    }))
  }, [])

  // Regenera NOVAS perguntas para um baralho salvo
  const handleRegenerateDeck = useCallback(async (deck, difficulty = 'medio') => {
    if (!deck.inputText) {
      update({ error: 'Texto original não encontrado para regenerar.' })
      return
    }
    update({ error: '', warning: '', phase: 'loading', inputText: deck.inputText, deckName: deck.name, deckId: deck.id, createdAt: deck.createdAt, results: [], difficulty })
    try {
      const { cards, truncated } = await generateFlashcards(deck.inputText, difficulty)
      setState(prev => ({
        ...prev, cards, currentIndex: 0, phase: 'study',
        warning: truncated ? 'Texto longo: apenas os primeiros 24.000 caracteres foram usados.' : '',
      }))
    } catch (err) {
      console.error('[useFlashcards] Erro ao regenerar:', err)
      update({ phase: 'input', error: 'Não foi possível gerar novos flashcards. Tente novamente.' })
    }
  }, [update])

  const handleAnswer = useCallback((isCorrect) => {
    setState(prev => {
      const card       = prev.cards[prev.currentIndex]
      const newResults = [...prev.results, { topic: card.topic, question: card.question, correct: isCorrect }]
      const nextIndex  = prev.currentIndex + 1
      const finished   = nextIndex >= prev.cards.length

      if (finished && saveToLibrary) {
        const correct = newResults.filter(r => r.correct).length
        saveToLibrary({
          id: prev.deckId, name: prev.deckName, cards: prev.cards,
          inputText: prev.inputText, total: prev.cards.length,
          lastResults: newResults, correct,
          wrong: newResults.length - correct,
          pct: Math.round((correct / newResults.length) * 100),
          lastStudied: new Date().toISOString(),
          createdAt: prev.createdAt || new Date().toISOString(),
        })
      }

      return { ...prev, results: newResults, currentIndex: finished ? prev.currentIndex : nextIndex, phase: finished ? 'results' : 'study' }
    })
  }, [saveToLibrary])

  const handleRestart = useCallback(() => setState(INITIAL_STATE), [])

  const correctCount = state.results.filter(r => r.correct).length
  const wrongCount   = state.results.filter(r => !r.correct).length
  const currentCard  = state.cards[state.currentIndex] || null

  return {
    phase: state.phase, cards: state.cards, currentIndex: state.currentIndex,
    results: state.results, inputText: state.inputText, error: state.error,
    warning: state.warning, deckName: state.deckName, currentCard,
    correctCount, wrongCount, difficulty: state.difficulty,
    handleGenerate, handleAnswer, handleRestart,
    handleStudyDeck, handleRegenerateDeck,
  }
}
