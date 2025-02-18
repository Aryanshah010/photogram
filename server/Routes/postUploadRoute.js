const express = require('express');
const upload = require('../Middleware/uploadMiddleware');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');
const { authenticateToken } = require('../middleware/auth');
const { createPost, getGenreById } = require('../Model/postModel');

const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

router.post(
  '/post',
  upload.single('image'),
  authenticateToken,
  async (req, res) => {
    let filePath = null;

    try {
      // Pre-validate input fields
      const { title, description, genre_id,location } = req.body;

      if (!title || !genre_id) {
        return res.status(400).json({ message: 'Title , genre and location are required.' });
      }

      // Validate genre_id exists
      const genre = await getGenreById(genre_id);
      if (!genre) {
        return res.status(404).json({ message: 'Invalid genre ID. Please select a valid genre.' });
      }

      // Validate uploaded file
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      filePath = file.path;

      // Validate file type
      const buffer = fs.readFileSync(filePath);
      const type = await FileType.fromBuffer(buffer);
      if (!type || !['image/jpeg', 'image/png', 'image/jpg'].includes(type.mime)) {
        throw new Error('Invalid file content. Please upload a JPEG, PNG, or JPG image.');
      }

      // Additional validation using sharp
      await sharp(filePath).metadata();

      // All validations passed; create the post
      const userId = req.user.userId; // Extracted from authentication token
      const imagePath = `/uploads/${file.filename}`;

      const post = await createPost({
        userId,
        title,
        description,
        genre_id,
        location,
        imagePath,
      });

      res.status(201).json({ message: 'Post created successfully', postId: post.rows[0].id });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(400).json({ message: error.message });
    } finally {
      // Delete the file if an error occurred
      if (filePath && res.statusCode !== 201) {
        deleteFile(filePath);
      }
    }
  }
);

module.exports = router;