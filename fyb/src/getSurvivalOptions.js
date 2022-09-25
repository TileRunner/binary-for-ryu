import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const GetSurvivalOptions = ({submitSurvivalOptions, cancelSurvivalOptions}) => {
    const [mulligans, setMulligans] = useState(false);
    const [timeLimit, setTimeLimit] = useState(false);
    const [numSeconds, setNumSeconds] = useState(60); // Default to a minute
    const handleChangeMulligans = () => {
        setMulligans(!mulligans);
    }
    const handleChangeTimeLimit = () => {
        setTimeLimit(!timeLimit);
    }
    function mysubmit(event) {
        event.preventDefault();
        let options = {mulligans: mulligans, timeLimit: timeLimit, numSeconds: parseInt(numSeconds)};
        submitSurvivalOptions(options);
    }
    return(<Form onSubmit={mysubmit}>
                <Form.Label as={'h1'}>Survival Options:</Form.Label>
                <Form.Check
                type='switch'
                label={<><span className='cb1'>Mulligans</span><span className='cb2'>When selected, players may try again if a word is not recognized.</span></>}
                id='Mulligans'
                onChange={handleChangeMulligans}
                />
                <Form.Check
                type='switch'
                label={<><span className='cb1'>Time Limit</span><span className='cb2'>When selected, players have a time limit per move.</span></>}
                id='TimeLimit'
                onChange={handleChangeTimeLimit}
                />
                <FloatingLabel
                controlId='timeLimitOptions'
                label='Time limit options'>
                    <Form.Select
                    value={numSeconds}
                    onChange={e => {setNumSeconds(e.target.value);}}
                    >
                        <option value="300">Beginner - Five minutes per move</option>
                        <option value="120">Intermediate - Two minutes per move</option>
                        <option value="60">Competetive - One minute per move</option>
                        <option value="30">Rapid - 30 seconds per move</option>
                        <option value="15">Blitz - 15 seconds per move</option>
                    </Form.Select>
                </FloatingLabel>
                <Row>
                    <Col xs='auto'>
                        <Button
                        variant='danger'
                        type='button'
                        onClick={cancelSurvivalOptions}
                        >
                            Cancel
                        </Button>
                    </Col>
                    <Col xs='auto'>
                        <Button
                        variant='primary'
                        type='submit'
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>
    </Form>);
}

export default GetSurvivalOptions;