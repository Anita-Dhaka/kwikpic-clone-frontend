const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ------------------------
// Upload Album
// ------------------------

/**
 * Sends image files to /upload_album.
 * Backend generates all IDs — frontend sends only files.
 * Returns { album_id } from the backend.
 *
 * @param {Array<{ file: File }>} eventPhotos
 * @returns {Promise<{ album_id: string }>}
 */
export async function uploadAlbum(eventPhotos) {
  const formData = new FormData()

  for (const photo of eventPhotos) {
    formData.append("files", photo.file)
  }

  const response = await fetch(`${BASE_URL}/upload_album`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || "Failed to upload album")
  }

  const data = await response.json()
  return data // { album_id, uploaded, files }
}


// ------------------------
// Match Selfie
// ------------------------

/**
 * Sends selfie + album_id to /match_selfie.
 * Returns array of match objects: { album_id, image_name, image_url, score }
 *
 * @param {File} selfieFile
 * @param {string} albumId
 * @returns {Promise<Array<{ album_id: string, image_name: string, image_url: string, score: number }>>}
 */
export async function matchSelfie(selfieFile, albumId) {
  const formData = new FormData()
  formData.append("file", selfieFile)
  formData.append("album_id", albumId)

  const response = await fetch(`${BASE_URL}/match_selfie`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || "Failed to match selfie")
  }

  const data = await response.json()
  return data.matches // [{ album_id, image_name, image_url, score }]
}