const User = require('../models/user')

const viewProfile = async (req, res) => {
    // let user = { username: 'Nabila'}
    // res.send('Hi World :)')
   try {
    const UserDetails = await User.findById(req.session.user._id)
    console.log(UserDetails)
    res.render('user/profile.ejs', {
        title: 'User Profile',
        username: UserDetails.username,
        email: UserDetails.email,
    })
} catch (error) {
    console.error('Error fetching user details:', error)
    res.redirect('/')
}
}
module.exports = {
    viewProfile
}