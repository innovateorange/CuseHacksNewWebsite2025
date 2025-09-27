import { put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Upload request received')
    console.log('Content-Type:', req.headers['content-type'])

    const contentType = req.headers['content-type'] || ''

    if (!contentType.includes('multipart/form-data')) {
      console.log('Invalid content type:', contentType)
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' })
    }

    // Extract boundary
    const boundary = contentType.split('boundary=')[1]
    if (!boundary) {
      return res.status(400).json({ error: 'No boundary found in multipart data' })
    }

    console.log('Boundary:', boundary)

    // Get the raw body
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    console.log('Received buffer size:', buffer.length)

    // Parse multipart data properly
    const boundaryBytes = Buffer.from(`\r\n--${boundary}`)
    let fileBuffer = null
    let filename = null

    // Split buffer by boundary
    let start = 0
    while (start < buffer.length) {
      const nextBoundary = buffer.indexOf(boundaryBytes, start)
      if (nextBoundary === -1) break

      const part = buffer.slice(start, nextBoundary)

      // Find header section end (double CRLF)
      const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'))
      if (headerEnd !== -1) {
        const headers = part.slice(0, headerEnd).toString()

        // Check if this part contains a file
        if (headers.includes('filename=')) {
          // Extract filename
          const filenameMatch = headers.match(/filename="([^"]+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
            console.log('Extracted filename:', filename)
          }

          // Extract file data
          fileBuffer = part.slice(headerEnd + 4) // Skip the \r\n\r\n
          console.log('Extracted file size:', fileBuffer.length)
          break
        }
      }

      start = nextBoundary + boundaryBytes.length
    }

    if (!fileBuffer || !filename) {
      return res.status(400).json({ error: 'No file data found' })
    }

    // Validate file type
    if (!filename.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'Only PDF files are allowed' })
    }

    // Validate file size
    if (fileBuffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size must be less than 5MB' })
    }

    // Create unique filename
    const timestamp = Date.now()
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `resumes/${timestamp}-${safeFilename}`

    console.log('Uploading to blob:', uniqueFilename, 'Size:', fileBuffer.length)

    // Upload to Vercel Blob with proper content length
    const blob = await put(uniqueFilename, fileBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
    })

    console.log('Upload successful:', blob.url)

    res.status(200).json({
      success: true,
      url: blob.url,
      fileName: filename,
      size: fileBuffer.length,
      uploadDate: new Date().toISOString()
    })

  } catch (error) {
    console.error('Resume upload error:', error)
    res.status(500).json({
      error: `Failed to upload resume: ${error.message}`
    })
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to use formidable
  },
}