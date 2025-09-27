import { put } from '@vercel/blob'
import formidable from 'formidable'
import fs from 'fs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowEmptyFiles: false,
      multiples: false,
    })

    const [fields, files] = await form.parse(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file

    if (!file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    // Validate file type
    if (!file.originalFilename || !file.originalFilename.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'Only PDF files are allowed' })
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' })
    }

    // Create unique filename
    const timestamp = Date.now()
    const safeFilename = file.originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `resumes/${timestamp}-${safeFilename}`

    // Read file and upload to Vercel Blob
    const fileBuffer = fs.readFileSync(file.filepath)

    const blob = await put(uniqueFilename, fileBuffer, {
      access: 'public',
      contentType: 'application/pdf',
    })

    // Clean up temp file
    fs.unlinkSync(file.filepath)

    res.status(200).json({
      success: true,
      url: blob.url,
      fileName: file.originalFilename,
      size: file.size,
      uploadDate: new Date().toISOString()
    })

  } catch (error) {
    console.error('Resume upload error:', error)
    res.status(500).json({
      error: 'Failed to upload resume'
    })
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to use formidable
  },
}