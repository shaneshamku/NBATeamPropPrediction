import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './GamesList.css';

const GamesList = ({ season, month, day }) => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (season && month && day) {
      fetch(`http://localhost:5000/games?season=${season}&month=${month}&day=${day}`)
        .then(response => response.json())
        .then(data => {
          // Filter out duplicate games
          const uniqueGames = [];
          const gameSet = new Set();
          
          data.forEach(game => {
            const gameKey = `${game.team} vs ${game.team_opp}`;
            const reverseGameKey = `${game.team_opp} vs ${game.team}`;
            
            if (!gameSet.has(gameKey) && !gameSet.has(reverseGameKey)) {
              gameSet.add(gameKey);
              uniqueGames.push(game);
            }
          });

          setGames(uniqueGames);
        })
        .catch(error => console.error('Error fetching games:', error));
      } else {
        setGames([]); // Clear the game list when dropdown values are reset
      }
    
  }, [season, month, day]);

  const handleGameClick = (game) => {
    navigate(`/game-details/${game.team}/${game.team_opp}/${game.year}/${game.month}/${game.day}`);
  };

  return (
    <div className="games-list">
      {games.map((game, index) => (
        <div key={index} className="game-box" onClick={() => handleGameClick(game)}>
          <h3>Game {index + 1}</h3>
          <p>{game.team} vs {game.team_opp}</p>
        </div>
      ))}
    </div>
  );
};

export default GamesList;
