import { useState, useEffect, useRef } from "react";
import InputWord from "./inputWord";
import { callMakeMove, callStartGame, callPlayAgain, callGetGame } from "./callApi";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ShowFryLetters from "./showFryLetters";

const ShowSurvivalGame = ({gamenumber, username}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [gamedata, setGamedata] = useState({});
    const [myword, setMyword] = useState('');
    const hasFetchedData = useRef(false);
    async function startGame() {
        let jdata = await callStartGame(gamenumber);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setErrorMessage('');
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
    async function handleSubmit(myword, valid, timedout) {
        let type = '';
        if (timedout) {
            type = 'TIMEOUT';
        } else if (!myword) {
            type = 'PASS';
        } else if (valid) {
            type = 'VALID';
        } else {
            type = 'PHONY';
        }   
        let jdata = await callMakeMove(gamenumber, username, type, myword);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setErrorMessage('');
        }
    }
    async function playAgain() {
        let jdata = await callPlayAgain(gamenumber);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setErrorMessage('');
        }
    }
    function movetext(round, player) {
        if (!round.moves.length) {return 'N/A';}
        let foundmoves = round.moves.filter(move => {return move.name === player.name;});
        if (foundmoves.length) {
            let foundmove = foundmoves[0];
            if (!gamedata.finished && player.name !== username) { return foundmove.type; }
            if (foundmove.type === 'PASS') { return 'PASS';}
            if (foundmove.type === 'TIMEOUT') { return 'TIMED OUT';}
            return foundmove.word.toUpperCase();
        }
        return 'n/a';
    }
    function moveclass(round, player) {
        if (!round.moves.length) {return '';}
        let foundmoves = round.moves.filter(move => {return move.name === player.name;});
        if (foundmoves.length) {
            let foundmove = foundmoves[0];
            return `moveis${foundmove.type.toLowerCase()}`;
        }
        return '';
    }
    function getmyprevword() {
        let roundindex = gamedata.rounds.length - 1;
        if (roundindex === 0) {return '';}
        let foundmoves = gamedata.rounds[roundindex-1].moves.filter(move => {return move.name === username;});
        if (foundmoves.length) {
            return foundmoves[0].word;
        }
        return '';
    }
    useEffect(() => {
        async function fetchData() {
            // If I call refreshGamedata, which has this same code, compiler complains about refreshGamedata not being a dependancy
            let jdata = await callGetGame(gamenumber);
            if (jdata.error) {
                setErrorMessage(jdata.error);
            } else if (JSON.stringify(jdata) !== JSON.stringify(gamedata)) {
                setGamedata(jdata);
                setErrorMessage('');
            }
        }
        if (!hasFetchedData.current) {
            fetchData();
            hasFetchedData.current = true;
        }
        const timer = setInterval(() => {
            fetchData();
          },3000); // every 3 seconds
        return () => clearInterval(timer);
    });
    return (<div>
        {errorMessage && <Alert variant="warning">Error: {errorMessage}</Alert>}
        {gamedata.started && gamedata.finished && <Row>
            <Col xs='auto'>
                <Button onClick={() => {playAgain();}}>
                    Play Again
                </Button>
            </Col>
        </Row>}
        {!gamedata.started &&
        <Button onClick={() => {startGame();}}>
            Start Game
        </Button>
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
                            <span className={moveclass(round,player)}>{movetext(round,player)}</span>
                        </td>
                    ))}
                </tr>
                ))}
            </tbody>
        </Table>}
        {meToMove() && <Row>
            <Col xs='auto'>
                <ShowFryLetters originalLetters={gamedata.letters.slice(0,gamedata.round+2)}/>
            </Col>
            <Col xs='auto'>
                <InputWord
                                handleSubmit={handleSubmit}
                                letters={gamedata.letters.slice(0,gamedata.round+2)}
                                myprevword={getmyprevword()}
                                myword={myword}
                                setMyword={setMyword}
                                mulligans={gamedata.validOnly}
                                timeLimit={gamedata.timeLimit}
                                numSeconds={gamedata.numSeconds}
                                />
            </Col>
        </Row>}
        {gamedata.started && !gamedata.finished && <Row><Col xs='auto'><Alert variant='info'>Prepicked: {gamedata.letters.length} letters</Alert></Col></Row>}
        {!gamedata.started && gamedata.players && gamedata.players.length && <Row>
        {gamedata.players.map((player) => (
            <Col key={player.name}>{player.name}</Col>
        ))}
        </Row>}
        {gamedata.started && gamedata.finished && <Container fluid>
            {gamedata.round + 2 === gamedata.letters.length
             && gamedata.players.filter(p => {return p.alive;}).length > 0
             && <Row>
                <Col xs='auto'>
                    <Alert variant="success">Wow! You survived all the possible letters!</Alert>
                </Col>
            </Row>}
            <Row>
                <Col xs='auto'>
                <Alert variant='info'>Top 10: {gamedata.rounds[gamedata.rounds.length-1].topAnswers.join(", ")}</Alert>
                </Col>
            </Row>
        </Container> }
    </div>
    );
}

export default ShowSurvivalGame;