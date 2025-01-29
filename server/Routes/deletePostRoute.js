const express = require('express');
const { deletePost, getPostById } = require('../model/postModel'); // Ensure getPostById function exists
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Route to delete a post
router.delete('/post/:id', authenticateToken, async (req, res) => {
    try {
        const post_id = req.params.id;
        const user_id = req.user.userId; // Extracted from the authentication token

        // Fetch the post details
        const post = await getPostById(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the authenticated user is the owner of the post
        if (post.user_id !== user_id) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        // Delete the post
        await deletePost(post_id);
        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

module.exports = router;
