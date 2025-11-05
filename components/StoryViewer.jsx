'use client'
import React, { useEffect, useRef, useState } from 'react'

export default function StoryViewer({ stories = [], startIndex = 0, onClose, onDelete }) {
  const [index, setIndex] = useState(startIndex)
  const [progress, setProgress] = useState(0) // 0..100
  const timerRef = useRef(null)
  const progressRef = useRef(null)
  const touchStartX = useRef(null)

  useEffect(() => {
    setIndex(startIndex)
  }, [startIndex])

  useEffect(() => {
    startProgress()
    return stopProgress
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  function startProgress() {
    stopProgress()
    setProgress(0)
    const start = Date.now()
    progressRef.current = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / 3000) * 100)
      setProgress(pct)
      if (pct >= 100) {
        goNext()
      } else {
        timerRef.current = requestAnimationFrame(progressRef.current)
      }
    }
    timerRef.current = requestAnimationFrame(progressRef.current)
  }

  function stopProgress() {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current)
      timerRef.current = null
    }
  }

  function goNext() {
    if (index + 1 < stories.length) {
      setIndex(index + 1)
    } else {
      onClose()
    }
  }

  function goPrev() {
    if (index - 1 >= 0) {
      setIndex(index - 1)
    } else {
      // go to close or stay
    }
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches?.[0]?.clientX ?? null
    stopProgress()
  }

  function handleTouchEnd(e) {
    const endX = e.changedTouches?.[0]?.clientX ?? null
    if (touchStartX.current !== null && endX !== null) {
      const dx = endX - touchStartX.current
      if (dx < -40) goNext()
      else if (dx > 40) goPrev()
    }
    startProgress()
  }

  if (!stories || stories.length === 0) return null
  const current = stories[index]

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer" onClick={(e) => e.stopPropagation()}>
        <div className="progress-row">
          {stories.map((s, i) => (
            <div className="prog-slot" key={s.id}>
              <div
                className="prog-fill"
                style={{
                  width: i < index ? '100%' : i === index ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="viewer-media"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img src={current.data} alt="story media" />
        </div>

        <div className="viewer-actions">
          <button className="btn" onClick={() => onDelete(current.id)}>Sil</button>
          <button className="btn" onClick={onClose}>Kapat</button>
        </div>
      </div>
    </div>
  )
}
