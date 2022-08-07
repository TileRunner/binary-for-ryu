
const ShowFryLetters = ({fryLetters, selected, setFryLetters, setSelected}) => 
    <div className="fryLetterDiv">
        {fryLetters.map((fl, i) => (
            <span key={`SoloFryLetter${i}`}
                className={i === selected ? "fybFryLetter Selected" : "fybFryLetter"}
                onDoubleClick={() => {
                    let moveLetter = fryLetters[i];
                    let shiftedLetters = [...fryLetters];
                    shiftedLetters.splice(i, 1);
                    shiftedLetters.push(moveLetter);
                    setFryLetters([...shiftedLetters]);
                    setSelected(-1);
                } }
                onClick={() => {
                    if (selected === -1) {
                        setSelected(i);
                    } else if (i === selected) {
                        setSelected(-1); // unselect when clicked a second time
                    } else {
                        // Move selected tile to this position
                        let shiftedLetters = [];
                        let moveLetter = fryLetters[selected];
                        for (let index = 0; index < fryLetters.length; index++) {
                            const element = fryLetters[index];
                            if (index === i) {
                                shiftedLetters.push(moveLetter);
                            }
                            if (index !== selected) {
                                shiftedLetters.push(element);
                            }
                        }
                        setFryLetters(shiftedLetters);
                        setSelected(-1);
                    }
                } }
            >{fl}</span>
        ))}
        <button className="trButton fryLetterActionButton" onClick={() => {
            let shuffleSize = fryLetters.length;
            let beforeShuffle = [...fryLetters];
            let afterShuffle = [];
            while (afterShuffle.length < shuffleSize) {
                let rand = Math.floor(Math.random() * beforeShuffle.length);
                afterShuffle.push(beforeShuffle[rand]);
                beforeShuffle.splice(rand, 1);
            }
            setFryLetters(afterShuffle);
            setSelected(-1);
        } }>
            <i className="material-icons fryLetterActionButtonIcon">cached</i>
        </button>
        <button className="trButton fryLetterActionButton" onClick={() => {
            let sortwork = [...fryLetters];
            sortwork.sort();
            setFryLetters(sortwork);
            setSelected(-1);
        } }>
            <i className="material-icons fryLetterActionButtonIcon">sort_by_alpha</i>
        </button>
    </div>


export default ShowFryLetters;