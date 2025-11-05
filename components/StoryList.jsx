'use client'
import React, { useRef } from 'react'

export default function StoryList({ stories = [], onAddImage, onOpen }) {
  const fileRef = useRef()

  const triggerFile = () => fileRef.current.click()

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    onAddImage(f)
    e.target.value = ''
  }

  return (
    <div className="story-list">
      <div className="list-scroll">
        <button className="story-add" onClick={triggerFile} aria-label="Hikaye ekle">
          <div className="plus">+</div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        {stories.map((s, i) => (
          <button key={s.id} className="story-thumb" onClick={() => onOpen(i)} title={new Date(s.ts).toLocaleString()}>
            <img src={s.data} alt="story" />
          </button>
        ))}
      </div>
    </div>
  )
}
