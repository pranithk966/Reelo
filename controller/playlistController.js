const Playlist = require('../model/playlistModel')
const jwt = require('jsonwebtoken')

// Create a new playlist
const createPlaylist = async (req, res) => {
  const { name, token } = req.body

  // Verify the token and get the user ID
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // Check if a playlist already exists for the user
    const existingPlaylist = await Playlist.findOne({ user: decoded.id })
    if (existingPlaylist) {
      return res.status(400).json({ message: 'Playlist already exists' })
    }

    // Create a new playlist if none exists
    const playlist = new Playlist({
      name,
      user: decoded.id,
    })
    const savedPlaylist = await playlist.save()
    res.status(201).json(savedPlaylist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add a song to a playlist
const addSongToPlaylist = async (req, res) => {
  const { playlistId, songId, token } = req.body

  // Verify the token and get the user ID
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: decoded.id,
    })
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' })
    }

    // Check if the song is already in the playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: 'Song already in playlist' })
    }

    playlist.songs.push(songId)
    await playlist.save()
    res.json(playlist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all playlists for a user
const getUserPlaylists = async (req, res) => {
  const { token } = req.query

  // Verify the token and get the user ID
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const playlists = await Playlist.find({ user: decoded.id }).populate(
      'songs'
    )
    res.json(playlists)
  } catch (error) {
    console.error('Error fetching playlists:', error)
    res.status(500).json({ message: error.message })
  }
}

// Delete a playlist
const deletePlaylist = async (req, res) => {
  const { playlistId, token } = req.body

  // Verify the token and get the user ID
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      user: decoded.id,
    })
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' })
    }
    res.json({ message: 'Playlist deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeSongFromPlaylist = async (req, res) => {
  const { playlistId, songId, token } = req.body

  console.log('Request body:', req.body) // Log request body for debugging

  // Verify the token and get the user ID
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded) // Log decoded token
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: decoded.id,
    })
    console.log('Found playlist:', playlist) // Log found playlist

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' })
    }

    const songIndex = playlist.songs.indexOf(songId)
    if (songIndex === -1) {
      return res.status(404).json({ message: 'Song not found in playlist' })
    }

    playlist.songs.splice(songIndex, 1)
    await playlist.save()
    console.log('Updated playlist:', playlist) // Log updated playlist

    res.json(playlist)
  } catch (error) {
    console.error('Error:', error) // Log error details
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createPlaylist,
  addSongToPlaylist,
  getUserPlaylists,
  deletePlaylist,
  removeSongFromPlaylist,
}
