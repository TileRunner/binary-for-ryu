import Form from 'react-bootstrap/Form';
const InputWord = ({myword, setMyword, handleSubmit, fryLetters}) => {
    function isAlphabetic() {
        let alphabeticPattern = /^[A-Za-z]+$/;
        return alphabeticPattern.test(myword);
    }
    function hasFryLetters() {
        let fixedword = myword.toLowerCase().trim();
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
                if (fryLetters[i] === fixedword[j]) {
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
            handleSubmit();
        }
    }
    return (
    <Form onSubmit={mysubmit}>
        <Form.Label>Your Word:</Form.Label>
        <Form.Control
        type="text"
        value={myword}
        onChange={e => { setMyword(e.target.value); } }
        isInvalid={myword && !isAlphabetic()}
        minLength={fryLetters.length}
        />
        <Form.Control.Feedback type="invalid">Must only use letters</Form.Control.Feedback>
    </Form>
    );
}

export default InputWord;