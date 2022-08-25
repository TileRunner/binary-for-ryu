import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
const GetSurvivalOptions = ({submitSurvivalOptions, cancelSurvivalOptions}) => {
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
        submitSurvivalOptions(options);
    }
    return(<Form onSubmit={mysubmit}>
                <Form.Label>Survival Options:</Form.Label>
                <Form.Check
                inline
                type='switch'
                label='Mulligans'
                id='Mulligans'
                onChange={handleChangeMulligans}
                data-toggle='tooltip' title='When selected, players get try again if a word is not recognized'
                />
                <Form.Check
                inline
                type='switch'
                label='Time Limit'
                id='TimeLimit'
                onChange={handleChangeTimeLimit}
                data-toggle='tooltip' title='When selected, players have one minute to make a move'
                />
                <Button
                variant='danger'
                type='button'
                onClick={cancelSurvivalOptions}
                >
                    Cancel
                </Button>
                <Button
                variant='primary'
                type='submit'
                >
                    Submit
                </Button>
    </Form>);
}

export default GetSurvivalOptions;