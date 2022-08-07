import React, { useState, useEffect } from "react";
import { isWordValid, prepickFryLetters, getPossibleAnswers } from "./callApi";
import ShowFryLetters from "./showFryLetters";

const PlaySolo = () => {
    const [pickedLetters, setPickedLetters] = useState([]); // All pre-picked fry letters as an array
    const [fryLetters, setFryLetters] = useState([]); // Fry letters shown at current stage as an array
    const [word, setWord] = useState('');
    const [selected, setSelected] = useState(-1); // Used for letting the user move fry letters around
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
        let answers = await getPossibleAnswers(fryLetters, 1);
        return answers && answers.length > 0 ? answers[0] : '';
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitPlayerWord();
            return;
        }
    }

    const submitPlayerWord = async() => {
        let fixedword = word.toUpperCase().trim();
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

    const submitPass = async() => {
        let move = {pass:true};
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
            setWord('');
            setWarning('New fry letters picked.')
        } else {
            let newFryLetters = pickedLetters.slice(0, fryLetters.length + 1);
            setFryLetters(newFryLetters);
            setWarning('');
        }
    }

    return (
        <div className="trBackground">
            <div className="trTitle">
                Fry Your Brain Solo
            </div>
            <div className="trOptionsDiv">
                <div className={validOnly ? "trCheckbox On" : "trCheckbox Off"}
                 onClick={() => {setValidOnly(!validOnly);}}
                 data-toggle="tooltip" title="Whether guess must be valid words"
                 >
                    <label key='labelvalidonly'>Guesses must be valid words</label>
                </div>
            </div>
            {moves.length >= 0 && <div>
                <table className="trTable" border="1">
                    <thead>
                        <tr>
                            <th>Fry Letters</th>
                            <th>Play Made</th>
                            <th>Result</th>
                            <th>Chefs Pick</th>
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
                                    {!m.pass && m.valid && m.word.length === m.chefsPick.length && <span className="trEmphasis">Shortest!</span>}
                                    {!m.pass && m.valid && m.word.length > m.chefsPick.length && <>Valid</>}
                                    {!m.pass && !m.valid && <span className="trDanger">Phoney</span>}
                                </td>
                                <td>{m.chefsPick}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
            <div>Prepicked fry letters: {pickedLetters}</div>
            {fryLetters.length > 0 &&
            <div>
                <ShowFryLetters fryLetters={fryLetters} selected={selected} setFryLetters={setFryLetters} setSelected={setSelected}/>
                <div onKeyDownCapture={handleKeyDown}>
                    <div className="trEmphasis">Enter Word:</div>
                    <input
                        type="text" placeholder="Enter word here"
                        autoComplete="off" spellCheck="false"
                        name="word"
                        value={word}
                        onChange={(e) => {
                            setWord(e.target.value);
                        } } />
                    <button className="closemebutton" onClick={() => {setWord('');}}/>
                    <div>
                        {word.toUpperCase().trim().match("^[a-zA-Z]*$") && 
                            <button className="trButton" key="submitWord"
                                onClick={() => {submitPlayerWord()}}>
                                SUBMIT
                            </button>
                        }
                        <button className="trButton" key="passButton"
                            onClick={() => {submitPass()}}>
                            PASS
                        </button>
                    </div>
                </div>
            </div>}
            {warning && <div className="trWarning">{warning}</div>}
        </div>
    );
}

export default PlaySolo;