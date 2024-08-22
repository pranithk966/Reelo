const express = require('express')
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./Routes/userRoutes')
const songRoutes = require('./Routes/routes')
const playlistRoutes = require('./Routes/playlistRoutes') // Import the playlist routes

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'home' })
})

app.use('/api', userRoutes)
app.use('/api', songRoutes)
app.use('/api', playlistRoutes) // Use the playlist routes

const PORT = process.env.PORT || 8080

// Database Connection and Server Initialization
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => console.error('MongoDB connection error:', err))
