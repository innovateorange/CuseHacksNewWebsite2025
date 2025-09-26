import { useState, useRef, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onImageChange: (imageUrl: string) => void
  currentImage?: string
  className?: string
}

const ImageUpload = ({ onImageChange, currentImage, className = '' }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resizeImage = useCallback((file: File, maxWidth: number = 512, maxHeight: number = 512, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        // Set canvas size and draw resized image
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to base64 with compression
        const resizedDataURL = canvas.toDataURL('image/jpeg', quality)
        resolve(resizedDataURL)
      }

      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleFile = useCallback(async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        // Resize and compress the image
        const resizedImage = await resizeImage(file, 512, 512, 0.8)
        setPreview(resizedImage)
        onImageChange(resizedImage)
      } catch (error) {
        console.error('Error resizing image:', error)
        // Fallback to original method if resizing fails
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setPreview(result)
          onImageChange(result)
        }
        reader.readAsDataURL(file)
      }
    } else {
      alert('Please select a valid image file')
    }
  }, [onImageChange, resizeImage])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-primary-400 bg-primary-500/10'
            : 'border-primary-500/30 hover:border-primary-500/50 bg-[#0a0a1a]/30'
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center p-8 text-center"
            animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4">
              {isDragging ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1.1 }}
                  className="text-primary-400"
                >
                  <Upload size={48} />
                </motion.div>
              ) : (
                <ImageIcon size={48} className="text-white/40" />
              )}
            </div>
            <p className="text-white/70 mb-2">
              {isDragging ? 'Drop your image here' : 'Drag and drop an image here'}
            </p>
            <p className="text-white/50 text-sm">
              or click to browse your files
            </p>
            <p className="text-white/40 text-xs mt-2">
              Supports JPG, PNG, GIF, WEBP • Images auto-resized to 512x512px
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default memo(ImageUpload)