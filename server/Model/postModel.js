const pool = require('../config/database');

async function createPost({userId, title, description, genre_id, location, imagePath}) {
    try {
        const query = `INSERT INTO post(user_id, title, description, genre_id, location, image_path) 
        VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;
        const values = [userId, title, description, genre_id, location, imagePath];
        const result = await pool.query(query, values);
        return result;
    } catch (error) {
        console.error('Error inserting post:', error.message);
        throw new Error('Error inserting post');
    }
}

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
        const query = 'DELETE FROM post WHERE post_id = $1 RETURNING post_id';
        const result = await pool.query(query, [post_id]);
        return result;
    } catch (error) {
        console.error('Error deleting post:', error.message);
        throw new Error('Failed to delete post');
    }
}

async function updatePost(post_id, updatedTitle, updatedDescription, updatedGenre, updatedLocation, updatedImage) {
    try {
        let query;
        let values;

        if (updatedImage !== undefined) {
            query = `UPDATE post SET title = $1, description = $2, genre_id = $3, location = $4, image_path = $5 WHERE post_id = $6 RETURNING *;`;
            values = [updatedTitle, updatedDescription, updatedGenre, updatedLocation, updatedImage, post_id];
        } else {
            query = `UPDATE post SET title = $1, description = $2, genre_id = $3, location = $4 WHERE post_id = $5 RETURNING *;`;
            values = [updatedTitle, updatedDescription, updatedGenre, updatedLocation, post_id];
        }

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating post:', error.message);
        throw new Error('Error updating post');
    }
}

async function getPostsByUser(user_id) {
    try {
        const query = `
            SELECT 
                p.post_id, p.title, p.description, p.genre_id, p.location, p.image_path, p.created_at,
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

async function getPostById(post_id) {
    try {
        const query = `
            SELECT 
                p.post_id, p.title, p.description, p.genre_id, p.location, p.image_path, p.created_at,
                u.id AS user_id, u.name AS username
            FROM post p
            JOIN users_registration u ON p.user_id = u.id
            WHERE p.post_id = $1;
        `;
        const result = await pool.query(query, [post_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching post:', error.message);
        throw new Error('Error fetching post');
    }
}

async function getAllPosts() {
    try {
        const query = `
            SELECT 
                p.post_id, p.title, p.description, p.genre_id, p.location, p.image_path, p.created_at,
                u.id AS user_id, u.name AS username
            FROM post p
            JOIN users_registration u ON p.user_id = u.id
            ORDER BY p.created_at DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        throw new Error('Error fetching posts');
    }
}

module.exports = { createPost, getGenreById, deletePost, updatePost, getPostsByUser, getPostById, getAllPosts };
