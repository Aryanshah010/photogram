require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const signupRoute = require('./Routes/signupRoute');  

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST'], // Add allowed methods
  credentials: true,
}));

app.use(bodyparser.json());
app.use('/api',signupRoute)


//start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
