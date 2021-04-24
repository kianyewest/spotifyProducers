
const express = require('express');
const app = express();
var cors = require('cors')

const path = require('path');
const apiRoute = require('./routes/api')
const loginRoute = require('./routes/login')
const envPath = path.join(__dirname, '..','.env');
require('dotenv').config({path:envPath})


// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

//   app.use(cors(corsOptions))
  app.use(cors())
//  Connect all our routes to our application
app.use('/api', apiRoute);
app.use('/login', loginRoute);
app.get('/', (req, res) => {
  res.send('Hello World! go to /api or /login')
})


const port = process.env.PORT || 8080;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

