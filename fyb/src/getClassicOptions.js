import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const GetClassicOptions = ({submitClassicOptions, cancelClassicOptions}) => {
    const [mulligans, setMulligans] = useState(false);
    const [timeLimit, setTimeLimit] = useState(false);
    const handleChangeMulligans = () => {
        setMulligans(!mulligans);
    }
    const handleChangeTimeLimit = () => {
        setTimeLimit(!timeLimit);
    }
    function mysubmit(event) {
        event.preventDefault();
        let options = {mulligans: mulligans, timeLimit: timeLimit};
        submitClassicOptions(options);
    }
    return(<Form onSubmit={mysubmit}>
                <Form.Label as={'h1'}>Classic Options</Form.Label>
                <Form.Check
                type='switch'
                label={<><span className='cb1'>Mulligans</span><span className='cb2'>When selected, players may try again if a word is not recognized.</span></>}
                id='Mulligans'
                onChange={handleChangeMulligans}
                />
                <Form.Check
                type='switch'
                label={<><span className='cb1'>Time Limit</span><span className='cb2'>When selected, players have one minute to make a move.</span></>}
                id='TimeLimit'
                onChange={handleChangeTimeLimit}
                />
                <Row>
                    <Col xs='auto'>
                        <Button
                        variant='danger'
                        type='button'
                        onClick={cancelClassicOptions}
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

export default GetClassicOptions;