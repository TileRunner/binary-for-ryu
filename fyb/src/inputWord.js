import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { usePrevious } from './usePrevious';
import { useEffect, useState } from 'react';
const InputWord = ({handleSubmit, letters, myprevword, myword, setMyword}) => {
    const prevLetters = usePrevious(letters);
    const [showHelp, setShowHelp] = useState(false);
    const handleShowHelp = () => setShowHelp(true);
    const handleCloseHelp = () => setShowHelp(false);

    useEffect(() => {
        if (JSON.stringify(letters) !== JSON.stringify(prevLetters)) {
            setMyword('');
        }
    },[letters,prevLetters,setMyword]);
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
    function mysubmit(event) {
        event.preventDefault();
        let err = hasLetters();
        if (err) {
            alert(err);
        } else {
            handleSubmit(myword);
        }
    }
    function mypass() {
        handleSubmit(''); // empty signifies pass
    }
    return (
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
            <Offcanvas show={showHelp} onHide={handleCloseHelp} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Help</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p>Enter a word that has all the letters: {letters.join('').toUpperCase()}</p>
                    <p>Use as many extra letters as you like.</p>
                </Offcanvas.Body>
            </Offcanvas>
        </InputGroup>
    </Form>
    );
}

export default InputWord;