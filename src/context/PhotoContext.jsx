import { createContext, useContext, useState } from 'react'

const PhotoContext = createContext(null)

export function PhotoProvider({ children }) {
  const [eventPhotos, setEventPhotos] = useState([])
  const [selfie, setSelfie] = useState(null)
  const [matchedPhotos, setMatchedPhotos] = useState([])
  const [albumUploaded, setAlbumUploaded] = useState(false)
  // Returned by backend after /upload_album — required for /match_selfie
  const [albumId, setAlbumId] = useState(null)

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
          // id is no longer sent to the backend — kept only for React keying
          id: crypto.randomUUID(),
          file,
        }))

      return [...prev, ...fresh]
    })
  }

  const removeEventPhoto = (index) => {
    setEventPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const resetAll = () => {
    setEventPhotos([])
    setSelfie(null)
    setMatchedPhotos([])
    setAlbumUploaded(false)
    setAlbumId(null)
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
        setAlbumUploaded,
        albumId,
        setAlbumId,
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
