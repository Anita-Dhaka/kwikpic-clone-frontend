import { Routes, Route } from 'react-router-dom'
import { PhotoProvider } from './context/PhotoContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import UploadPhotos from './pages/UploadPhotos'
import UploadSelfie from './pages/UploadSelfie'
import Results from './pages/Results'

export default function App() {
  return (
    <PhotoProvider>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/upload"  element={<UploadPhotos />} />
        <Route path="/selfie"  element={<UploadSelfie />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </PhotoProvider>
  )
}
