const signUp = (req, res) => {
    res.render('auth/sign-up.ejs', { title: 'Sign Up', msg: '' })
}

const addUser = async (req, res) => {
    console.log('📝 Sign-Up Request Received');
    console.log('Form Data:', req.body);
    res.send('Sign-Up logic coming soon...');
}

module.exports = { signUp, addUser }