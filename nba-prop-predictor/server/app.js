const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://coolshane10:JOr13Tcf5FO2YQ4T@prod-nba-predictions.a5lnoxs.mongodb.net/NBATeamPropPrediction?retryWrites=true&w=majority&appName=prod-nba-predictions', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected successfully'))
.catch(error => console.error('MongoDB connection error:', error));


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
}, { collection: 'predictions' });

const oddsSchema = new mongoose.Schema({
  Date: Date,
  team: String,
  team_opp: String,
  team_proj_total: Number,
  team_opp_proj_total: Number,
  home_spread: Number,
  away_spread: Number,
  team_total_odds: Number,
  team_opp_total_odds: Number,
  game_proj_total: Number,
  HomeML_american: Number,
  AwayML_american: Number,
  HomeML_decimal: Number,
  AwayML_decimal: Number,
  oddsmakers_margin: Number,
  year: Number,
  month: Number,
  day: Number,
  
}, { collection: 'odds' });

const Game = mongoose.model('Game', gameSchema);
const Odds = mongoose.model('Odds', oddsSchema);


// Route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the NBA Predictions API!');
});


// Route to fetch games  based on season, month and day
app.get('/games', async (req, res) => {
  try {
    const { season, month, day } = req.query;
    console.log('Received query parameters:', { season, month, day });

    // Convert query parameters to integers
    const seasonInt = parseInt(season, 10);
    const monthInt = parseInt(month, 10);
    const dayInt = parseInt(day, 10);
    console.log('Converted query parameters:', { season: seasonInt, month: monthInt, day: dayInt });

    const games = await Game.find({ season: seasonInt, month: monthInt, day: dayInt });
    console.log('Games found:', games);
    res.json(games);

} catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: error.message });
}
});

// Route to fetch available months based on season
app.get('/months', async (req, res) => {
  const { season } = req.query;
  try {
    const seasonInt = parseInt(season, 10);
    console.log(`Fetching months for season: ${seasonInt}`);
    const games = await Game.find({ season: seasonInt }).distinct('month');
    const months = games.sort((a, b) => a - b);
    console.log(`Available months: ${months}`);
    res.json(months);
  } catch (error) {
    console.error('Error fetching months:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Endpoint to get available days
app.get('/days', async (req, res) => {
  const { season, month } = req.query;
  try {
    const seasonInt = parseInt(season, 10);
    const monthInt = parseInt(month, 10);
    const games = await Game.find({  season: seasonInt, month: monthInt });
    const days = [...new Set(games.map(game => game.day))].sort((a, b) => a - b); // Get unique days and sort them
    res.json(days);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to fetch game and odds details based on game parameters
app.get('/game-details', async (req, res) => {
  const { team, team_opp, year, month, day } = req.query;
  console.log('Received query parameters:', { team, team_opp, year, month, day });

  try {
    // const game = await Game.findOne({ team, team_opp, year: parseInt(year), month: parseInt(month), day: parseInt(day) });
    // if (!game) {
    //   return res.status(404).json({ message: 'Game not found' });
    // }

    const odds = await Odds.findOne({ team, team_opp, year: parseInt(year), month: parseInt(month), day: parseInt(day) });
    console.log('Odd Details found:', odds);
    if (!odds) {
      return res.status(404).json({ message: 'Odds not found' });
    }

    const homeGame = await Game.findOne({ team, year: parseInt(year), month: parseInt(month), day: parseInt(day) });
    console.log('Home Game found:', homeGame);

    const awayGame = await Game.findOne({ team: team_opp, year: parseInt(year), month: parseInt(month), day: parseInt(day) });
    console.log('Away Game found:', awayGame);



    res.json({ odds, homeGame, awayGame });
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
