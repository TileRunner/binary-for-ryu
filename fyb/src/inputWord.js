import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { usePrevious } from './usePrevious';
import { useEffect } from 'react';
const InputWord = ({handleSubmit, fryLetters, myprevword, myword, setMyword}) => {
    const prevFryLetters = usePrevious(fryLetters);
    useEffect(() => {
        if (JSON.stringify(fryLetters) !== JSON.stringify(prevFryLetters)) {
            setMyword('');
        }
    },[fryLetters,prevFryLetters,setMyword]);
    function isAlphabetic() {
        let alphabeticPattern = /^[A-Za-z]+$/;
        return alphabeticPattern.test(myword);
    }
    function hasFryLetters() {
        let fixedword = myword.toLowerCase().trim();
        if (!fixedword) {return "Please use the Pass button to pass, or enter a word";}
        // Check if they have all the fry letters
        for (let i = 0; i < fryLetters.length; i++) {
            let letterCountRequired = 0;
            let actualLetterCount = 0;
            for (let j = 0; j < fryLetters.length; j++) {
                if (fryLetters[i] === fryLetters[j]) {
                    letterCountRequired = letterCountRequired + 1;
                }
            }
            for (let j = 0; j < fixedword.length; j++) {
                if (fryLetters[i].toLowerCase() === fixedword[j]) {
                    actualLetterCount = actualLetterCount + 1;
                }
            }
            if (actualLetterCount < letterCountRequired) {
                return `You need the letter ${fryLetters[i].toUpperCase()} at least ${letterCountRequired} time${letterCountRequired === 1 ? '.' : 's.'}`;
            }
        }
        return;

    }
    function mysubmit(event) {
        event.preventDefault();
        let err = hasFryLetters();
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
            minLength={fryLetters.length}
            placeholder="Your word..."
            />
            <Form.Control.Feedback type="invalid">Must only use letters</Form.Control.Feedback>
            <Button variant="outline-secondary" onClick={() => {mypass()}}>Pass</Button>
            <Button variant="primary" type='submit'>Submit</Button>
        </InputGroup>
    </Form>
    );
}

export default InputWord;