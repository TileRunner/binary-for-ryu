import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { callGetGameList, callCreateGame, callJoinGame } from "./callApi";
import { formatTime } from "./formatTime";
import GetClassicOptions from "./getClassicOptions";

const ShowClassicGameList = ({username, setInlobby, setGamenumber, setGamechatnumber}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [gamelist, setGamelist] = useState([]);
    const hasFetchedData = useRef(false);
    const [showOptions, setShowOptions] = useState(false);
    useEffect(() => {
        async function fetchData() {
            let jdata = await callGetGameList('CLASSIC');
            if (jdata.error) {
                setErrorMessage(jdata.error);
            } else {
                if (JSON.stringify(jdata.gamelist) !== JSON.stringify(gamelist)) {
                    setGamelist(jdata.gamelist);
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
        let jdata = await callCreateGame('CLASSIC', username, options.mulligans, options.timeLimit);
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
                        <Button key={`joinbutton${game.number}`}
                        onClick={() => {joinGame(game.number);}}>
                            Join
                        </Button>
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
        {showOptions && <GetClassicOptions submitClassicOptions={createNewGame} cancelClassicOptions={() => {setShowOptions(false)}}/>}
    </div>
    )
}

export default ShowClassicGameList;