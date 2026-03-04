import { useRef, useState } from 'react'

/**
 * Reusable drag-and-drop / click-to-upload zone.
 *
 * Props:
 *  - onFiles(FileList|File[]) : callback when files are chosen
 *  - accept : MIME types string  (default "image/*")
 *  - multiple : boolean          (default false)
 *  - children : content to render inside the zone
 *  - className : extra classes
 */
export default function DropZone({
  onFiles,
  accept = 'image/*',
  multiple = false,
  children,
  className = '',
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    if (files.length) onFiles(files)
  }

  // const handleChange = (e) => {
  //   const files = Array.from(e.target.files)
  //   if (files.length) onFiles(files)
  //   // Reset input so same file can be re-selected
  //   e.target.value = ''
  // }
  const handleChange = (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith('image/')
    )
    if (files.length) onFiles(files)
    e.target.value = ''
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
        ${isDragging
          ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
          : 'border-ink-600 hover:border-amber-500/60 hover:bg-ink-800/50'
        }
        ${className}
      `}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
