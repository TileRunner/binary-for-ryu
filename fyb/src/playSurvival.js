import { useState } from "react";
import Table from 'react-bootstrap/Table';
import ShowSurvivalGame from "./showSurvivalGame";
import ShowSurvivalGameList from "./showSurvivalGameList";
import ShowChat from "./showChat";

const PlaySurvival = ({username}) => {
    const [inlobby, setInlobby] = useState(true);
    const [gamenumber, setGamenumber] = useState(-1);
    const [gamechatnumber, setGamechatnumber] = useState(-1);

    return <div className="PlaySurvival">
        <h1>Survival Game</h1>
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
                        <td><ShowSurvivalGameList username={username} setInlobby={setInlobby} setGamenumber={setGamenumber} setGamechatnumber={setGamechatnumber}/></td>
                        <td><ShowChat chatnumber={2} username={username}/></td>
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
                        <td><ShowSurvivalGame gamenumber={gamenumber} username={username}/></td>
                        <td><ShowChat chatnumber={gamechatnumber} username={username}/></td>
                    </tr>
                </tbody>
            </Table>
        }
    </div>;
}

export default PlaySurvival;