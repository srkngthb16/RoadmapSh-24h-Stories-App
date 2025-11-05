'use client'
import React from 'react'
import { Story } from '../app/page' // Import the Story interface
import StoryItem from './StoryItem'

// Define the props interface
interface StoryListProps {
  stories: Story[]
  onAddImage: (file: File | null) => void
  onOpen: (index: number) => void
}

// Apply the interface to your component
export default function StoryList({
  stories,
  onAddImage,
  onOpen,
}: StoryListProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAddImage(e.target.files ? e.target.files[0] : null)
  }

  return (
    <div className="story-list">
      <div className="story-add">
        <label htmlFor="file-upload" className="story-add-button">
          +
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      {stories.map((story, index) => (
        <StoryItem
          key={story.id}
          story={story}
          onOpen={() => onOpen(index)}
        />
      ))}
    </div>
  )
}