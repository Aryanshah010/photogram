const express = require('express');
const { getPostsByUser } = require('../Model/postModel');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/user-photos', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const photos = await getPostsByUser(user_id);

    res.status(200).json({ photos });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user photos' });
  }
});

module.exports = router;

