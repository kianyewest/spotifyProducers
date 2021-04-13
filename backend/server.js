
const express = require('express');
const app = express();
const path = require('path');
const apiRoute = require('./routes/api')
const loginRoute = require('./routes/login')
const envPath = path.join(__dirname, '..','.env');
require('dotenv').config({path:envPath})

//  Connect all our routes to our application
app.use('/api', apiRoute);
app.use('/login', loginRoute);


const port = process.env.PORT || 8080;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

