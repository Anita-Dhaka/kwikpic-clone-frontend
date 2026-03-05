/**
 * Simulates a face-matching API call.
 * Randomly selects 5–10 photos from the event album after a fake network delay.
 *
 * @param {File[]} eventPhotos - All uploaded event photos
 * @param {File}   selfie      - The user's selfie (unused in mock, but mirrors real API signature)
 * @returns {Promise<{file: File, url: string}[]>}
 */
export function mockFaceMatch(eventPhotos, selfie) {
  return new Promise((resolve) => {
    // Simulate network latency (1.5 – 3 seconds)
    const delay = 1500 + Math.random() * 1500

    setTimeout(() => {
      // Randomly decide how many matches to return (5 to 10, capped at total)
      const maxMatches = Math.min(eventPhotos.length, 10)
      const minMatches = Math.min(eventPhotos.length, 5)
      const count = Math.floor(Math.random() * (maxMatches - minMatches + 1)) + minMatches

      // Fisher-Yates shuffle, then slice
      const shuffled = [...eventPhotos].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, count)

      // Convert Files to object URLs for display
      const results = selected.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }))

      resolve(results)
    }, delay)
  })
}

import axios from "axios";

export async function uploadAlbum(filesArray) {
  const formData = new FormData()

  filesArray.forEach(photo => {
    formData.append("files", photo.file)
    formData.append("ids", photo.id) 
  })

  const response = await axios.post(
    `${import.meta.env.VITE_HOST_URL}upload_album`,
    formData
  )

  return response.data
}

export async function matchSelfie(file) {
  const formData = new FormData();
  formData.append("file", file); // "file" must match FastAPI parameter name

  try {
    const response = await axios.post(`${import.meta.env.VITE_HOST_URL}match_selfie`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Matched images:", response.data.matches);
    return response.data.matches;
  } catch (error) {
    console.error("Selfie match failed:", error.response?.data || error.message);
  }
}
