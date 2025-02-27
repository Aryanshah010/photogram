const pool = require('../config/database');

const likePost = async ({ userId, postId }) => {
    try {
        const query = `
            INSERT INTO likes (post_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT (post_id, user_id) DO NOTHING
            RETURNING *;
        `;
        const values = [postId, userId];
        const { rows } = await pool.query(query, values);
        return rows[0] || { message: 'Already liked' };
    } catch (error) {
        throw new Error(error.message);
    }
};

const unlikePost = async ({ userId, postId }) => {
    try {
        const query = `DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *;`;
        const values = [postId, userId];
        const { rows } = await pool.query(query, values);
        return rows[0] || { message: 'Like not found' };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getLikesCount = async (postId) => {
    try {
        const query = `SELECT COUNT(*) FROM likes WHERE post_id = $1;`;
        const { rows } = await pool.query(query, [postId]);
        return rows[0].count;
    } catch (error) {
        throw new Error(error.message);
    }
};

const likeStatus = async ({ userId, postId = null }) => {
    try {
        let query;
        let values;
        
        if (postId) {
            // Get like status for a specific post
            query = `SELECT EXISTS(SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2) AS liked;`;
            values = [postId, userId];
            const { rows } = await pool.query(query, values);
            return { liked: rows[0].liked };
        } else {
            // Get all liked posts for the user
            query = `SELECT post_id FROM likes WHERE user_id = $1`;
            values = [userId];
            const { rows } = await pool.query(query, values);
            return rows;
        }
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = {
    likePost,
    unlikePost,
    getLikesCount,
    likeStatus,
};
