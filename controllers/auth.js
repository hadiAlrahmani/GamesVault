const bcrypt = require('bcrypt')
const User = require('../models/user')

const signUp = (req, res) => {
    res.render('auth/sign-up.ejs', { title: 'Sign Up', msg: '' })
}

const addUser = async (req, res) => {
    console.log('Sign-Up Request Received:', req.body)

    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
        return res.render('auth/sign-up.ejs', {
            title: 'Sign Up',
            msg: 'Username already taken. Try another one.'
        })
    }

    const emailInDatabase = await User.findOne({ email: req.body.email })
    if (emailInDatabase) {
        return res.render('auth/sign-up.ejs', {
            title: 'Sign Up',
            msg: 'Email already in use. Try another one.'
        })
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })

    // Automatically log in the user
    req.session.user = user

    // Redirect to home page after sign-up
    req.session.save(() => {
        res.redirect('/')
    })
}

const signInForm = (req, res) => {
    res.render('auth/sign-in.ejs', { title: 'Sign In', msg: '' })
}

// Handle User Logout
const signOut = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid') // Clears session cookie
        res.redirect('/') // Redirects back to the homepage
    })
}

// Handle Sign-In Form Submission
const signIn = async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username })

    if (!userInDatabase) {
        return res.render('auth/sign-in.ejs', {
            title: 'Sign In',
            msg: 'Invalid credentials. Please try again.'
        })
    }

    // Check if the entered password matches the stored hashed password
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)

    if (!validPassword) {
        return res.render('auth/sign-in.ejs', {
            title: 'Sign In',
            msg: 'Invalid credentials. Please try again.'
        })
    }

    // If credentials are correct, log in the user
    req.session.user = userInDatabase

    req.session.save(() => {
        res.redirect('/')
    })
}

module.exports = { signUp, addUser, signInForm, signIn, signOut }



