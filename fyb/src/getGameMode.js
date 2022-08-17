import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const GetGameMode = ({gameMode, setGameMode}) => {
    const UserDeselectGameMode = <div className='GetGameMode'>
        <Row>
            <Col xs="auto">
                Game Mode: {gameMode}
            </Col>
            <Col>
                <Button onClick={() => {setGameMode('UNK');}}>Deselect</Button>
            </Col>
        </Row>
    </div>;
    const UserChooseGameMode = <div className="GetGameMode">
        <h1>Select Game Mode</h1>
        <Table>
            <tbody>
                <tr>
                    <td><Button onClick={() => { setGameMode('SOLO'); } }>SOLO</Button></td>
                    <td>Practise mode. Computer keeps adding a letter and letting you move until no moves are possible.</td>
                </tr>
                <tr>
                    <td><Button onClick={() => { setGameMode('CLASSIC'); } }>CLASSIC</Button></td>
                    <td>Classic mode. Play against friends to a target score, taking turns with a free-for-all round upon failure.</td>
                </tr>
                <tr>
                    <td><Button onClick={() => { setGameMode('SURVIVAL'); } }>SURVIVAL</Button></td>
                    <td>Survival mode. Play against friends, all play every round until they fail.</td>
                </tr>
            </tbody>
        </Table>
    </div>;
    return (
        gameMode === 'UNK' ? UserChooseGameMode : UserDeselectGameMode
    );
}

export default GetGameMode;