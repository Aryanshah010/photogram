const express=require('express');
const { likeStatus } = require('../Model/likePost');
const { authenticateToken } = require('../middleware/auth');
const router=express.Router();

router.get('/like/:post_id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const postId = parseInt(req.params.post_id, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID' });
        }
        
        const result = await likeStatus({ userId, postId });

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching like status:", error.message);
        return res.status(500).json({ message: "Could not fetch like status" });
    }
});

module.exports = router;