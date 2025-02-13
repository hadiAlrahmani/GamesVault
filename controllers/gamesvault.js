const Game = require('../models/game')

// retrieves and displays all public games on the home page
const home = async (req, res) => {
    try {
        const publicGames = await Game.find({ isPublic: true }).populate('owner', 'username')
        res.render('games/public-vault.ejs', { title: 'GamesVault', games: publicGames })
    } catch (error) {
        console.error('Error fetching public games for home page:', error)
        res.redirect('/')
    }
}

module.exports = { home }