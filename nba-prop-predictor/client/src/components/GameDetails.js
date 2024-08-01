import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GameDetails = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/game/${gameId}`)
      .then(response => response.json())
      .then(data => {
        setGame(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [gameId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{game.team} vs {game.team_opp}</h2>
      <p>Date: {game.date}</p>
      <p>More details...</p>
    </div>
  );
};

export default GameDetails;
