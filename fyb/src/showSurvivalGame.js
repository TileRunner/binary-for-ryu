import { useState, useEffect, useRef } from "react";
import InputWord from "./inputWord";
import { callApi, getPossibleAnswers, isWordValid } from "./callApi";
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
    function meToMove() {
        if (!gamedata.started || gamedata.finished) {return false;}
        for (let index = 0; index < gamedata.players.length; index++) {
            const player = gamedata.players[index];
            if (player.name === username) {
                return player.tomove;
            }
        }
    }
    async function handleSubmit(myword) {
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
            if (foundmove.type === 'PHONY') { return `Phony: ${foundmove.word.toLowerCase()}`;}
            if (foundmove.type === 'VALID') { return `Valid: ${foundmove.word.toUpperCase()}`;}
        }
        return 'n/a';
    }
    function getmyprevword(roundindex, player) {
        if (roundindex === 0) {return '';}
        let foundmoves = gamedata.rounds[roundindex-1].moves.filter(move => {return move.name === player.name;});
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
          },10000); // every 10 seconds
        return () => clearInterval(timer);
    });
    useEffect(() => {
        async function fetchTopAnswers() {
            let toppicks = await getPossibleAnswers(gamedata.letters.slice(0,gamedata.round+2), 10);
            setTopAnswers(toppicks);
        }
        if ((!prevGamedata || !prevGamedata.finished) && gamedata.finished) {
            fetchTopAnswers();
        }
    },[gamedata, prevGamedata]);
    return (<div>
        {errorMessage && <Alert variant="warning">Error: {errorMessage}</Alert>}
        {gamedata.started && <Row>
            <Col xs='auto'>
                <ShowFryLetters originalLetters={gamedata.letters.slice(0,gamedata.round+2)}/>
            </Col>
            {!gamedata.finished && <Col>
                When prompted, enter a word containing at least these letters.
            </Col>}
            {gamedata.finished && <Col xs='auto'>
                <Button onClick={() => {playAgain();}}>
                    Play Again
                </Button>
            </Col>}
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
                            {index === gamedata.rounds.length - 1 && player.name === username && meToMove() ?
                                <InputWord
                                handleSubmit={handleSubmit}
                                fryLetters={gamedata.letters.slice(0,gamedata.round+2)}
                                myprevword={getmyprevword(index,player)}
                                myword={myword}
                                setMyword={setMyword}
                                />
                            :
                                <span>{movetext(round,player)}</span>
                            }
                        </td>
                    ))}
                </tr>
                ))}
                <tr>
                    <td></td>
                    <td></td>
                    {gamedata.players && gamedata.players.length && gamedata.players.map((player) => (
                        <td key={`dataplayer${player.name}`}>
                            {player.alive ?
                                player.tomove ?
                                    <span> To move...</span>
                                :
                                    <span> Survived!</span>
                            :
                                <span> Eliminated!</span>
                            }
                        </td>
                    ))}
                </tr>
            </tbody>
        </Table>}
        {gamedata.started && !gamedata.finished && <Row><Col xs='auto'><Alert variant='info'>Prepicked: {gamedata.letters}</Alert></Col></Row>}
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