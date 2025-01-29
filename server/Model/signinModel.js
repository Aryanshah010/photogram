const pool=require('../config/database');

const findUserByEmail=async(email)=>{
    const query=`SELECT * FROM users_registration WHERE email=$1`;
    const values=[email];
    return pool.query(query,values);
};
module.exports={ findUserByEmail };