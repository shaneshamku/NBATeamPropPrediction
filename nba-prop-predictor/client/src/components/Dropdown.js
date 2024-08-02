import React, { useState, useEffect } from 'react';

const Dropdowns = ({ onFilterChange, filters }) => {
  const [season, setSeason] = useState(filters.season);
  const [month, setMonth] = useState(filters.month);
  const [day, setDay] = useState(filters.day);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);

  const seasons = ['2018', '2019', '2020', '2021', '2022'];

  // Mapping month numbers to names
  const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  };

  // Order of months for NBA season
  const nbaSeasonOrder = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    if (season) {
      fetch(`http://localhost:5000/months?season=${season}`)
        .then(response => response.json())
        .then(data => {
          // Sort months based on NBA season order
          const sortedMonths = data.sort((a, b) => nbaSeasonOrder.indexOf(a) - nbaSeasonOrder.indexOf(b));
          setAvailableMonths(sortedMonths);
        })
        .catch(error => console.error('Error fetching months:', error));
    }
  }, [season]);
  
  useEffect(() => {
    if (season && month) {
      // Fetch available days based on season and month
      fetch(`http://localhost:5000/days?season=${season}&month=${month}`)
        .then(response => response.json())
        .then(data => setAvailableDays(data))
        .catch(error => console.error('Error fetching days:', error));
    }
  }, [season, month]);

  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
    setMonth('');
    setDay('');
    setAvailableMonths([]);
    setAvailableDays([]);
    onFilterChange(e.target.value, '', '');
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setDay('');
    setAvailableDays([]);
    onFilterChange(season, e.target.value, '');
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
    onFilterChange(season, month, e.target.value);
  };

  return (
    <div>
      <select value={season} onChange={handleSeasonChange}>
        <option value="">Select Season</option>
        {seasons.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select value={month} onChange={handleMonthChange} disabled={!season}>
        <option value="">Select Month</option>
        {availableMonths.map(m => (
          <option key={m} value={m}>{monthNames[m]}</option>
        ))}
      </select>
      <select value={day} onChange={handleDayChange} disabled={!month}>
        <option value="">Select Day</option>
        {availableDays.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );
};

export default Dropdowns;
