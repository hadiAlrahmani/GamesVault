require('dotenv').config()

//! IMPORT PACKAGES
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')

//! SET PORT
const port = process.env.PORT || 3000


mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`)
})

//! MIDDLEWARE
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

// sessions allow users to stay logged in across different pages.
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
    }
}))

//! CUSTOM MIDDLEWARE
const passUserToView = require('./middleware/pass-user-to-view')
app.use(passUserToView)

//! CONTROLLERS
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')


//! ROUTES
app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)




//! START THE SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})