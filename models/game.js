const mongoose = require('mongoose')

const gamesSchema = new mongoose.Schema({
    name: String,
    genre: String,
    ReadToPlay: Boolean,
});





const Game = mongoose.model("Game", gamesSchema)


module.exports = Game;