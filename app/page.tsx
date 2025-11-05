'use client'

import { useEffect, useState } from 'react'
import StoryList from '../components/StoryList'
import StoryViewer from '../components/StoryViewer'
import { loadStoriesFromStorage, saveStoryToStorage, cleanupExpired, Story } from '../lib/storage'

export default function Home() {
  const [stories, setStories] = useState<Story[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    cleanupExpired()
    setStories(loadStoriesFromStorage())

    const onStorage = () => setStories(loadStoriesFromStorage())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleAddImage = async (file: File | null) => {
    if (!file) return
    await saveStoryToStorage(file)
    setStories(loadStoriesFromStorage())
  }

  const handleOpenViewer = (index: number) => {
    setActiveIndex(index)
  }

  const handleCloseViewer = () => {
    setActiveIndex(null)
  }

  const handleDeleteStory = (id: string) => {
    const all = loadStoriesFromStorage().filter((s) => s.id !== id)
    localStorage.setItem('stories', JSON.stringify(all))
    setStories(all)
    handleCloseViewer()
  }

  return (
    <div className="page">
      <h1 className="title">Hikayeler</h1>
      <StoryList
        stories={stories}
        onAddImage={handleAddImage}
        onOpen={handleOpenViewer}
      />
      {activeIndex !== null && (
        <StoryViewer
          stories={stories}
          startIndex={activeIndex}
          onClose={handleCloseViewer}
          onDelete={handleDeleteStory}
        />
      )}
      <footer className="footer">
        <a href="/license" className="license-link">
          Lisans — Freelance Dev by Serkan Dalgıç
        </a>
      </footer>
    </div>
  )
}
