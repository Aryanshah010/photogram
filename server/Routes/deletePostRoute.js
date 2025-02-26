const express = require('express');
const fs = require('fs');
const path = require('path'); // For correct file path handling
const { deletePost, getPostById } = require('../Model/postModel');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        const absoluteFilePath = path.join(__dirname, '..', filePath); // Ensure path is absolute
        fs.unlinkSync(absoluteFilePath);
    }
};

// Route to delete a post
router.delete('/post/:post_id', authenticateToken, async (req, res) => {
    const post_id = req.params.post_id;
    const user_id = req.user.userId; // Extracted from the authentication token

    try {
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
        const result = await deletePost(post_id);
        
        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Failed to delete post, it may have already been deleted' });
        }

        // Delete the associated file (if it exists)
        deleteFile(post.image_path);

        res.status(200).json({ message: 'Post deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

module.exports = router;
