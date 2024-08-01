import React, { useEffect, useState } from 'react';
import './GamesList.css';

const GamesList = ({ season, month, day }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (season && month && day) {
      fetch(`http://localhost:5000/games?season=${season}&month=${month}&day=${day}`)
        .then(response => response.json())
        .then(data => setGames(data))
        .catch(error => console.error('Error fetching games:', error));
    }
  }, [season, month, day]);

  return (
    <div className="games-list">
      {games.map((game, index) => (
        <div key={index} className="game-box">
          <h3>Game {index + 1}</h3>
          <p>{game.team} vs {game.team_opp}</p>
        </div>
      ))}
    </div>
  );
};

export default GamesList;