import { useNavigate } from 'react-router-dom'
import { usePhoto } from '../context/PhotoContext'
import DropZone from '../components/DropZone'
import Stepper from '../components/Stepper'
import { useRef, useState } from 'react'

export default function UploadSelfie() {
  const navigate = useNavigate()
  const { selfie, setSelfie, eventPhotos } = usePhoto()

  const [cameraOn, setCameraOn] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Guard: if no event photos, redirect back
  if (eventPhotos.length === 0) {
    navigate('/')
    return null
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setCameraOn(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 200)

    } catch (err) {
      console.error("Camera error:", err)
    }
  }

  const captureSelfie = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")

    // Flip image horizontally (remove mirror effect in saved photo)
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" })
      setSelfie(file)
    }, "image/jpeg")

    stopCamera()
  }

  const stopCamera = () => {
    const video = videoRef.current

    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      video.srcObject = null
    }

    setCameraOn(false)
  }

  const selfieUrl = selfie ? URL.createObjectURL(selfie) : null

  const handleFile = (files) => setSelfie(files[0])
  console.log({ selfie })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-lg">
        <Stepper current={2} />

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-800 mb-3" style={{ fontWeight: 800 }}>
            Upload Your <span className="text-gradient">Selfie</span>
          </h1>
          <p className="text-amber-100 font-body text-base md:text-lg">
            We'll use your face to find your photos in the album.
          </p>
        </div>

        {/* Selfie preview OR drop zone */}
        {selfieUrl ? (
          <div className="flex flex-col items-center gap-6 animate-fade-up">
            {/* Preview */}
            <div className="relative">
              <div className="w-52 h-52 rounded-full overflow-hidden card-glow border-2 border-amber-500/40">
                <img src={selfieUrl} alt="Your selfie" className="w-full h-full object-cover" />
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full"
                style={{ boxShadow: '0 0 0 4px rgba(245,158,11,0.15), 0 0 60px rgba(245,158,11,0.15)' }} />
              {/* Change button */}
              <button
                onClick={() => setSelfie(null)}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-ink-700 border border-ink-600 text-amber-400 flex items-center justify-center hover:bg-ink-600 transition-colors text-lg"
                title="Change selfie"
              >
                ✏
              </button>
            </div>

            <p className="text-sm text-green-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Selfie ready!
            </p>
          </div>
        ) : (
          // <DropZone onFiles={handleFile} className="p-14 text-center">
          //   <div className="flex flex-col items-center gap-4 pointer-events-none">
          //     {/* Face icon */}
          //     <div className="w-20 h-20 rounded-full bg-ink-700 border border-ink-600 flex items-center justify-center">
          //       <svg className="w-9 h-9 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          //           d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          //       </svg>
          //     </div>
          //     <div>
          //       <p className="font-display font-600 text-lg text-white" style={{ fontWeight: 600 }}>
          //         Drop your selfie here
          //       </p>
          //       <p className="text-amber-100 text-sm mt-1">A clear face photo gives best results</p>
          //     </div>
          //   </div>
          // </DropZone>

          <div className="flex flex-col gap-4">

            {/* Upload */}
            <DropZone onFiles={handleFile} className="p-10 text-center">
              <p className="font-display text-lg text-white">
                Upload a selfie
              </p>
              <p className="text-amber-100 text-sm mt-1">
                Drag & drop or click
              </p>
            </DropZone>

            {/* Camera Button */}
            <button
              onClick={startCamera}
              className="btn-primary w-full"
            >
              Take Selfie
            </button>

          </div>
        )}
        {cameraOn && (
          <div className="flex flex-col items-center gap-4 mt-6">

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-64 h-64 rounded-xl object-cover scale-x-[-1]"
            />

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="flex gap-4">
              <button onClick={captureSelfie} className="btn-primary">
                Capture
              </button>

              <button onClick={stopCamera} className="text-red-400">
                Cancel
              </button>
            </div>

          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 rounded-xl bg-ink-800/50 border border-ink-700 text-sm text-amber-100 space-y-1.5">
          <p className="text-amber-500/70 font-display font-600 text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Tips for best results</p>
          <p>• Face should be clearly visible and well-lit</p>
          <p>• Avoid sunglasses or heavy occlusions</p>
          <p>• A front-facing close-up works best</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:text-white transition-colors text-sm flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back
          </button>

          <button
            disabled={!selfie}
            onClick={() => navigate('/results')}
            className="btn-primary flex items-center gap-2"
          >
            Find My Photos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
