import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { callApi } from "./callApi";
import { formatTime } from "./formatTime";

const ShowClassicGameList = ({username, setInlobby, setGamenumber, setGamechatnumber}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [gamelist, setGamelist] = useState([]);
    const hasFetchedData = useRef(false);
    const [validOnly, setValidOnly] = useState(false);
    useEffect(() => {
        async function fetchData() {
            let jdata = await callApi(`listgames?type=CLASSIC`);
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
    async function createNewGame() {
        let jdata = await callApi(`creategame?type=CLASSIC&name=${username}&validOnly=${validOnly}`);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamenumber(jdata.number);
            setGamechatnumber(jdata.chatNumber);
            setInlobby(false);
        }
    }
    async function joinGame(joingamenumber) {
        let jdata = await callApi(`joingame?number=${joingamenumber}&name=${username}`);
        if (jdata.error) {
            setErrorMessage(jdata.error);
        } else {
            setGamenumber(jdata.number);
            setGamechatnumber(jdata.chatNumber);
            setInlobby(false);
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
        <Row>
            <Col xs='auto'>
                <Button onClick={() => {createNewGame();}}>
                    Create Game
                </Button>
            </Col>
            <Col xs='auto'>
                <div className="trOptionsDiv">
                    <div className={validOnly ? "trCheckbox On" : "trCheckbox Off"}
                    onClick={() => {setValidOnly(!validOnly);}}
                    data-toggle="tooltip" title="When selected, players get to try again for invalid words"
                    >
                        <label key='labelvalidonly'>Mulligans</label>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
    )
}

export default ShowClassicGameList;