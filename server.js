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

//! IMPORT MODELS
const Game = require('./models/game')

//! SET PORT
const port = process.env.PORT || 3000


mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', async () => {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`)
})

// FOR LOADING GAME 

// mongoose.connection.on('connected', async () => {
//     console.log(`Connected to MongoDB: ${mongoose.connection.name}`)

// try {
//     const games = await Game.find()
//     console.log('Games in Database:', games)
// } catch (error) {
//     console.error('Error fetching games:', error)
// }
// })

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
const isSignedIn = require('./middleware/is-signed-in')

app.use(passUserToView)


//! CONTROLLERS
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')
const gamesCtrl = require('./controllers/games')

//! ROUTES
app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/auth/sign-out', authCtrl.signOut)
app.get('/private-vault', gamesCtrl.privateVault)
app.get('/games/add', isSignedIn, gamesCtrl.addGameForm)
app.post('/games/add', isSignedIn, gamesCtrl.addGame)
app.get('/games/:id', gamesCtrl.getGameDetails)
app.get('/games/:id/edit', isSignedIn, gamesCtrl.editGameForm)
app.put('/games/:id', isSignedIn, gamesCtrl.updateGame)
app.delete('/games/:id', isSignedIn, gamesCtrl.deleteGame)


//! START THE SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})