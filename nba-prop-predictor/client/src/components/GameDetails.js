import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GameDetails = () => {
  const { team, team_opp, year, month, day } = useParams();
  const [odds, setOdds] = useState(null);
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
        setOdds(data.odds);
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

  if (!odds) {
    return <div>No odds data available</div>;
  }

  return (
    <div>
      <h2>{team} vs {team_opp}</h2>
      <p>Date: {`${month}/${day}/${year}`}</p>
      <div>
        <h3>Home Team: {odds.team}</h3>
        <p>Home Team Line: {odds.team_proj_total}</p>
        <p>Home Team Odds: {odds.team_total_odds}</p>
      </div>
      <div>
        <h3>Away Team: {odds.team_opp}</h3>
        <p>Away Team Line: {odds.team_opp_proj_total}</p>
        <p>Away Team Odds: {odds.team_opp_total_odds}</p>
      </div>
    </div>
  );
};

export default GameDetails;