import JSZip from "jszip"
import { saveAs } from "file-saver"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePhoto } from '../context/PhotoContext'
import { matchSelfie, mockFaceMatch, uploadAlbum } from '../utils/mockFaceMatch'
import Stepper from '../components/Stepper'

export default function Results() {
  const navigate = useNavigate()
  const { eventPhotos, selfie, matchedPhotos, setMatchedPhotos, resetAll, albumUploaded } = usePhoto()

  const [loading, setLoading] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const handleDownloadAll = async () => {
    if (matchedPhotos.length === 0) return

    const zip = new JSZip()

    matchedPhotos.forEach((photo) => {
      zip.file(photo.file.name, photo.file)
    })

    const content = await zip.generateAsync({ type: "blob" })

    saveAs(content, "matched-photos.zip")
  }

  useEffect(() => {
    if (!selfie || eventPhotos.length === 0) {
      navigate('/')
      return
    }

    if (albumUploaded && matchedPhotos.length === 0) {

      const runMatch = async () => {
        try {
          setLoading(true)

          const matchedPaths = await matchSelfie(selfie)

          // 🔥 extract ids
          const matchedIds = matchedPaths.map(path => {
            const filename = path.split("\\").pop()
            return filename.split("_")[0]
          })

          // 🔥 match with frontend photos
          const matched = eventPhotos
            .filter(photo => matchedIds.includes(photo.id))
            .map(photo => ({
              id: photo.id,
              file: photo.file,
              url: URL.createObjectURL(photo.file)
            }))

          setMatchedPhotos(matched)

        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      runMatch()
    }

  }, [selfie, eventPhotos, albumUploaded])
  // uploadAlbum
  // http://localhost:8000/uploads/filename.jpg

  const handleDownload = (url, filename) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  const handleRestart = () => {
    resetAll()
    navigate('/')
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-4xl">
        <Stepper current={3} />

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-8 animate-fade-in">
            {/* Spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-ink-700" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin-slow" />
              {/* Pulse dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-600 mb-2" style={{ fontWeight: 600 }}>
                Scanning faces...
              </p>
              <p className="text-ink-600 text-sm">Matching your selfie against {eventPhotos.length} photos</p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500/40 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && matchedPhotos.length > 0 && (
          <>
            {/* Header */}
            <div className="text-center mb-10 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full mb-4">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                Match complete
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-800 mb-3" style={{ fontWeight: 800 }}>
                Found <span className="text-gradient">{matchedPhotos.length} Photos</span>
              </h1>
              <p className="text-yellow-100 font-body">
                Here's where you appeared in the event
              </p>
            </div>

            {/* Selfie + Stats bar */}
            <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-ink-800/60 border border-ink-700 animate-fade-up">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/40 flex-shrink-0">
                <img src={URL.createObjectURL(selfie)} alt="Your selfie" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display font-600 text-sm text-white" style={{ fontWeight: 600 }}>
                  Matched against {eventPhotos.length} event photos
                </p>
                <p className="text-yellow-100 text-xs mt-0.5">
                  {matchedPhotos.length} results · Click any photo to preview
                </p>
              </div>
            </div>

            {/* Photo grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10 animate-fade-up">
              {matchedPhotos.map(({ file, url }, i) => (
                <div
                  key={i}
                  className="relative group aspect-square rounded-2xl overflow-hidden card-glow card-glow-hover cursor-pointer bg-ink-800"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => setLightbox({ url, name: file.name })}
                >
                  <img
                    src={url}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-white text-xs truncate max-w-[70%]">{file.name}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(url, file.name) }}
                        className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-400 transition-colors"
                        title="Download"
                      >
                        <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleDownloadAll}
                className="btn-primary text-sm py-3 px-6"
              >
                Download All
              </button>

              <button
                onClick={handleRestart}
                className="px-8 py-3 rounded-xl border border-yellow-100 text-ink-600 hover:text-white hover:border-ink-500 transition-all duration-200 font-display font-600 text-sm"
              >
                Start Over
              </button>
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.name} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
            <div className="flex items-center justify-between mt-4">
              <p className="text-white/60 text-sm">{lightbox.name}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(lightbox.url, lightbox.name)}
                  className="btn-primary text-sm py-2 px-5"
                >
                  Download
                </button>
                <button onClick={() => setLightbox(null)} className="text-white/60 hover:text-white text-2xl px-3">×</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && albumUploaded && matchedPhotos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center">

          <div className="mb-6 w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.172 9.172a4 4 0 015.656 5.656M15 15l4 4m-6-4a6 6 0 1112 0 6 6 0 01-12 0z" />
            </svg>
          </div>

          <h2 className="font-display text-3xl font-700 mb-3">
            No Photos Found
          </h2>

          <p className="text-yellow-100 max-w-md mb-8">
            We couldn't find any matches for your selfie in this event album.
            Try uploading a different selfie with better lighting.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="btn-primary text-sm py-3 px-6"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
