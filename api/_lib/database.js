import mongoose from 'mongoose'

let cachedConnection = null

const connectDB = async () => {
  // Use cached connection if available (important for serverless)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    cachedConnection = conn
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export default connectDB