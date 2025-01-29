const pool = require('../config/database');

async function createPost({userId,title,description,genre_id,imagePath}){
    try{
        const query = `INSERT INTO post(user_id,title,description,genre_id,image_path) 
        VALUES($1,$2,$3,$4,$5) RETURNING *;`;
        const values = [userId,title,description,genre_id,imagePath];
        const result = await pool.query(query, values);
        return result;

    }catch(error){
        console.error('Error inserting post:', error.message);
        throw new Error('Error inserting post');
    }
}

// Validate genre by ID
async function getGenreById(genre_id) {
    try {
        const result = await pool.query('SELECT * FROM genre WHERE id = $1', [genre_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching genre:', error.message);
        throw new Error('Error fetching genre');
    }
}

async function deletePost(post_id) {
    try {
        const query = 'DELETE FROM post WHERE post_id = $1;';
        const result = await pool.query(query, [post_id]);
        return result;
        
    } catch (error) {
        console.error('Error deleting post:', error.message);
        throw new Error('Error deleting post');
        
    }
    
}

async function updatePost(post_id, updatedTitle, updatedDescription, updatedGenre, updatedImage) {
    try {
        let query;
        let values;

        if (updatedImage !== undefined) { // Use updatedImage instead of imagePath
            query = `UPDATE post SET title = $1, description = $2, genre_id = $3, image_path = $4 WHERE post_id = $5 RETURNING *;`;
            values = [updatedTitle, updatedDescription, updatedGenre, updatedImage, post_id];
        } else {
            query = `UPDATE post SET title = $1, description = $2, genre_id = $3 WHERE post_id = $4 RETURNING *;`;
            values = [updatedTitle, updatedDescription, updatedGenre, post_id];
        }

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating post:', error.message);
        throw new Error('Error updating post');
    }
}


// Fetch all posts by a specific user
async function getPostsByUser(user_id) {
    try {
        const query = `
            SELECT 
                p.post_id, p.title, p.description, p.genre_id, p.image_path, p.created_at,
                u.id AS user_id, u.name
            FROM post p
            JOIN users_registration u ON p.user_id = u.id
            WHERE p.user_id = $1
            ORDER BY p.created_at DESC;
        `;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching user posts:', error.message);
        throw new Error('Error fetching user posts');
    }
}

// Fetch a specific post by ID, including user details
async function getPostById(post_id) {
    try {
        const query = `
            SELECT 
                p.post_id, p.title, p.description, p.genre_id, p.image_path, p.created_at,
                u.id AS user_id, u.name AS username
            FROM post p
            JOIN users_registration u ON p.user_id = u.id
            WHERE p.post_id = $1;
        `;
        const result = await pool.query(query, [post_id]);
        return result.rows[0]; // Return single post
    } catch (error) {
        console.error('Error fetching post:', error.message);
        throw new Error('Error fetching post');
    }
}

// Function to fetch all posts
async function getAllPosts() {
    try {
        const query = `
            SELECT 
                p.post_id, p.title, p.description, p.genre_id, p.image_path, p.created_at,
                u.id AS user_id, u.name AS username
            FROM post p
            JOIN users_registration u ON p.user_id = u.id
            ORDER BY p.created_at DESC;
        `;
        const { rows } = await pool.query(query);
        return rows; // Return list of posts
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        throw new Error('Error fetching posts');
    }
}


module.exports = { createPost,getGenreById,deletePost,updatePost,getPostsByUser,getPostById,getAllPosts };