import { useState } from "react";
import Table from 'react-bootstrap/Table';
import ShowClassicGame from "./showClassicGame";
import ShowClassicGameList from "./showClassicGameList";
import ShowChat from "./showChat";

const PlayClassic = ({username}) => {
    const [inlobby, setInlobby] = useState(true);
    const [gamenumber, setGamenumber] = useState(-1);
    const [gamechatnumber, setGamechatnumber] = useState(-1);

    return <div className="PlayClassic">
        {inlobby ?
            <Table>
                <thead>
                    <tr>
                        <th>Game List</th>
                        <th>Chat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><ShowClassicGameList username={username} setInlobby={setInlobby} setGamenumber={setGamenumber} setGamechatnumber={setGamechatnumber}/></td>
                        <td><ShowChat chatnumber={1} username={username}/></td>
                    </tr>
                </tbody>
            </Table>
        :
            <Table>
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Chat</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><ShowClassicGame gamenumber={gamenumber} username={username}/></td>
                        <td><ShowChat chatnumber={gamechatnumber} username={username}/></td>
                    </tr>
                </tbody>
            </Table>
        }
    </div>;
}

export default PlayClassic;