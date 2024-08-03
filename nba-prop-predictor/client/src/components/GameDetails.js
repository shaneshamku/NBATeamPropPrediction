import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GameDetails.css'; // Make sure to import the CSS file

// Team colors legend
const teamColors = {
  ATL: '#e03a3e',
  BOS: '#007A33',
  CHA: '#1D1160',
  CHI: '#CE1141',
  CLE: '#860038',
  DAL: '#00538C',
  DEN: '#FEC524',
  DET: '#C8102E',
  GSW: '#1D428A',
  HOU: '#CE1141',
  IND: '#002D62',
  LAC: '#bec0c2',
  LAL: '#552583',
  MEM: '#5D76A9',
  MIA: '#98002E',
  MIL: '#00471B',
  MIN: '#0C2340',
  NOP: '#85714D',
  NYK: '#006BB6',
  BKN: '#000000',
  OKC: '#007AC1',
  ORL: '#0077C0',
  PHI: '#006bb6',
  PHX: '#e56020',
  POR: '#E03A3E',
  SAC: '#5A2D81',
  TOR: '#CE1141',
  UTA: '#002B5C',
  WAS: '#002B5C'
};

// Bet rating calculation function
function calculateBetRating(bettingLine, modelPrediction, oddsHigher, oddsLower) {
  const difference = modelPrediction - bettingLine;
  const avgOdds = (oddsHigher + oddsLower) / 2;

  let strengthFactor = 0;
  if (Math.abs(difference) >= 10) {
    strengthFactor = 2.5;
  } else if (Math.abs(difference) >= 8) {
    strengthFactor = 2;
  } else if (Math.abs(difference) >= 6) {
    strengthFactor = 1.5;
  } else if (Math.abs(difference) >= 4) {
    strengthFactor = 1;
  } else if (Math.abs(difference) >= 2) {
    strengthFactor = 0.5;
  } else {
    strengthFactor = 0.1;
  }

  let betRating = Math.abs(difference) * strengthFactor * avgOdds;
  if (betRating > 8.5 && betRating < 10) betRating = 9.5;
  if (betRating >= 10) betRating = 10;
  if (betRating < 3) betRating = betRating + 1;
  betRating = (betRating / 1.2).toFixed(1); // Scale back ratings by 20%

  let recommendation = '';
  if (betRating >= 9) {
    recommendation = 'Elite';
  } else if (betRating >= 8) {
    recommendation = 'Very Strong';
  } else if (betRating >= 7) {
    recommendation = 'Strong';
  } else if (betRating >= 6) {
    recommendation = 'Good';
  } else if (betRating >= 4) {
    recommendation = 'Average';
  } else if (betRating >= 2) {
    recommendation = 'Weak';
  } else {
    recommendation = 'Very Weak';
  }

  return { betRating, recommendation };
}

// Function to get color based on bet rating
function getBetRatingColor(betRating) {
  if (betRating >= 9) return '#006400'; // Dark green
  if (betRating >= 8) return '#228B22'; // Forest green
  if (betRating >= 7) return '#32CD32'; // Lime green
  if (betRating >= 6) return '#ADFF2F'; // Green yellow
  if (betRating >= 4) return '#FFD700'; // Gold
  if (betRating >= 2) return '#FFA500'; // Orange
  return '#FF4500'; // Orange red
}

const GameDetails = () => {
  const { team, team_opp, year, month, day } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGameDetails = (team, team_opp, year, month, day, retry = false) => {
    const url = `http://localhost:5000/game-details?team=${team}&team_opp=${team_opp}&year=${year}&month=${month}&day=${day}`;
    console.log('Fetching URL:', url); // Log the URL
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setDetails(data);
        setLoading(false);
      })
      .catch(error => {
        if (!retry) {
          // Retry with reversed parameters
          fetchGameDetails(team_opp, team, year, month, day, true);
        } else {
          setError(error);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (team && team_opp && year && month && day) {
      fetchGameDetails(team, team_opp, year, month, day);
    } else {
      setLoading(false);
      setError(new Error('Invalid game details'));
    }
  }, [team, team_opp, year, month, day]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!details) {
    return <div>No data available</div>;
  }

  const { odds, homeGame, awayGame } = details;

  const roundedHomePredictionAdj = homeGame ? Math.round(homeGame['prediction adj']) : 'N/A';
  const roundedAwayPredictionAdj = awayGame ? Math.round(awayGame['prediction adj']) : 'N/A';

  const homeBet = calculateBetRating(odds.team_proj_total, roundedHomePredictionAdj, odds.team_total_odds, odds.team_total_odds);
  const awayBet = calculateBetRating(odds.team_opp_proj_total, roundedAwayPredictionAdj, odds.team_opp_total_odds, odds.team_opp_total_odds);

  return (
    <div className="game-details">
      <h2>{team} vs {team_opp}</h2>
      <p>Date: {`${month}/${day}/${year}`}</p>
      <div className="grid-container">
        <div className="grid-item" style={{ backgroundColor: teamColors[team] }}>{team}</div>
        <div className="grid-item" style={{ backgroundColor: teamColors[team_opp] }}>{team_opp}</div>
        <div className="grid-item" style={{ backgroundColor: teamColors[team] }}>Line: {odds.team_proj_total} PTS</div>
        <div className="grid-item" style={{ backgroundColor: teamColors[team_opp] }}>Line: {odds.team_opp_proj_total} PTS</div>
        <div className="grid-item" style={{ backgroundColor: teamColors[team] }}>
          <div>Odds Over: {odds.team_total_odds}</div>
          <div>Odds Under: {odds.team_opp_total_odds}</div>
        </div>
        <div className="grid-item" style={{ backgroundColor: teamColors[team_opp] }}>
          <div>Odds Over: {odds.team_opp_total_odds}</div>
          <div>Odds Under: {odds.team_total_odds}</div>
        </div>
        <div
          className="grid-item bottom-row"
          style={{ backgroundColor: getBetRatingColor(homeBet.betRating) }}
        >
          <div>{team} Projected PTS: {roundedHomePredictionAdj}</div>
          <div>Recommendation: Bet {roundedHomePredictionAdj > odds.team_proj_total ? 'Over' : 'Under'}</div>
          <div>Bet Rating: {homeBet.betRating}/10</div>
          <div>{homeBet.recommendation}</div>
        </div>
        <div
          className="grid-item bottom-row"
          style={{ backgroundColor: getBetRatingColor(awayBet.betRating) }}
        >
          <div>{team_opp} Projected PTS: {roundedAwayPredictionAdj}</div>
          <div>Recommendation: Bet {roundedAwayPredictionAdj > odds.team_opp_proj_total ? 'Over' : 'Under'}</div>
          <div>Bet Rating: {awayBet.betRating}/10</div>
          <div>{awayBet.recommendation}</div>
        </div>
      </div>
      <button onClick={() => window.history.back()}>Back</button>
    </div>
  );
};

export default GameDetails;