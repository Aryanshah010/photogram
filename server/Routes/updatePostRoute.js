const express = require('express');
const { updatePost, getPostById } = require('../Model/postModel');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../Middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const FileType = require('file-type');
const router = express.Router();

// Helper function to delete a file
const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  };

// Route to update a post
router.patch('/post/:post_id',  upload.single('image'),authenticateToken, async (req, res) => {
    let filePath = null;
    try {
        const post_id = req.params.post_id;
        const user_id = req.user.userId; // Extracted from authentication token
        const { title, description, genre_id, location } = req.body;
        console.log('Received data:', { title, description, genre_id, location });
         // Fetch current post data
        const existingPost= await getPostById(post_id);
        if (!existingPost) {
        return res.status(404).json({ message: 'Post not found' });
        }


        const oldImagePath = existingPost.image_path; // e.g., '/uploads/oldImage.jpg'
        let imagePath = oldImagePath; // Default to the existing image path

      
        // Check if the authenticated user is the owner of the post
        if (existingPost.user_id !== user_id) {
            return res.status(403).json({ message: 'Unauthorized to update this post' });
        }

         // Validate and process uploaded image if present
        if (req.file) {
            filePath = req.file.path; // This is the new file's path (e.g., 'uploads/newImage.jpg' or similar)
  
        // Read file buffer for validation
        const buffer = fs.readFileSync(filePath);

          // Validate MIME type
        const type = await FileType.fromBuffer(buffer);
        if (!type || !['image/jpeg', 'image/png', 'image/jpg'].includes(type.mime)) {
            throw new Error('Invalid file type. Please upload a JPEG, PNG, or JPG image.');
        }

        // Additional validation using sharp (ensures image is valid)
        await sharp(filePath).metadata();

        // Update imagePath with new file path (as stored in the DB)
        imagePath = `/uploads/${req.file.filename}`;
        }

        const updatedPost=await updatePost({
            post_id,
            title: (title !== undefined && title.trim() !== '') ? title : existingPost.title,
            description: (description !== undefined && description.trim() !== '') ? description : existingPost.description,
            genre_id: (genre_id !== undefined && genre_id.trim() !== '') ? genre_id : existingPost.genre_id,
            location: (location !== undefined && location.trim() !== '') ? location : existingPost.location,
            imagePath,
        });


        // If a new image was uploaded successfully, delete the old image file to avoid orphaned files.
        if (req.file && oldImagePath && oldImagePath !== imagePath) {
            // Remove the leading '/' from the stored path to build a correct file system path.
            const relativeOldPath = oldImagePath.startsWith('/') ? oldImagePath.substring(1) : oldImagePath;
            const oldFilePath = path.join(__dirname, '..', relativeOldPath);
            deleteFile(oldFilePath);
        }
    
        res.status(200).json({ message: 'Post updated successfully',  updatedPost });
    } catch (error) {
        console.error('Error updating post:', error.message);
        res.status(400).json({ message: error.message });
    }finally {
        // If an image file was uploaded and an error occurred, remove it.
        if (filePath && res.statusCode !== 200) {
          deleteFile(filePath);
        }
      }
 });


module.exports = router;
