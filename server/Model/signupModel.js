const pool =require('../config/database');

const createUser=async(name,email,hashedpassword)=>{
    const query=`Insert into users_registration(name,email,password) 
    values($1,$2,$3)
    RETURNING id; `;
    const values=[name,email,hashedpassword];
    return pool.query(query,values);
};

module.exports={ createUser };