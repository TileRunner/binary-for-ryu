import { useState, useEffect, useRef } from "react";
import InputWord from "./inputWord";
import { callApi } from "./callApi";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ShowFryLetters from "./showFryLetters";
import { usePrevious } from "./usePrevious";

const ShowSurvivalGame = ({gamenumber, username}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [gamedata, setGamedata] = useState({});
    const [myword, setMyword] = useState('');
    const [topAnswers, setTopAnswers] = useState([]);
    const hasFetchedData = useRef(false);
    const prevGamedata = usePrevious(gamedata);
    async function startGame() {
        let jdata = await callApi(`startgame?number=${gamenumber}`);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setErrorMessage('');
        }
    }
    function meToMove(game) {
        if (!game.started || game.finished) {return false;}
        for (let index = 0; index < game.players.length; index++) {
            const player = game.players[index];
            if (player.name === username) {
                return player.tomove;
            }
        }
    }
    async function handleSubmit(myword, valid, timedout) {
        let route = `makemove?number=${gamenumber}&name=${username}`;
        if (timedout) {
            route = `${route}&type=TIMEOUT`;
        } else if (!myword) {
            route = `${route}&type=PASS`
        } else if (valid) {
            route = `${route}&type=VALID&word=${myword}`;
        } else {
            route = `${route}&type=PHONY&word=${myword}`;
        }   
        let jdata = await callApi(route);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamedata(jdata);
            setErrorMessage('');
        }
    }
    async function playAgain() {
        let jdata = await callApi(`playagain?number=${gamenumber}`);
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
            let jdata = await callApi(`getgame?number=${gamenumber}`);
            if (jdata.error) {
                setErrorMessage(jdata.error);
            } else if (JSON.stringify(jdata) !== JSON.stringify(gamedata)) {
                console.log(jdata);
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
    useEffect(() => {
        async function fetchTopAnswers() {
            let route = `gettopanswers?letters=${gamedata.letters.slice(0,gamedata.round+2).join('')}&count=10`;
            let tops = await callApi(route);
            if (tops.error) {
                setErrorMessage(tops.error);
                setTopAnswers(['urp']);
            } else {
                setTopAnswers(tops.answers);
            }
        }
        if ((!prevGamedata || !prevGamedata.finished) && gamedata.finished) {
            fetchTopAnswers();
        }
    },[gamedata, prevGamedata, username]);
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
        {meToMove(gamedata) && <Row>
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
                    <Alert variant="info">Top 10: {topAnswers.join(", ")}</Alert>
                </Col>
            </Row>
        </Container> }
    </div>
    );
}

export default ShowSurvivalGame;