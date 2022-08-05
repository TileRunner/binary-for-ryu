import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { isWordValid } from "./wordFunctions";
import InputWord from "./inputWord";
const baseurl = 'https://enigmatic-lake-42795.herokuapp.com'; //'http://localhost:5000'; 

const PlaySurvival = ({username}) => {
    const [infoMsg, setInfoMessage] = useState('Loading...');
    const [gamelist, setGamelist] = useState([]);
    const [gamedata, setGamedata] = useState({});
    const [inlobby, setInlobby] = useState(true);
    const [myword, setMyword] = useState('');

    async function refreshGamelist() {
        let url = `${baseurl}/fyb/listgames?type=SURVIVAL`;
        const response = await fetch(url);
        const jdata = await response.json();
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamelist(jdata);
            setInfoMessage(`List loaded at ${formatTime(Date.now())}`);
        }
    }
    async function refreshGamedata() {
        let url = `${baseurl}/fyb/getgame?number=${gamedata.number}`;
        const response = await fetch(url);
        const jdata = await response.json();
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setInfoMessage(`Game loaded at ${formatTime(Date.now())}`);
        }
    }
    useEffect(() => {
        refreshGamelist();
    },[]);
    async function createNewGame() {
        let url = `${baseurl}/fyb/creategame?type=SURVIVAL&name=${username}`;
        const response = await fetch(url);
        const jdata = await response.json();
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setInlobby(false);
            setInfoMessage('Game created');
        }
    }
    async function joinGame(gamenumber) {
        let url = `${baseurl}/fyb/joingame?number=${gamenumber}&name=${username}`;
        const response = await fetch(url);
        const jdata = await response.json();
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setInlobby(false);
            setInfoMessage('Game joined');
        }
    }
    async function startGame() {
        let url = `${baseurl}/fyb/startgame?number=${gamedata.number}`;
        const response = await fetch(url);
        const jdata = await response.json();
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setInfoMessage('Game started');
        }
    }
    const formatTime = (t) => {
        let d = new Date(t);
        let yyyy = d.getFullYear().toString();
        let mth = (d.getMonth() + 1).toString();
        if (mth.length < 2) { mth = '0' + mth; }
        let dd = d.getDate().toString();
        if (dd.length < 2) { dd = '0' + dd; }
        let h = d.getHours();
        let ampm = ' AM';
        if (h > 12) {
            h = h - 12;
            ampm = ' PM';
        }
        let hh = h.toString();
        if (h < 10) { hh = '0' + hh; }
        let m = d.getMinutes();
        let mm = m.toString();
        if (m < 10) { mm = '0' + mm; }
        let s = d.getSeconds();
        let ss = s.toString();
        if (s < 10) { ss = '0' + ss; }
        let f = `${yyyy}-${mth}-${dd} @${hh}:${mm}:${ss} ${ampm}`;
        return f;
    }
    const ShowGameList = <div>
        <p>Number of games: {gamelist.length}</p>
        <Table striped bordered hover size="sm" variant="dark" responsive="sm">
            <thead>
                <tr>
                    <th>Game #</th>
                    <th>Created By</th>
                    <th>Create Time</th>
                    <th># Players</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {gamelist.map((game,index) => (
                <tr key={`gamelist${game.number}`}>
                    <td>{game.number}</td>
                    <td>{game.creator}</td>
                    <td>{formatTime(game.createTime)}</td>
                    <td>{game.numPlayers}</td>
                    <td>{game.finished ? 'Finished' : game.started ? 'In Progress' : 'Not Started'}</td>
                    <td>
                        <Button key={`joinbutton${game.number}`}
                        onClick={() => {joinGame(game.number);}}>
                            Join
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
        <Button onClick={() => {refreshGamelist();}}>
            Refresh Game List
        </Button>
        <Button onClick={() => {createNewGame();}}>
            Create Game
        </Button>
    </div>
    function meToMove() {
        if (!gamedata.started) {return false;}
        for (let index = 0; index < gamedata.players.length; index++) {
            const player = gamedata.players[index];
            if (player.name === username) {
                return player.tomove;
            }
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();
        let url = `${baseurl}/fyb/makemove?number=${gamedata.number}&name=${username}`;
        if (myword) {
            let valid = await isWordValid(myword);
            if (valid) {
                url = `${url}&type=VALID&word=${myword}`;
            } else {
                url = `${url}&type=PHONY&word=${myword}`;
            }   
        } else {
            url = `${url}&type=PASS`
        }
        const response = await fetch(url);
        const jdata = await response.json();
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setInfoMessage(`${username} made a move`);
        }
    }
    async function playAgain() {
        let url = `${baseurl}/fyb/playagain?number=${gamedata.number}`;
        const response = await fetch(url);
        const jdata = await response.json();
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setInfoMessage(`${username} restarted the game`);
        }
    }
    function movetext(round, player) {
        if (!round.moves.length) {return 'N/A';}
        let foundmoves = round.moves.filter(move => {return move.name === player.name;});
        if (foundmoves.length) {
            let foundmove = foundmoves[0];
            if (!gamedata.finished) { return foundmove.type; }
            if (foundmove.type === 'PASS') { return 'PASS';}
            if (foundmove.type === 'PHONY') { return `Phony: ${foundmove.word.toLowerCase()}`;}
            if (foundmove.type === 'VALID') { return `Valid: ${foundmove.word.toUpperCase()}`;}
        }
        return 'n/a';
    }
    const ShowGame = <div>
        <Row>
            <Col>Game Number: {gamedata.number}</Col>
            <Col>Creator: {gamedata.creator}</Col>
            <Col>Created: {formatTime(gamedata.createTime)}</Col>
        </Row>
        {!gamedata.started &&
        <Button onClick={() => {startGame();}}>
            Start Game
        </Button>
        }
        {gamedata.started &&
        <Row>
            <Col>Round: {gamedata.round}</Col>
            <Col>Fry Letters: {gamedata.letters.slice(0,2+gamedata.round).join("").toUpperCase()}</Col>
            {meToMove() && <Col>
                <InputWord
                myword={myword}
                setMyword={setMyword}
                handleSubmit={handleSubmit}
                />
            </Col>
            }
        </Row>
        }
        {gamedata.started && <Table>
            <thead>
                <tr>
                    <th>Round</th>
                    <th>Letters</th>
                    {gamedata.players.map((player) => (
                        <th key={`headerplayer${player.name}`}>
                            {player.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {gamedata.rounds.map((round,index) => (
                <tr key={`roundindex${index}`}>
                    <td>{index+1}</td>
                    <td>{gamedata.letters.slice(0,index+3)}</td>
                    {gamedata.players.map((player) => (
                        <td key={`${player.name}`}>
                            {movetext(round,player)}
                        </td>
                    ))}
                </tr>
                ))}
                <tr>
                    <td></td>
                    <td></td>
                    {gamedata.players.map((player) => (
                        <td key={`dataplayer${player.name}`}>
                            {gamedata.started ?
                                player.alive ?
                                    player.tomove ?
                                        <span> To move...</span>
                                    :
                                        <span> Survived!</span>
                                :
                                    <span> Eliminated!</span>
                            :
                                <span>...</span>
                            }
                        </td>
                    ))}
                </tr>
            </tbody>
        </Table>}
        <Row>
            <Col>
                <Button onClick={() => {refreshGamedata();}}>
                    Refresh Game Data
                </Button>
            </Col>
            {gamedata.started && gamedata.finished &&
            <Col>
                <span>Game Over! </span>
                <Button onClick={() => {playAgain();}}>
                    Play Again
                </Button>
            </Col>
            }
        </Row>
    </div>
    return <div className="PlaySurvival">
        <h1>Survival Game</h1>
        <p>Info: {infoMsg}</p>
        {inlobby ? ShowGameList : ShowGame}
    </div>;
}

export default PlaySurvival;