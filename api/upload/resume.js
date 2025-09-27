import { put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse form data
    const contentType = req.headers['content-type'] || ''

    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' })
    }

    // For Vercel, we'll get the file as a buffer in the request
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`)
    const filename = searchParams.get('filename')

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' })
    }

    // Validate file type
    if (!filename.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'Only PDF files are allowed' })
    }

    // Create unique filename
    const timestamp = Date.now()
    const uniqueFilename = `resumes/${timestamp}-${filename}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, req, {
      access: 'public',
      contentType: 'application/pdf',
    })

    res.status(200).json({
      success: true,
      url: blob.url,
      fileName: filename,
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
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
}