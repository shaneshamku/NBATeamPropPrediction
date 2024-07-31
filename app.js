const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://coolshane10:JOr13Tcf5FO2YQ4T@prod-nba-predictions.a5lnoxs.mongodb.net/?retryWrites=true&w=majority&appName=prod-nba-predictions', { useNewUrlParser: true, useUnifiedTopology: true });

const gameSchema = new mongoose.Schema({
    team: String,
    team_opp: String,
    season: Number,
    year: Number,
    month: Number,
    day: Number,
    date: Date,
    prediction_adj: Number,
    prediction: Number,
    actual: Number,
});

const Game = mongoose.model('Game', gameSchema);

app.get('/games', async (req, res) => {
  const { season, month, day } = req.query;
  const games = await Game.find({ season, month, day });
  res.json(games);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));