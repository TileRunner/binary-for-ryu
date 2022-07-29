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
  const [password, setPassword] = useState("");
  /**
   * Game mode selection
   */
  const [gameMode, setGameMode] = useState('UNK');

  return (
    <div>
      <header className="App">
          <Login
           loggedIn={loggedIn}
           setLoggedIn={setLoggedIn}
           username={username}
           setUsername={setUsername}
           password={password}
           setPassword={setPassword}
          />
          {loggedIn && <GetGameMode
           gameMode={gameMode}
           setGameMode={setGameMode}
          />}
          {loggedIn && gameMode === 'SOLO' && <PlaySolo
           username={username}
           password={password}
          />}
          {loggedIn && gameMode === 'CLASSIC' && <PlayClassic
           username={username}
           password={password}
          />}
          {loggedIn && gameMode === 'SURVIVAL' && <PlaySurvival
           username={username}
           password={password}
          />}
      </header>
    </div>
  );
}

export default App;
