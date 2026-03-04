import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePhoto } from '../context/PhotoContext'
import DropZone from '../components/DropZone'
import Stepper from '../components/Stepper'
import { uploadAlbum } from '../utils/mockFaceMatch'

export default function UploadPhotos() {
  const navigate = useNavigate()
  const { eventPhotos, addEventPhotos, removeEventPhoto, setAlbumUploaded } = usePhoto()
  const [previewing, setPreviewing] = useState(null) // lightbox
  const [loading, setLoading] = useState(false)

  const handleFiles = (files) => { addEventPhotos(files); console.log({ files }) }

  const handleNavigation = async () => {
    try {
      setLoading(true)

      await uploadAlbum(eventPhotos)  // 👈 wait here
      setAlbumUploaded(true)
      navigate('/selfie')

    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setLoading(false)
    }
  }

  console.log({ eventPhotos })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-3xl">
        <Stepper current={1} />

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-800 mb-3" style={{ fontWeight: 800 }}>
            Upload <span className="text-gradient">Event Photos</span>
          </h1>
          <p className="text-amber-100 font-body text-base md:text-lg max-w-md mx-auto">
            Drop all photos from the event — we'll find the ones you're in.
          </p>
        </div>

        {/* Drop Zone */}
        <DropZone onFiles={handleFiles} multiple className="p-12 text-center mb-6">
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            {/* Upload Icon */}
            <div className="w-16 h-16 rounded-2xl bg-ink-700 border border-ink-600 flex items-center justify-center">
              <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="font-display font-600 text-lg text-white" style={{ fontWeight: 600 }}>
                Drag & drop photos here
              </p>
              <p className="text-amber-100 text-sm mt-1">or click to browse — JPG, PNG, WebP supported</p>
            </div>
          </div>
        </DropZone>

        {/* Count badge */}
        {eventPhotos.length > 0 && (
          <p className="text-center text-sm text-amber-400 mb-4 animate-fade-in">
            {eventPhotos.length} photo{eventPhotos.length !== 1 ? 's' : ''} loaded
          </p>
        )}

        {/* Photo grid preview */}
        {eventPhotos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-8 animate-fade-up">
            {eventPhotos.map((photo, i) => {
              const url = URL.createObjectURL(photo.file)
              return (
                <div key={`${photo.file.name}-${i}`} className="relative group aspect-square rounded-xl overflow-hidden card-glow bg-ink-800">
                  <img src={url} alt={photo.file.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setPreviewing(url)}
                  />
                  {/* Remove button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeEventPhoto(i) }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 text-xs"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <button
            disabled={eventPhotos.length === 0}
            onClick={handleNavigation}
            className="btn-primary text-base flex items-center gap-2 animate-pulse-glow"
          >
            Proceed to Selfie
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {previewing && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewing(null)}
        >
          <img src={previewing} alt="Preview" className="max-w-full max-h-full rounded-2xl shadow-2xl" />
          <button className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl">×</button>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center gap-6 animate-fade-in">

          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-ink-700" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
          </div>

          <div className="text-center">
            <p className="font-display text-xl font-600 mb-2">
              Processing Event Photos...
            </p>
            <p className="text-amber-100 text-sm">
              Generating face embeddings for {eventPhotos.length} photos
            </p>
          </div>

        </div>
      )}
    </div>
  )
}

// will send event photos to backend as payload
