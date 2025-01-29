const express = require('express');
const { updatePost, getPostById } = require('../model/postModel');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../Middleware/postUploadMiddleware');
const router = express.Router();

// Route to update a post
router.patch('/post/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const post_id = req.params.id;
        const user_id = req.user.userId; // Extracted from authentication token
        const { title, description, genre_id } = req.body;

        // Get the file path of the uploaded image (if exists)
        const image_path = req.file ? req.file.path : undefined; // Get the image path from multer

        // Fetch the post details
        const post = await getPostById(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the authenticated user is the owner of the post
        if (post.user_id !== user_id) {
            return res.status(403).json({ message: 'Unauthorized to update this post' });
        }

        // Keep old values if new ones are not provided
        const updatedTitle = title || post.title;
        const updatedDescription = description || post.description;
        const updatedGenre = genre_id || post.genre_id;

        // Update the post
        const updatedPost = await updatePost(post_id, updatedTitle, updatedDescription, updatedGenre, image_path);
        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });

    } catch (error) {
        console.error('Error updating post:', error.message);
        res.status(500).json({ message: 'Failed to update post' });
    }
});

module.exports = router;
