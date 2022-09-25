import React, { useState, useEffect } from "react";
import { callGetTopAnswers, callPickTiles } from "./callApi";
import ShowFryLetters from "./showFryLetters";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputWord from "./inputWord";

const PlaySolo = () => {
    const [allLetters, setAllLetters] = useState([]); // All pre-picked letters as an array
    const [currentLetters, setCurrentLetters] = useState([]); // Letters shown at current stage as an array
    const [myword, setMyword] = useState('');
    const [moves, setMoves] = useState([]);
    const [warning, setWarning] = useState('Please wait while I feed the cat...');
    const [mulligans, setMulligans] = useState(false); // whether guesses must be valid words
    const [showTops, setShowTops] = useState(false); // whether to show top answers
    const [showPrepick, setShowPrepick] = useState(false); // whether to show pre-picked letters

    useEffect(() => {
        pickAllLetters();
    },[]);

    const pickAllLetters = async () => {
        let picked = await callPickTiles();
        if (picked.error) {
            setWarning(picked.error);
            setAllLetters([]);
            setCurrentLetters([]);
        } else {
            setWarning('');
            let newPick = Array.from(picked.letters.toUpperCase());
            setAllLetters(newPick);
            setCurrentLetters(newPick.slice(0,3));    
        }
    };

    async function getTopAnswers() {
        let tops = await callGetTopAnswers(currentLetters.join(''), 10);
        if (tops.error) {
            setWarning(tops.error);
            return 'urp';
        }
        return tops.join(', ');
    }

    async function submitPlayerWord (word, valid) {
        let fixedword = word.toUpperCase().trim();
        let move = {pass: fixedword === ''};
        if (!move.pass) {
            move.word = fixedword;
            move.valid = valid;
        }
        await finishMoveAndMoveOn(move);
    }

    async function finishMoveAndMoveOn(move) {
        let topAnswers = await getTopAnswers();
        move.fryLetters = currentLetters;
        move.topAnswers = topAnswers;
        let newmoves = [...moves];
        newmoves.push(move);
        while (newmoves.length > 15) {
            newmoves.splice(0,1);
        }
        setMoves(newmoves);
        if (currentLetters.length === allLetters.length) {
            await pickAllLetters();
            setMyword('');
            setWarning('New fry letters picked.')
        } else {
            let newFryLetters = allLetters.slice(0, currentLetters.length + 1);
            setCurrentLetters(newFryLetters);
            setWarning('');
        }
    }

    return (
        <div className="PlaySolo">
            <div className="trOptionsDiv floatleftdiv">
                <div className={mulligans ? "trCheckbox On floatleft" : "trCheckbox Off floatleft"}
                 onClick={() => {setMulligans(!mulligans);}}
                 data-toggle="tooltip" title="When selected, you get to try again for invalid words"
                 >
                    <label key='labelvalidonly'>Mulligans</label>
                </div>
                <div className={showTops ? "trCheckbox On floatleft" : "trCheckbox Off floatleft"}
                 onClick={() => {setShowTops(!showTops);}}
                 data-toggle="tooltip" title="Whether to show Top Answers table column"
                 >
                    <label key='labelvalidonly'>Show Top Answers</label>
                </div>
                <div className={showPrepick ? "trCheckbox On floatleft" : "trCheckbox Off floatleft"}
                 onClick={() => {setShowPrepick(!showPrepick);}}
                 data-toggle="tooltip" title="Whether to show pre-picked letters"
                 >
                    <label key='labelvalidonly'>Show Pre-picked Letters</label>
                </div>
            </div>
            {moves.length >= 0 && <div>
                <Table bordered striped hover size="sm" variant="dark" responsive>
                    <thead>
                        <tr>
                            <th>Letters</th>
                            <th>Play Made</th>
                            <th>Result</th>
                            {showTops && <th>Top Answer(s)</th>}
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
                                    {!m.pass && m.valid && m.word.length === m.topAnswers.split(',')[0].length && <span className="trEmphasis">Shortest!</span>}
                                    {!m.pass && m.valid && m.word.length > m.topAnswers.split(',')[0].length && <>Valid</>}
                                    {!m.pass && !m.valid && <span className="trDanger">Phoney</span>}
                                </td>
                                {showTops && <td data-toggle='tooltip' title={m.topAnswers}>{m.pass || !m.valid ? m.topAnswers : m.topAnswers.split(',')[0]}</td>}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>}
            {showPrepick && <div>Prepicked letters: {allLetters}</div>}
            {currentLetters.length > 0 &&
            <Row>
                <Col xs='auto'><ShowFryLetters originalLetters={currentLetters}/></Col>
                <Col xs='auto'><InputWord
                                handleSubmit={submitPlayerWord}
                                letters={currentLetters}
                                myprevword={currentLetters.length > 3 && moves.length > 0 ? moves[moves.length-1].word : ''}
                                myword={myword}
                                setMyword={setMyword}
                                mulligans={mulligans}
                                timeLimit={false}
                                numSeconds={60}
                /></Col>
            </Row>}
            {warning && <div className="trWarning">{warning}</div>}
        </div>
    );
}

export default PlaySolo;