const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  )
}

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create new user
    const user = new User({ username, email, password })

    // Save user to database
    await user.save()

    // Generate JWT token
    const token = generateToken(user)

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Authenticate a user
const authUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      // Generate JWT token
      const token = generateToken(user)

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { registerUser, authUser }
