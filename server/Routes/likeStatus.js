const express = require('express');
const { likeStatus } = require('../Model/likePost');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all liked posts for the current user
router.get('/liked-posts', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await likeStatus({ userId }); // Use the model function
        
        if (result.error) {
            return res.status(500).json({ message: result.error });
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching liked posts:", error.message);
        res.status(500).json({ message: "Could not fetch liked posts" });
    }
});

module.exports = router;