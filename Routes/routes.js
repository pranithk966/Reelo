const express = require('express')
const router = express.Router()
const {
  getAllSongs,
  getSongById,
  createSong,
  updateSongById,
  deleteSongById,
} = require('../controller/songController')

// Route to get all songs
router.get('/songs', getAllSongs)

// Route to get a song by ID
router.get('/songs/:id', getSongById)

// Route to post a new song
router.post('/songs', createSong)

// Route to update a song by ID
router.put('/songs/:id', updateSongById)

// Route to delete a song by ID
router.delete('/songs/:id', deleteSongById)

module.exports = router
