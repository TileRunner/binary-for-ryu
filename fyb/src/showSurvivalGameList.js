import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { callGetGameList, callCreateGame, callJoinGame, callDeleteGame } from "./callApi";
import { formatTime } from "./formatTime";
import GetSurvivalOptions from "./getSurvivalOptions";

const ShowSurvivalGameList = ({username, setInlobby, setGamenumber, setGamechatnumber}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [gamelist, setGamelist] = useState([]);
    const hasFetchedData = useRef(false);
    const [showOptions, setShowOptions] = useState(false);
    useEffect(() => {
        async function fetchData() {
            let jdata = await callGetGameList('SURVIVAL');
            if (jdata.error) {
                setErrorMessage(jdata.error);
            } else {
                if (JSON.stringify(jdata) !== JSON.stringify(gamelist)) {
                    setGamelist(jdata);
                }
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
    async function createNewGame(options) {
        let jdata = await callCreateGame('SURVIVAL', username, options.mulligans, options.timeLimit, options.numSeconds);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamenumber(jdata.number);
            setGamechatnumber(jdata.chatNumber);
            setInlobby(false);
            setErrorMessage('');
        }
    }
    async function joinGame(joingamenumber) {
        let jdata = await callJoinGame(joingamenumber,username);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamenumber(jdata.number);
            setGamechatnumber(jdata.chatNumber);
            setInlobby(false);
            setErrorMessage('');
        }
    }
    async function deleteGame(deletegamenumber) {
        let jdata = await callDeleteGame(deletegamenumber)
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamelist(jdata);
            setErrorMessage('');
        }
    }
    return (<div>
        {errorMessage && <p className="trWarning">Error: {errorMessage}</p>}
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
                        <Row key={`actionbuttons${game.number}`}>
                            <Col xs='auto'>
                                <Button
                                variant="primary"
                                onClick={() => {joinGame(game.number);}}>
                                    Join
                                </Button>
                            </Col>
                            {game.finished && <Col xs='auto'>
                                <Button
                                variant="danger"
                                onClick={() => {deleteGame(game.number);}}>
                                    Delete
                                </Button>
                            </Col>}
                        </Row>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
        {!showOptions && <Row>
            <Col xs='auto'>
                <Button onClick={() => {setShowOptions(true);}}>
                    Create Game
                </Button>
            </Col>
        </Row>}
        {showOptions && <GetSurvivalOptions submitSurvivalOptions={createNewGame} cancelSurvivalOptions={() => {setShowOptions(false)}}/>}
    </div>
    )
}

export default ShowSurvivalGameList;