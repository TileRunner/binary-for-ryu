import './App.css';
import {useState} from 'react';
import Login from './login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
return (
    <div>
      <header className="App">
          {loggedIn ?
          <div>Logged in</div>
          : <Login setLoggedIn={setLoggedIn} username={username} setUsername={setUsername} password={password} setPassword={setPassword}></Login>
          }
      </header>
    </div>
  );
}

export default App;
