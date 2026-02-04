const express = require('express');
const router = express.Router();
const Consent = require('../models/consent.model'); 

// Get all consents
router.get('/', async (req, res) => {
  try {
    const consents = await Consent.find(); 
    res.json(consents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get consents by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const latestConsent = await Consent.findOne({ user: userId })
      .sort({ timestamp: -1 })
      .populate('user');
   
    if (!latestConsent) {
      return res.json({ consents: [] });
    }
   
    res.json({
      consents: latestConsent.consents,
      timestamp: latestConsent.timestamp
    });
   
  } catch (error) {
    console.error('Error fetching consents:', error);
    res.status(500).json({ error: 'Failed to fetch consents' });
  }
});

// Create a consent
router.post('/', async (req, res) => {
  const consent = new Consent(req.body); 
  try {
    const saved = await consent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a consent
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Consent.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Changed this
    if (!updated) return res.status(404).json({ message: 'Consent not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a consent
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Consent.findByIdAndDelete(req.params.id); // Changed this
    if (!deleted) return res.status(404).json({ message: 'Consent not found' });
    res.json({ message: 'Consent deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;