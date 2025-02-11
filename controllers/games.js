const Game = require('../models/game')

const privateVault = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/sign-in')
    }

    try {
        const userGames = await Game.find({ owner: req.session.user._id })
        res.render('games/private-vault.ejs', {
            title: `${req.session.user.username}'s Private Vault`,
            games: userGames,
            user: req.session.user
        })
    } catch (error) {
        console.error('Error fetching games:', error)
        res.redirect('/')
    }
}

const addGameForm = (req, res) => {
    res.render('games/add-game.ejs', { title: 'Add Game' })
}

// Handle Game Submission
const addGame = async (req, res) => {
    try {
        await Game.create({
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            releaseYear: req.body.releaseYear,
            isPublic: req.body.isPublic === 'true', // Convert string to boolean
            owner: req.session.user._id
        })

        res.redirect('/private-vault')
    } catch (error) {
        console.error('Error adding game:', error)
        res.redirect('/games/add')
    }
}

const getGameDetails = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate('owner', '_id username')
        if (!game) {
            return res.redirect('/')
        }

        res.render('games/game-details.ejs', { 
            title: game.title, 
            game, 
            user: req.session.user
        })
    } catch (error) {
        console.error('Error fetching game details:', error)
        res.redirect('/')
    }
}

const editGameForm = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
        if (!game || game.owner.toString() !== req.session.user._id.toString()) {
            return res.redirect('/private-vault')
        }
        res.render('games/edit-game.ejs', { title: 'Edit Game', game })
    } catch (error) {
        console.error('Error fetching game for editing:', error)
        res.redirect('/private-vault')
    }
}

const updateGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
        if (!game || game.owner.toString() !== req.session.user._id.toString()) {
            return res.redirect('/private-vault')
        }

        game.title = req.body.title
        game.description = req.body.description
        game.image = req.body.image
        game.releaseYear = req.body.releaseYear
        game.isPublic = req.body.isPublic === 'true'

        await game.save()
        res.redirect(`/games/${game._id}`)
    } catch (error) {
        console.error('Error updating game:', error)
        res.redirect('/private-vault')
    }
}

const deleteGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
        if (!game || game.owner.toString() !== req.session.user._id.toString()) {
            return res.redirect('/private-vault')
        }

        await Game.findByIdAndDelete(req.params.id)
        res.redirect('/private-vault')
    } catch (error) {
        console.error('Error deleting game:', error)
        res.redirect('/private-vault')
    }
}

const publicVault = async (req, res) => {
    try {
        const publicGames = await Game.find({ isPublic: true }).populate('owner', 'username')
        res.render('games/public-vault.ejs', { title: 'GamesVault', games: publicGames })
    } catch (error) {
        console.error('Error fetching public games:', error)
        res.redirect('/')
    }
}


module.exports = { privateVault, addGameForm, addGame, getGameDetails, editGameForm, updateGame, deleteGame, publicVault }