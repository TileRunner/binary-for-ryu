import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Modal from 'react-bootstrap/Modal';
import { usePrevious } from './usePrevious';
import { useEffect, useState } from 'react';
import { isWordValid } from "./callApi";
import Alert from 'react-bootstrap/Alert';
const InputWord = ({handleSubmit, letters, myprevword, myword, setMyword, mulligans, timeLimit, numSeconds}) => {
    const prevLetters = usePrevious(letters);
    const [showHelp, setShowHelp] = useState(false);
    const handleShowHelp = () => setShowHelp(true);
    const handleCloseHelp = () => setShowHelp(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleClearErrorMessage = () => setErrorMessage('');
    const [timeStart, setTimeStart] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(numSeconds);

    useEffect(() => {
        const timer = setInterval(() => {
            let secsLeft = Math.round(((numSeconds * 1000) - Date.now() + timeStart) / 1000);
            setTimeRemaining( secsLeft < 0 ? 0 : secsLeft);
          },1000); // every second
        return () => clearInterval(timer);
    },[timeStart, numSeconds]);
    useEffect(() => {
        if (JSON.stringify(letters) !== JSON.stringify(prevLetters)) {
            setMyword('');
            setTimeStart(Date.now());
        }
    },[letters,prevLetters,setMyword,timeLimit]);
    function isAlphabetic() {
        let alphabeticPattern = /^[A-Za-z]+$/;
        return alphabeticPattern.test(myword);
    }
    function hasLetters() {
        let fixedword = myword.toLowerCase().trim();
        if (!fixedword) {return "Please use the Pass button to pass, or enter a word";}
        // Check if they have all the letters
        for (let i = 0; i < letters.length; i++) {
            let letterCountRequired = 0;
            let actualLetterCount = 0;
            for (let j = 0; j < letters.length; j++) {
                if (letters[i] === letters[j]) {
                    letterCountRequired = letterCountRequired + 1;
                }
            }
            for (let j = 0; j < fixedword.length; j++) {
                if (letters[i].toLowerCase() === fixedword[j]) {
                    actualLetterCount = actualLetterCount + 1;
                }
            }
            if (actualLetterCount < letterCountRequired) {
                return `You need the letter ${letters[i].toUpperCase()} at least ${letterCountRequired} time${letterCountRequired === 1 ? '.' : 's.'}`;
            }
        }
        return;

    }
    async function mysubmit(event) {
        event.preventDefault();
        let err = hasLetters();
        if (err) {
            setErrorMessage(err);
        } else {
            let timedout = timeLimit && (timeRemaining === 0);
            let valid = !timedout && await isWordValid(myword);
            if (!timedout && mulligans && !valid) {
                setErrorMessage(`Sorry, ${myword} is not in my word list. You can try again.`);
                return;
            }
            handleSubmit(myword, valid, timedout);
        }
    }
    function mypass() {
        handleSubmit('', false, false); // empty signifies pass
    }
    function handleTimeout() {
        handleSubmit('', false, true); // timeout
    }
    return (<div>
    <Modal
    show={errorMessage !== ''}
    onHide={handleClearErrorMessage}
    animation={false}
    centered
    backdrop='static'
    >
        <Modal.Header closeButton>
            <Modal.Title>Attention</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {errorMessage}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClearErrorMessage}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
    <Modal
    show={timeLimit && (timeRemaining === 0)}
    onHide={handleTimeout}
    centered
    backdrop='static'
    >
        <Modal.Header closeButton>
            <Modal.Title>
                TIMEOUT!
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            You ran out of time!
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleTimeout}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
    <Offcanvas show={showHelp} onHide={handleCloseHelp} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Help</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p>Enter a word that has all the letters: {letters.join('').toUpperCase()}</p>
                    <p>Use as many extra letters as you like.</p>
                </Offcanvas.Body>
    </Offcanvas>
    <Form onSubmit={mysubmit}>
        <InputGroup>
            {myprevword && <Button variant="outline-secondary" onClick={() => {setMyword(myprevword)}}>Copy</Button>}
            <Button variant="outline-secondary" onClick={() => {setMyword('')}}>Clear</Button>
            <Form.Control
            type="text"
            value={myword}
            onChange={e => { setMyword(e.target.value); } }
            isInvalid={myword && !isAlphabetic()}
            minLength={letters.length}
            placeholder="Your word..."
            />
            <Form.Control.Feedback type="invalid">Must only use letters</Form.Control.Feedback>
            <Button variant="outline-secondary" onClick={() => {mypass()}}>Pass</Button>
            <Button variant="primary" type='submit'>Submit</Button>
            <Button variant="info" onClick={handleShowHelp}>Help</Button>
        </InputGroup>
    </Form>
    {timeLimit && <Alert variant={timeRemaining < 16 ? 'danger' : timeRemaining < 30 ? 'warning' : 'dark'}>{timeRemaining} seconds remaining.</Alert>}
    </div>);
}

export default InputWord;