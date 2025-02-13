const Game = require('../models/game')

// retrieves and displays all public games on the home page
const home = async (req, res) => {
    try {
        const publicGames = await Game.find({ isPublic: true }).populate('owner', 'username')
        const shuffledGames = publicGames.sort(() => Math.random() - 0.5)
        res.render('games/public-vault.ejs', { title: 'GamesVault',
            // games: publicGames,
            games: shuffledGames
         })
    } catch (error) {
        console.error('Error fetching public games for home page:', error)
        res.redirect('/')
    }
}

module.exports = { home }