import './App.css';
import {useState} from 'react';
import Login from './login';
import GetGameMode from './getGameMode';
import PlaySolo from './playSolo';
import PlayClassic from './playClassic';
import PlaySurvival from './playSurvival';

function App() {
  /**
   * Login control
   */
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  /**
   * Game mode selection
   */
  const [gameMode, setGameMode] = useState('UNK');

  return (
    <div>
      <header className="App">
          {gameMode !== 'SOLO' && <Login
           loggedIn={loggedIn}
           setLoggedIn={setLoggedIn}
           username={username}
           setUsername={setUsername}
          />}
          <GetGameMode
           loggedIn={loggedIn}
           gameMode={gameMode}
           setGameMode={setGameMode}
          />
          {gameMode === 'UNK' && <div className='ackNASPA'>
            <a href="http://www.scrabbleplayers.org"><img border="0" src="http://www.scrabbleplayers.org/pix/logo-only-160px.png" alt="[NASPA Logo]"/></a>
            <p>NWL2023 lexicon used with permission from NASPA</p>
            <p>ENABLE2K lexicon used for words longer than 15 letters</p>
          </div>}
          {gameMode === 'SOLO' && <PlaySolo
          />}
          {loggedIn && gameMode === 'CLASSIC' && <PlayClassic
           username={username}
          />}
          {loggedIn && gameMode === 'SURVIVAL' && <PlaySurvival
           username={username}
          />}
      </header>
    </div>
  );
}

export default App;
