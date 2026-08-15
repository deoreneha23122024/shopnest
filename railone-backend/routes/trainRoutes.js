const express = require('express');
const Train = require('../models/Train');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { source, destination } = req.query;
    let query = {};
    
    if (source) query.source = new RegExp(source, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');

    const trains = await Train.find(query);
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json(train);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
