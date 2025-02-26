const pool = require('../config/database');

async function getProfileById(userId) {
  try {
      const query = `
          SELECT 
              p.profile_id, p.fullname, p.city, p.country, p.bio, p.image_path, p.created_at,
              u.id AS user_id, u.name AS username, u.created_at AS user_created_at,
              (SELECT COUNT(*) FROM post WHERE user_id = $1) AS total_uploads,
              (SELECT COUNT(*) FROM likes WHERE user_id = $1) AS photos_liked,
              (SELECT COUNT(*) FROM likes l JOIN post p ON l.post_id = p.post_id WHERE p.user_id = $1) AS total_likes
          FROM user_profile p
          JOIN users_registration u ON p.user_id = u.id
          WHERE p.user_id = $1;
      `;

      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
          throw new Error('User profile not found');
      }

      return result.rows[0];
  } catch (error) {
      console.error('Error fetching profile:', error.message);
      throw new Error('Could not fetch profile');
  }
}


async function updateProfile({ userId, fullname, city, country, bio, imagePath }) {
    if (!userId) {
      throw new Error('User ID is required to update profile');
    }

    try {
      const updateQuery = `
        UPDATE user_profile
        SET 
          fullname = COALESCE($2, fullname),
          city = COALESCE($3, city),
          country = COALESCE($4, country),
          bio = COALESCE($5, bio),
          image_path = COALESCE($6, image_path),
          updated_at = NOW()
        WHERE user_id = $1
        RETURNING *;
      `;

      const values = [userId, fullname || null, city || null, country || null, bio || null, imagePath || null];

      const resultProfile = await pool.query(updateQuery, values);
      if (resultProfile.rows.length === 0) {
          throw new Error('Profile update failed');
      }

      return resultProfile.rows[0]; // Return the updated profile
    } catch (error) {
      console.error('Error updating profile info:', error.message);
      throw new Error('Failed to update profile info');
    }
}

async function getProfilePic(userId){
    const query=`SELECT image_path FROM user_profile WHERE user_id=$1`;
    const result=await pool.query(query,[userId]);
    return result.rows[0].image_path; 
}



module.exports = {
    updateProfile,
    getProfileById,
    getProfilePic,
  };