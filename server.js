require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

//---------------------------------------END OF IMPORTS-----------------------------------------


mongoose.connect(process.env.MONGO_URI,{ useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
mongoose.set('useCreateIndex', true)
db.on('error', (error)=> console.error(error))
db.once('open', ()=>console.log("Connected to DB."))
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`))

//---------------------------------------END OF DB CONNECTION-----------------------------------------
var corsOptions = {
  origin: process.env.WEB_HOST,
  credentials: true };
app.use(express.json())
//app.use(cors(corsOptions))
app.use(fileUpload())
app.use(cookieParser())
app.options('*',cors(corsOptions))
//---------------------------------------END OF MIDDLEWARE-----------------------------------------
app.get('/', (req, res) => {res.send('API Status: Running')})

const UserRouter = require('./routes/users.routes')
app.use('/api/user', UserRouter)

const VideoRouter = require('./routes/videos.routes')
app.use('/api/video', VideoRouter)
//---------------------------------------END OF ROUTES-----------------------------------------


