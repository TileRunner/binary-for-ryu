import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { callApi } from "./callApi";
import { formatTime } from "./formatTime";

const ShowSurvivalGameList = ({username, setInlobby, setGamenumber, setGamechatnumber}) => {
    const [infoMsg, setInfoMessage] = useState('Loading...');
    const [gamelist, setGamelist] = useState([]);
    useEffect(() => {
        async function fetchData() {
            let jdata = await callApi(`listgames?type=SURVIVAL`);
            if (jdata.error) {
                setInfoMessage(jdata.error);
            } else {
                setGamelist(jdata);
                setInfoMessage(`List loaded at ${formatTime(Date.now())}`);
            }
        }
        const timer = setInterval(() => {
            fetchData();
        },10000); // every 10 seconds
        return () => clearInterval(timer);
    });
    async function createNewGame() {
        let jdata = await callApi(`creategame?type=SURVIVAL&name=${username}`);
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamenumber(jdata.number);
            setGamechatnumber(jdata.chatNumber);
            setInlobby(false);
        }
    }
    async function joinGame(joingamenumber) {
        let jdata = await callApi(`joingame?number=${joingamenumber}&name=${username}`);
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamenumber(jdata.number);
            setGamechatnumber(jdata.chatNumber);
            setInlobby(false);
        }
    }
    return (<div>
        <p>Info: {infoMsg}</p>
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
            <Col>
                <Button onClick={() => {createNewGame();}}>
                    Create Game
                </Button>
            </Col>
        </Row>
    </div>
    )
}

export default ShowSurvivalGameList;