const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const UserModel = require('../models/user.model') 

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one user
router.get('/:id', getUser, (req, res) => {
  res.json(res.user)
})

// Create a new user
router.post('/', async (req, res) => {  
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update a user
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.user.subscribedToChannel = req.body.subscribedToChannel
  }
  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete a user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.deleteOne()
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware to get user by ID
async function getUser(req, res, next) {
  let user
  try {
    user = await UserModel.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    
    const user = await UserModel.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router
