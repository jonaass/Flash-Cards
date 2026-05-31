// src/App.jsx
import { useState, useEffect } from 'react'
import { useFlashcards }  from './hooks/useFlashcards'
import InputScreen         from './components/InputScreen/InputScreen'
import { LoadingScreen }   from './components/LoadingScreen/LoadingScreen'
import { StudyScreen }     from './components/StudyScreen/StudyScreen'
import { Results }         from './components/Results/Results'
import { Library }         from './components/Library/Library'

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const [showLibrary, setShowLibrary] = useState(false)
  const [library, setLibrary] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flashcard_library') || '[]') }
    catch { return [] }
  })

  function saveToLibrary(deck) {
    setLibrary(prev => {
      const next = [deck, ...prev.filter(d => d.id !== deck.id)]
      localStorage.setItem('flashcard_library', JSON.stringify(next))
      return next
    })
  }

  function deleteDeck(id) {
    setLibrary(prev => {
      const next = prev.filter(d => d.id !== id)
      localStorage.setItem('flashcard_library', JSON.stringify(next))
      return next
    })
  }

  const {
    phase, cards, currentIndex, results,
    inputText, error, warning, currentCard,
    correctCount, wrongCount, deckName, difficulty,
    handleGenerate, handleAnswer, handleRestart,
    handleStudyDeck, handleRegenerateDeck,
  } = useFlashcards({ saveToLibrary })

  const commonProps = { theme, onToggleTheme: toggleTheme }
  const onTabChange = (tab) => setShowLibrary(tab === 'biblioteca')

  if (showLibrary) return (
    <Library
      decks={library}
      onStudy={(deck) => { setShowLibrary(false); handleStudyDeck(deck) }}
      onRegenerate={(deck, diff) => { setShowLibrary(false); handleRegenerateDeck(deck, diff) }}
      onDelete={deleteDeck}
      onTabChange={onTabChange}
      {...commonProps}
    />
  )

  return (
    <>
      {phase === 'input' && (
        <InputScreen error={error} startGeneration={handleGenerate} onTabChange={onTabChange} {...commonProps} />
      )}
      {phase === 'loading' && (
        <LoadingScreen onTabChange={onTabChange} {...commonProps} />
      )}
      {phase === 'study' && currentCard && (
        <StudyScreen
          card={currentCard} total={cards.length} currentIndex={currentIndex}
          correctCount={correctCount} wrongCount={wrongCount}
          inputText={inputText} deckName={deckName} warning={warning}
          onAnswer={handleAnswer} onRestart={handleRestart}
          onTabChange={onTabChange} {...commonProps}
        />
      )}
      {phase === 'results' && (
        <Results results={results} deckName={deckName} onRestart={handleRestart} onTabChange={onTabChange} {...commonProps} />
      )}
    </>
  )
}
