const Game = require("../models/game");

const getAllGames = async (req, res) => {
  try {
    const allGames = await Game.find();
    res.render("games/index", { games: allGames, message: "Want To Play" });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

const getOneGame = async (req, res) => {
  try {
    const foundGame = await Game.findById(req.params.id);
    const contextData = { game: foundGame };
    res.render("games/show", contextData);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

const getNewForm = (req, res) => {
  res.render("games/new");
};

const createGame = async (req, res) => {
  if (req.body.ReadyToPlay) {
    req.body.ReadyToPlay = true;
  } else {
    req.body.ReadyToPlay = false;
  }

  try {
    await Game.create(req.body);
    res.redirect("/games");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.redirect("/games");
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
};

const getEditForm = async (req, res) => {
  try {
    const gameToEdit = await Game.findById(req.params.gameId);
    res.render("games/edit", { game: gameToEdit });
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
};

const editGame = async (req, res) => {
  try {
    if (req.body.ReadyToPlay === "on") {
      req.body.ReadyToPlay = true;
    } else {
      req.body.ReadyToPlay = false;
    }

    await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.redirect(`/games/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/games/${req.params.id}`);
  }
};

module.exports = {
  getAllGames,
  getOneGame,
  createGame,
  deleteGame,
  editGame,
  getNewForm,
  getEditForm,
};
