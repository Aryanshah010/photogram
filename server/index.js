require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const signupRoute = require('./Routes/signupRoute'); 
const signinRoute = require('./Routes/signinRoute'); 
const postUploadRoute = require('./Routes/postUploadRoute');
const getAllGenres=require('./Routes/getGenreRoute')
const deletePostRoute = require('./Routes/deletePostRoute');
const getPostRoute = require('./Routes/getPostRoute');
const updatePostRoute = require('./Routes/updatePostRoute');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST','PATCH','DELETE'], // Add allowed methods
  credentials: true,
}));

// Serve uploaded files statically
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true })); // For handling form-data text fields

app.use('/uploads', express.static('uploads'));

app.use('/api',signupRoute);
app.use('/api',signinRoute);
app.use('/api',postUploadRoute);
app.use('/api',getAllGenres);
app.use('/api',deletePostRoute);
app.use('/api',getPostRoute);
app.use('/api',updatePostRoute);

//start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
