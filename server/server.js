const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express()

mongoose.connect(process.env.DATABASE)
.then(() => console.log('DB connected'))
.catch(err => console.log(err))

mongoose.set("strictQuery", true);

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

if(process.env.NODE_ENV = 'development') {
    app.use(cors({origin: `${process.env.CLIENT_URL}`}))
}

app.use('/api', authRoutes)
app.use('/api', userRoutes)

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`API is running on port ${port}-${process.env.NODE_ENV}`)
})



