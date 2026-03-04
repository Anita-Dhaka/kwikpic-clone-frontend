# KwikPic Clone — Frontend

A pixel-perfect KwikPic-style photo-matching app built with React + Vite + Tailwind CSS.

## Stack
- React 18 + Vite 5
- React Router DOM v6
- Tailwind CSS v3
- Context API (global state)

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Flow
1. **Step 1** — Upload multiple event photos (drag & drop or click)
2. **Step 2** — Upload a single selfie
3. **Step 3** — Simulated face-match returns 5–10 random photos from the album

## Folder Structure
```
src/
  components/
    DropZone.jsx      # Reusable drag-and-drop uploader
    Navbar.jsx        # Fixed top navbar with logo
    Stepper.jsx       # 3-step progress indicator
  context/
    PhotoContext.jsx  # Global state (event photos, selfie, results)
  pages/
    Landing.jsx       # Home / hero page
    UploadPhotos.jsx  # Step 1
    UploadSelfie.jsx  # Step 2
    Results.jsx       # Step 3
  utils/
    mockFaceMatch.js  # Simulated async face-matching API
  App.jsx             # Routes + providers
  main.jsx            # Entry point
  index.css           # Tailwind + custom utilities
```
