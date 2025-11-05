'use client'
import React, { useState, useEffect } from 'react'
import { Story } from '../app/page' // Import the Story interface
import StoryViewerItem from './StoryViewerItem'

// Define the props interface
interface StoryViewerProps {
  stories: Story[]
  startIndex: number
  onClose: () => void
  onDelete: (id: string) => void
}

// Apply the interface to your component
export default function StoryViewer({
  stories,
  startIndex,
  onClose,
  onDelete,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((i) => Math.min(i + 1, stories.length - 1))
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [stories.length, onClose])

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, stories.length - 1))
  }

  // --- THIS WAS THE MISSING PART ---
  // You must return the JSX from the component
  return (
    <div className="story-viewer">
      <button className="story-viewer-close" onClick={onClose}>
        &times;
      </button>
      <div className="story-viewer-content">
        {stories.length > 0 && (
          <StoryViewerItem
            story={stories[currentIndex]}
            onDelete={() => onDelete(stories[currentIndex].id)}
          />
        )}
      </div>
      {currentIndex > 0 && (
        <button className="story-viewer-prev" onClick={handlePrev}>
          &#8249;
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button className="story-viewer-next" onClick={handleNext}>
          &#8250;
        </button>
      )}
    </div>
  )
}