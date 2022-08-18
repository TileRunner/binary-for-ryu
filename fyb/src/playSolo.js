import React, { useState, useEffect } from "react";
import { isWordValid, prepickFryLetters, getPossibleAnswers } from "./callApi";
import ShowFryLetters from "./showFryLetters";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputWord from "./inputWord";

const PlaySolo = () => {
    const [pickedLetters, setPickedLetters] = useState([]); // All pre-picked fry letters as an array
    const [fryLetters, setFryLetters] = useState([]); // Fry letters shown at current stage as an array
    const [myword, setMyword] = useState('');
    const [moves, setMoves] = useState([]);
    const [warning, setWarning] = useState('Practice session.');
    const [validOnly, setValidOnly] = useState(false); // whether guesses must be valid words

    useEffect(() => {
        pickAllFryLetters();
    },[]);

    const pickAllFryLetters = async () => {
        let picked = await prepickFryLetters();
        let newPick = Array.from(picked.toUpperCase());
        setPickedLetters(newPick);
        setFryLetters(newPick.slice(0,3));
    };

    async function getChefsPick() {
        let answers = await getPossibleAnswers(fryLetters, 10);
        return answers.join(', ');
    }


    async function submitPlayerWord (word) {
        let fixedword = word.toUpperCase().trim();
        if (fixedword === '') {
            let move = {pass:true};
            await finishMoveAndMoveOn(move);
            return;
        }
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
                setWarning(`You need the letter ${fryLetters[i]} at least ${letterCountRequired} time${letterCountRequired === 1 ? '.' : 's.'}`);
                return;
            }
        }
        let valid = await isWordValid(word);
        if (validOnly && !valid) {
            alert(`Sorry, ${fixedword} is not in my word list.`);
            return;
        }
        let move = {pass:false, word: word, valid: valid};
        await finishMoveAndMoveOn(move);
    }

    async function finishMoveAndMoveOn(move) {
        let chefsPick = await getChefsPick();
        move.fryLetters = fryLetters;
        move.chefsPick = chefsPick;
        let newmoves = [...moves];
        newmoves.push(move);
        while (newmoves.length > 15) {
            newmoves.splice(0,1);
        }
        setMoves(newmoves);
        if (fryLetters.length === pickedLetters.length) {
            await pickAllFryLetters();
            setMyword('');
            setWarning('New fry letters picked.')
        } else {
            let newFryLetters = pickedLetters.slice(0, fryLetters.length + 1);
            setFryLetters(newFryLetters);
            setWarning('');
        }
    }

    return (
        <div className="PlaySolo">
            <div className="trOptionsDiv">
                <div className={validOnly ? "trCheckbox On" : "trCheckbox Off"}
                 onClick={() => {setValidOnly(!validOnly);}}
                 data-toggle="tooltip" title="When selected, you get to try again for invalid words"
                 >
                    <label key='labelvalidonly'>Mulligans</label>
                </div>
            </div>
            {moves.length >= 0 && <div>
                <Table borderered striped hover size="sm" variant="dark" responsive>
                    <thead>
                        <tr>
                            <th>Letters</th>
                            <th>Play Made</th>
                            <th>Result</th>
                            <th>Top Answer(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moves.map((m,i) => (
                            <tr key={`solomove${i}`}>
                                <td>{m.fryLetters}</td>
                                <td>
                                    {m.pass && <span className="trDanger">PASS</span>}
                                    {!m.pass && <>{m.word}</>}
                                </td>
                                <td>
                                    {!m.pass && m.valid && m.word.length === m.chefsPick.split(',')[0].length && <span className="trEmphasis">Shortest!</span>}
                                    {!m.pass && m.valid && m.word.length > m.chefsPick.split(',')[0].length && <>Valid</>}
                                    {!m.pass && !m.valid && <span className="trDanger">Phoney</span>}
                                </td>
                                <td data-toggle='tooltip' title={m.chefsPick}>{m.pass || !m.valid ? m.chefsPick : m.chefsPick.split(',')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>}
            <div>Prepicked letters: {pickedLetters}</div>
            {fryLetters.length > 0 &&
            <Row>
                <Col xs='auto'><ShowFryLetters originalLetters={fryLetters}/></Col>
                <Col xs='auto'><InputWord
                                handleSubmit={submitPlayerWord}
                                fryLetters={fryLetters}
                                myprevword={fryLetters.length > 3 && moves.length > 0 ? moves[moves.length-1].word : ''}
                                myword={myword}
                                setMyword={setMyword}
                /></Col>
            </Row>}
            {warning && <div className="trWarning">{warning}</div>}
        </div>
    );
}

export default PlaySolo;