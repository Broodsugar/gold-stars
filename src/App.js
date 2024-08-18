import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('input');
  const [scores, setScores] = useState(() => {
    // Load scores from localStorage if available
    const savedScores = localStorage.getItem('scores');
    return savedScores ? JSON.parse(savedScores) : {};
  });
  const [lastReset, setLastReset] = useState(() => {
    // Load last reset date from localStorage if available
    return localStorage.getItem('lastReset');
  });

  useEffect(() => {
    // Save scores to localStorage whenever they change
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    // Save last reset date to localStorage whenever it changes
    if (lastReset) {
      localStorage.setItem('lastReset', lastReset);
    }
  }, [lastReset]);

  const handleTabSwitch = (tab) => {
    setCurrentTab(tab);
  };

  const handleResetScores = () => {
    setScores({});
    const resetDate = new Date().toLocaleString();
    setLastReset(resetDate);
    localStorage.setItem('lastReset', resetDate); // Save immediately after resetting
  };

  return (
    <div className="App">
      <nav>
        <button onClick={() => handleTabSwitch('input')}>Input</button>
        <button onClick={() => handleTabSwitch('highscore')}>High Score</button>
      </nav>
      {currentTab === 'input' && <InputTab setScores={setScores} scores={scores} />}
      {currentTab === 'highscore' && 
        <HighScoreTab 
          scores={scores} 
          lastReset={lastReset} 
          handleResetScores={handleResetScores} 
        />}
    </div>
  );
}


function InputTab({ setScores, scores }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input) {
      setScores(prevScores => {
        const newScores = { ...prevScores };
        newScores[input] = (newScores[input] || 0) + 1;
        return newScores;
      });
      setInput('');
    }
  };

  return (
    <div>
      <label>Who did great?</label>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

function HighScoreTab({ scores, lastReset, handleResetScores }) {
  const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);

  return (
    <div>
      <h2>High Scores</h2>
      {sortedScores.length > 0 ? (
        <ul>
          {sortedScores.map(([name, score]) => (
            <li key={name}>{name}: {score}</li>
          ))}
        </ul>
      ) : (
        <p>No entries yet</p>
      )}
      <button onClick={handleResetScores}>Reset Scores</button>
      {lastReset && <p>Date of Last Reset: {lastReset}</p>}
    </div>
  );
}


export default App;
