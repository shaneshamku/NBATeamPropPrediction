import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../App.css';
import GamesList from './GamesList';
import Dropdowns from './Dropdown'; // Ensure the file name is correct
import GameDetails from './GameDetails'; // Import GameDetails component

function App() {
  const [filters, setFilters] = useState({ season: '', month: '', day: '' });

  const handleFilterChange = (season, month, day) => {
    setFilters({ season, month, day });
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>NBA Prop Predictor</h1>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Dropdowns onFilterChange={handleFilterChange} filters={filters} />
                  <GamesList season={filters.season} month={filters.month} day={filters.day} />
                </>
              }
            />
            <Route path="/game-details/:team/:team_opp/:year/:month/:day" element={<GameDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
