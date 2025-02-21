const express = require('express');
const { getAllGenres } = require('../Model/getGenreModel');
const router = express.Router();

// Route to fetch all genres
router.get('/genres', async (req, res) => {
    try {
        const genres = await getAllGenres();
        res.status(200).json(genres); 
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        res.status(500).json({ message: 'Failed to fetch genres' });
    }
});

module.exports = router;
