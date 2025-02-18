const express = require('express');
const { getAllPosts } = require('../Model/postModel'); // Import the getAllPosts function
const router = express.Router();

// Route to get all posts
router.get('/post', async (req, res) => {
    try {
        const posts = await getAllPosts(); // Fetch all posts
        res.status(200).json(posts); // Return posts as JSON response
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});

module.exports = router;
