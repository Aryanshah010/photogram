const express = require('express');
const { likePost } = require('../Model/likePost');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/like/:post_id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const postId = parseInt(req.params.post_id, 10);
        
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        
        const result = await likePost({ userId, postId });
        return res.status(201).json(result);
    } catch (error) {
        console.error('Error liking the post:', error.message);
        return res.status(500).json({ message: 'Could not like the post' });
    }
});

module.exports = router;
