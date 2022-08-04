import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const baseurl = 'https://enigmatic-lake-42795.herokuapp.com';

const PlaySurvival = ({username}) => {
    const [infoMsg, setInfoMessage] = useState('Loading...');
    const [gamelist, setGamelist] = useState([]);
    const [gamedata, setGamedata] = useState({});
    const [inlobby, setInlobby] = useState(true);

    async function getGamelist() {
        let url = `${baseurl}/fyb/listgames?type=SURVIVAL`;
        const response = await fetch(url);
        const jdata = await response.json();
        if (jdata.error) {
            setInfoMessage(jdata.error);
        } else {
            setGamelist(jdata);
            setInfoMessage('List loaded');
        }
    }
    useEffect(() => {
        getGamelist();
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
    const formatTime = (t) => {
        let d = new Date(t);
        let h = d.getHours();
        let ampm = ' AM';
        if (h > 12) {
            h = h - 12;
            ampm = ' PM';
        }
        let m = d.getMinutes();
        let mm = (d.getMonth() + 1).toString();
        if (mm.length < 2) { mm = '0' + mm;}
        let dd = d.getDate().toString();
        if (dd.length < 2) { dd = '0' + dd;}
        let f = d.getFullYear().toString() + '-' + mm + '-' + dd + ' @';
        f = f + h.toString() + ':';
        if (m < 10) { f = f + '0';}
        f = f + m.toString();
        f = f + ampm;
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
                    <td>{game.started ? <span>No action</span>
                    : <Button key={`joinbutton${game.number}`}
                    onClick={() => {joinGame(game.number);}}>
                        Join
                    </Button>
                    }</td>
                </tr>
            ))}
            </tbody>
        </Table>
        <Button onClick={() => {createNewGame();}}>
            Create Game
        </Button>
        <p>Game: {JSON.stringify(gamedata)}</p>
        <p>Gamelist: {JSON.stringify(gamelist)}</p>
    </div>
    const ShowGame = <div>
        <Row>
            <Col>Game Number:</Col>
            <Col>{gamedata.number}</Col>
        </Row>
        <Row>
            <Col>Chat Number:</Col>
            <Col>{gamedata.chatNumber}</Col>
        </Row>
        <Row>
            <Col>Creator:</Col>
            <Col>{gamedata.creator}</Col>
        </Row>
        <Row>
            <Col>Created:</Col>
            <Col>{formatTime(gamedata.createTime)}</Col>
        </Row>
    </div>
    useEffect(() => {
        const id = setInterval(() => {
            getGamelist();
        }, 5000);
        return () => clearInterval(id);
    }, []);
    return <div className="PlaySurvival">
        <h1>Survival Game</h1>
        <p>Info: {infoMsg}</p>
        {inlobby ? ShowGameList : ShowGame}
    </div>;
}

export default PlaySurvival;