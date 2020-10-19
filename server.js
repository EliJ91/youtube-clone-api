require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors')
const fileUpload = require('express-fileupload')


mongoose.connect(process.env.MONGO_URI,{ useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
mongoose.set('useCreateIndex', true)
db.on('error', (error)=> console.error(error))
db.once('open', ()=>console.log("Connected to DB."))

app.use(express.json())
app.use(cors())
app.use(fileUpload())

const UserRouter = require('./routes/users.routes')
app.use('/api/user', UserRouter)


//Upload Endpoint
uploadAuth = async (req, res, next) => {
  axios.post('https://sandbox.api.video/auth/api-key', {
    "apiKey": "SkGQnAbt0xEwWBiglfTPtITEMQYY7fUZ8bQ95mfHKz"
  })
  .then(function (response) {
    req.API_AUTH_TOKEN = response.data.access_token
    next()
  })
  .catch(function (error) {
    console.log(error);
    console.log('ERROR')
  })
}
const VideoRouter = require('./routes/videos.routes')
app.use('/api/video', VideoRouter)


const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`))

app.get('/', (req, res) => {
    res.send('API Status: Running')
  })