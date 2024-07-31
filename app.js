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

const Game = mongoose.model('Game', gameSchema);

// Route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the NBA Predictions API!');
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));