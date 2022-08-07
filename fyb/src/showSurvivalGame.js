import { useState, useEffect, useRef } from "react";
import InputWord from "./inputWord";
import { callApi, isWordValid } from "./callApi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import { formatTime } from "./formatTime";
import ShowFryLetters from "./showFryLetters";
import { usePrevious } from "./usePrevious";

const ShowSurvivalGame = ({gamenumber, username}) => {
    const [infoMsg, setInfoMessage] = useState('Loading...');
    const [gamedata, setGamedata] = useState({});
    const [myword, setMyword] = useState('');
    const [fryLetters, setFryLetters] = useState([]);
    const [selected, setSelected] = useState(-1);
    const prevGamedata = usePrevious(gamedata);
    const hasFetchedData = useRef(false);
    async function startGame() {
        let jdata = await callApi(`startgame?number=${gamenumber}`);
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setFryLetters(jdata.letters.slice(0,jdata.round+2));
            setInfoMessage('Game started');
        }
    }
    function meToMove() {
        if (!gamedata.started || gamedata.finished) {return false;}
        for (let index = 0; index < gamedata.players.length; index++) {
            const player = gamedata.players[index];
            if (player.name === username) {
                return player.tomove;
            }
        }
    }
    async function handleSubmit() {
        let route = `makemove?number=${gamenumber}&name=${username}`;
        if (myword) {
            let valid = await isWordValid(myword);
            if (valid) {
                route = `${route}&type=VALID&word=${myword}`;
            } else {
                route = `${route}&type=PHONY&word=${myword}`;
            }   
        } else {
            route = `${route}&type=PASS`
        }
        let jdata = await callApi(route);
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setFryLetters(jdata.letters.slice(0,jdata.round+2));
            selected(-1);
            setInfoMessage(`${username} made a move`);
        }
    }
    async function playAgain() {
        let jdata = await callApi(`playagain?number=${gamenumber}`);
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setFryLetters(jdata.letters.slice(0,jdata.round+2));
            setSelected(-1);
            setInfoMessage(`${username} restarted the game`);
        }
    }
    function movetext(round, player) {
        if (!round.moves.length) {return 'N/A';}
        let foundmoves = round.moves.filter(move => {return move.name === player.name;});
        if (foundmoves.length) {
            let foundmove = foundmoves[0];
            if (!gamedata.finished && player.name !== username) { return foundmove.type; }
            if (foundmove.type === 'PASS') { return 'PASS';}
            if (foundmove.type === 'PHONY') { return `Phony: ${foundmove.word.toLowerCase()}`;}
            if (foundmove.type === 'VALID') { return `Valid: ${foundmove.word.toUpperCase()}`;}
        }
        return 'n/a';
    }
    useEffect(() => {
        async function fetchData() {
            // If I call refreshGamedata, which has this same code, compiler complains about refreshGamedata not being a dependancy
            let jdata = await callApi(`getgame?number=${gamenumber}`);
            if (jdata.error) {
                console.log(`fetch error at ${formatTime(Date.now())}: ${jdata.error}`);
                setInfoMessage(jdata.error);
            } else {
                if (jdata.started && (!prevGamedata || prevGamedata.round !== jdata.round)) {
                    setFryLetters(jdata.letters.slice(0,jdata.round+2));
                    setSelected(-1);
                }
                setGamedata(jdata);
                setInfoMessage(`Game loaded at ${formatTime(Date.now())}`);
            }
        }
        if (!hasFetchedData.current) {
            fetchData();
            hasFetchedData.current = true;
        }
        const timer = setInterval(() => {
            fetchData();
          },10000); // every 10 seconds
        return () => clearInterval(timer);
    });
    return (<div>
        <p>Info: {infoMsg}</p>
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
            <Col xs={2}>Round: {gamedata.round}</Col>
            <Col xs={6}>
                <ShowFryLetters fryLetters={fryLetters} selected={selected} setFryLetters={setFryLetters} setSelected={setSelected}/>
            </Col>
            {meToMove() && <Col>
                <InputWord
                myword={myword}
                setMyword={setMyword}
                handleSubmit={handleSubmit}
                fryLetters={fryLetters}
                />
            </Col>
            }
        </Row>
        }
        {gamedata.started && <Table size="sm">
            <thead>
                <tr>
                    <th>Round</th>
                    <th>Letters</th>
                    {gamedata && gamedata.players && gamedata.players.length && gamedata.players.map((player) => (
                        <th key={`headerplayer${player.name}`}>
                            {player.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {gamedata.rounds && gamedata.rounds.length && gamedata.rounds.map((round,index) => (
                <tr key={`roundindex${index}`}>
                    <td>{index+1}</td>
                    <td>{gamedata.letters.slice(0,index+3)}</td>
                    {gamedata.players && gamedata.players.length && gamedata.players.map((player) => (
                        <td key={`${player.name}`}>
                            {movetext(round,player)}
                        </td>
                    ))}
                </tr>
                ))}
                <tr>
                    <td></td>
                    <td></td>
                    {gamedata.players && gamedata.players.length && gamedata.players.map((player) => (
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
        {!gamedata.started && gamedata.players && gamedata.players.length && <Row>
        {gamedata.players.map((player) => (
            <Col key={player.name}>{player.name}</Col>
        ))}
        </Row>}
        <Row>
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
    );
}

export default ShowSurvivalGame;