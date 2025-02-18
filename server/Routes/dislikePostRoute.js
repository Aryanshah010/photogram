const express = require('express');
// const { dislikePost } = require('../models/watchlistModel');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.delete('/like/:post_id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const postId = parseInt(req.params.contentId, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }
        
        const result = await dislikePost({ userId, postId});

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json({ message: "Removed like" });
    } catch (error) {
        console.error("Error removing from like:", error.message);
        return res.status(500).json({ message: "Could not remove like from the post" });
    }
});

module.exports = router;
