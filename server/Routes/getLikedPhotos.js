const express = require('express');
const { getLikedPhotos } = require('../Model/profileModel'); // Import the getLikedPhotos model function 
const { authenticateToken } = require('../middleware/auth'); 

const router = express.Router();

// Route to get liked photos
router.get('/liked-photos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const photos = await getLikedPhotos(userId); // Fetch the liked photos
    res.status(200).json({ photos }); // Return the liked photos as JSON response
  } catch (error) {
    console.error('Error fetching liked photos:', error.message);
    res.status(500).json({ message: 'Failed to fetch liked photos' });
  }
});

module.exports = router;