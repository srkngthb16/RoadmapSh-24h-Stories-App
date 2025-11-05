'use client'

import React, { useEffect, useState } from 'react'
import StoryList from '../components/StoryList'
import StoryViewer from '../components/StoryViewer'
import {
  loadStoriesFromStorage,
  saveStoryToStorage,
  cleanupExpired,
} from '../lib/storage'

// Define the Story interface
export interface Story {
  id: string
  image: string
  createdAt: number
}

export default function Home() {
  // This line is correct and explicitly types the state
  const [stories, setStories] = useState<Story[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    cleanupExpired()
    const storedStories: Story[] = loadStoriesFromStorage()
    setStories(storedStories)

    const onStorage = () => setStories(loadStoriesFromStorage())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleAddImage = async (file: File | null): Promise<void> => {
    if (!file) return
    await saveStoryToStorage(file)
    setStories(loadStoriesFromStorage())
  }

  const handleOpenViewer = (index: number): void => {
    setActiveIndex(index)
  }

  const handleCloseViewer = (): void => {
    setActiveIndex(null)
  }

  const handleDeleteStory = (id: string): void => {
    const all: Story[] = (loadStoriesFromStorage() as Story[]).filter(
      (s: Story) => s.id !== id,
    )
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