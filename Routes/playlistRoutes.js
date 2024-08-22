const express = require('express')
const {
  createPlaylist,
  addSongToPlaylist,
  getUserPlaylists,
  deletePlaylist,
  removeSongFromPlaylist, // Import the new function
} = require('../controller/playlistController')
const router = express.Router()

router.post('/playlists', createPlaylist)
router.post('/playlists/add-song', addSongToPlaylist)
router.get('/playlists', getUserPlaylists)
router.delete('/playlists', deletePlaylist)
router.post('/playlists/remove-song', removeSongFromPlaylist) // Add the new route

module.exports = router
