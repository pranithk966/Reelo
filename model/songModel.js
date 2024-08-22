const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  songPath: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
})

const Song = mongoose.model('Song', songSchema)

module.exports = Song
