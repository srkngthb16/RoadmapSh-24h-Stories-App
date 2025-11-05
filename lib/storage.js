// lib/storage.ts
export interface Story {
  id: string
  image: string
  createdAt: number
}

// remove expired stories
export function cleanupExpired() {
  const stories = loadStoriesFromStorage()
  const now = Date.now()
  const filtered = stories.filter((s) => now - s.createdAt < 24 * 60 * 60 * 1000)
  localStorage.setItem('stories', JSON.stringify(filtered))
}

export function loadStoriesFromStorage(): Story[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('stories')
  return data ? (JSON.parse(data) as Story[]) : []
}

export async function saveStoryToStorage(file: File): Promise<string> {
  const reader = new FileReader()

  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const stories = loadStoriesFromStorage()
  const newStory: Story = {
    id: crypto.randomUUID(),
    image: base64,
    createdAt: Date.now(),
  }

  stories.push(newStory)
  localStorage.setItem('stories', JSON.stringify(stories))
  return base64
}
