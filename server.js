require('dotenv').config()
const app = require('express')();
const apiRoute = require('./routes/api')
const loginRoute = require('./routes/login')

//  Connect all our routes to our application
app.use('/api', apiRoute);
app.use('/login', loginRoute);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello ur at \"/\" nothing here' });
});

const port = process.env.PORT || 8080;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

