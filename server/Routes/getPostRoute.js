const express = require('express');
const { getAllPosts,getPostsByGenre } = require('../Model/postModel'); // Import the getAllPosts function
const router = express.Router();

// Route to get all posts or filter by genre
router.get('/post', async (req, res) => {
    try {
        const { genre_id } = req.query; // Get genre_id from query parameters
        let posts;
        if (genre_id) {
            posts = await getPostsByGenre(genre_id); // Fetch posts by genre
        } else {
            posts = await getAllPosts(); // Fetch all posts
        }
        res.status(200).json(posts); // Return posts as JSON response
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});

module.exports = router;
