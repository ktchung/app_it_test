import React from 'react';
import logo from './logo.svg';
import './App.css';

import GameBoard from './GameBoard.js';
import HighScore from './HighScore.js';

function App() {
  return (
    <div className="App">
      <div className="logo">
        Logo
      </div>
      <GameBoard onFinish={handleFinished} />
      <HighScore />
    </div>
  );
}

const handleFinished = (name, score) => {
  console.log(name, "scored", score);
};

export default App;
