import { createContext, useContext, useState } from 'react'

// Context for sharing photo state across all pages
const PhotoContext = createContext(null)

export function PhotoProvider({ children }) {
  // Step 1: event photos (array of File objects)
  const [eventPhotos, setEventPhotos] = useState([])
  // Step 2: single selfie (File object)
  const [selfie, setSelfie] = useState(null)
  // Step 3: matched results (array of { file, url })
  const [matchedPhotos, setMatchedPhotos] = useState([])
  const [albumUploaded, setAlbumUploaded] = useState(false)

  /** Add new event photos, avoiding duplicates by name+size */
  // const addEventPhotos = (files) => {
  //   setEventPhotos((prev) => {
  //     const existing = new Set(prev.map((f) => `${f.name}-${f.size}`))
  //     const fresh = files.filter((f) => !existing.has(`${f.name}-${f.size}`))
  //     return [...prev, ...fresh]
  //   })
  // }

  const addEventPhotos = (files) => {
    setEventPhotos((prev) => {
      const existing = new Set(
        prev.map((p) => `${p.file.name}-${p.file.size}-${p.file.lastModified}`)
      )

      const fresh = files
        .filter(
          (file) =>
            !existing.has(`${file.name}-${file.size}-${file.lastModified}`)
        )
        .map((file) => ({
          id: crypto.randomUUID(),
          file
        }))

      return [...prev, ...fresh]
    })
  }

  /** Remove a single event photo by index */
  const removeEventPhoto = (index) => {
    setEventPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  /** Clear everything — used when restarting the flow */
  const resetAll = () => {
    setEventPhotos([])
    setSelfie(null)
    setMatchedPhotos([])
  }

  return (
    <PhotoContext.Provider
      value={{
        eventPhotos,
        addEventPhotos,
        removeEventPhoto,
        selfie,
        setSelfie,
        matchedPhotos,
        setMatchedPhotos,
        resetAll,
        albumUploaded,
        setAlbumUploaded
      }}
    >
      {children}
    </PhotoContext.Provider>
  )
}

export function usePhoto() {
  const ctx = useContext(PhotoContext)
  if (!ctx) throw new Error('usePhoto must be used within PhotoProvider')
  return ctx
}
