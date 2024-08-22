const Song = require('../model/songModel')
const jwt = require('jsonwebtoken')

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return null
  }
}

// Get all songs (simplified, ideally you'd filter by user here)
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find()
    res.json(songs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get a song by ID
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
    if (!song) {
      return res.status(404).json({ error: 'Song not found' })
    }
    res.json(song)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Create a new song
const createSong = async (req, res) => {
  const { name, language, songPath, artist, poster, token } = req.body

  // Verify the token
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const newSong = new Song({ name, language, songPath, artist, poster })
  try {
    const savedSong = await newSong.save()
    res.status(201).json(savedSong)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Update a song by ID
const updateSongById = async (req, res) => {
  const { name, language, songPath, artist, poster, token } = req.body

  // Verify the token
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { name, language, songPath, artist, poster },
      { new: true }
    )
    if (!song) {
      return res.status(404).json({ error: 'Song not found' })
    }
    res.json(song)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Delete a song by ID
const deleteSongById = async (req, res) => {
  const { token } = req.body

  // Verify the token
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const song = await Song.findByIdAndDelete(req.params.id)
    if (!song) {
      return res.status(404).json({ error: 'Song not found' })
    }
    res.json({ message: 'Song deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  updateSongById,
  deleteSongById,
}
