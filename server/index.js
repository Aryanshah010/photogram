require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path=require('path')
const bodyparser = require('body-parser');
const signupRoute = require('./Routes/signupRoute'); 
const signinRoute = require('./Routes/signinRoute'); 
const postUploadRoute = require('./Routes/postUploadRoute');
const getAllGenres=require('./Routes/getGenreRoute')
const deletePostRoute = require('./Routes/deletePostRoute');
const getPostRoute = require('./Routes/getPostRoute');
const updatePostRoute = require('./Routes/updatePostRoute');
const updateProfileRoute=require('./Routes/updateProfileRoute');
const likePostRoute=require('./Routes/likePostRoute');
const dislikePostRoute=require('./Routes/dislikePostRoute');
const likePostStatus=require('./Routes/likeStatus');
const getPorfileRoute=require('./Routes/getProfileRoute');
const deleteMeRoute=require('./Routes/deleteMeRoute');
const getParticularPhotoRoute=require('./Routes/getParticularPhotoRoute');
const getPhotoUploadedByUser=require('./Routes/getPhotoUploadedByUser');


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE','OPTIONS'], // Add all necessary methods
  credentials: true,
}));

app.use('/uploads', cors({
  origin: 'http://localhost:5173', // Allow your frontend URL to access the uploads folder
  methods: ['GET'],
}), express.static(path.join(__dirname, 'uploads')));

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true })); // For handling form-data text fields
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api',signupRoute);
app.use('/api',signinRoute);
app.use('/api',postUploadRoute);
app.use('/api',getAllGenres);
app.use('/api',deletePostRoute);
app.use('/api',getPostRoute);
app.use('/api',updatePostRoute);
app.use('/api',updateProfileRoute);
app.use('/api',likePostRoute);
app.use('/api',dislikePostRoute);
app.use('/api',getPorfileRoute);
app.use('/api',deleteMeRoute);
app.use('/api',likePostStatus);
app.use('/api',getParticularPhotoRoute);
app.use('/api',getPhotoUploadedByUser);

//start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
