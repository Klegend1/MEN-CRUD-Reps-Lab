const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const gameController = require("./controllers/games.js")
//const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

const Game = require("./models/game");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

//app.use(express.static(path.join(_dirname, "public")));


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/games/new", (req, res) => {
  res.render("games/new");
});

app.get("/games/:id", async (req, res) => {
  try {
    const foundGame = await Game.findById(req.params.id);
    const contextData = { game: foundGame };
    res.render("games/show", contextData);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get("/games", async (req, res) => {
  try {
    const allGames = await Game.find();
    res.render("games/index", { games: allGames, message: "Play" });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.post("/games", async (req, res) => {
  if (req.body.ReadyToPlay) {
    req.body.ReadyToPlay = true;
  } else {
    req.body.ReadyToPlay = false;
  }

  try {
    await Game.create(req.body);
    res.redirect("/games/new?status=success");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/games/:id", async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    console.log(deletedGame, "response from db after deletion");
    res.redirect("/games");
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
});

app.get("/games/:gameId/edit", async (req, res) => {
  try {
    const gameToEdit = await Game.findById(req.params.gameId);
    res.render("games/edit", { game: gameToEdit });
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
});

app.put("/games/:id", async (req, res) => {
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
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/games/new", gameController.getNewForm);

app.get("/games", gameController.getAllGames)

app.get("/games/:id", gameController.getOneGame );

app.post("/games",gameController.createGame );

app.delete("/games/:id", gameController.deleteGame );

app.get("/games/:gameId/edit", gameController.getEditForm);

app.put("/games/:id",gameController.editGame);


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
