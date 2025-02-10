const home = (req, res) => {
    res.render('index.ejs', { title: 'GamesVault' })
}

module.exports = {
    home,
}