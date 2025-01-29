const pool = require('../config/database');

// Fetch all genres
async function getAllGenres() {
    try {
        const query = 'SELECT * FROM genre;';
        const result = await pool.query(query);
        return result.rows; // Returning the genres as an array of rows
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        throw new Error('Failed to fetch genres from the database'); // More specific error message
    }
}

module.exports = { getAllGenres };
