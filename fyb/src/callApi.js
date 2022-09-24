const baseurl = (process.env.NODE_ENV === 'production' ? 'https://webappscrabbleclub.azurewebsites.net/api/Values' : 'https://localhost:55557/api/Values');

async function typicalCall(url) {
    let responseText = "";
    try {
        let response = await fetch(url);
        responseText = await response.text();
        const jdata = JSON.parse(responseText);
        jdata.value.error = false;
        return jdata.value;
    } catch (error) {
        return {error: responseText};
    }
}

/**
 * Get chat messages
 * @param {string} chattype GAMECHAT (game), CLASSIC (lobby), or SURVIVAL (lobby)
 * @param {int} chatnumber Chat number required for GAMECHAT only
 * @returns Either {number: <int>, msgs[]: {name: <string>, msg: <string>, time: <int>}} or {error: <string>}
 * @async
 */
export async function callGetChat(chattype, chatnumber) {
    let url = chattype === 'GAMECHAT' ? `${baseurl}/chat/getchat?number=${chatnumber}` : `${baseurl}/chat/getlobbychat?type=${chattype}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Send chat message, get back updated chat data
 * @param {int} number Chat number required to identify the chat
 * @param {string} name The name of the person sending the message
 * @param {string} msg The message to send
 * @returns Either {number: <int>, msgs[]: {name: <string>, msg: <string>, time: <int>}} or {error: <string>}
 * @async
 */
 export async function callSendChat(number, name, msg) {
    let url = `${baseurl}/chat/chatmessage?number=${number}&name=${name}&msg=${msg}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Pick tiles for a game
 * @returns The picked tiles {letters: <string>}, or an error {error: <string>}
 * @async
 */
export async function callPickTiles() {
    let url = `${baseurl}/ENABLE2K/fybpick?guarantee=6`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        return {letters: jdata.value, error: false};
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}
/**
 * Determine whether a word is in the slur-expunged ENABLE2K lexicon, case insensitive
 * @param {string} word A word
 * @returns Whether the word is in the lexicon
 * @async
 */
 export async function isWordValid(word) {
    let url = `${baseurl}/ENABLE2K/exists?word=${word}`; // Server handles case insensitive logic
    let response = await typicalCall(url);
    return response;
}
/**
 * Get the top given number of answers for the given letters
 * @param {string} letters The letters to get answers for
 * @param {int} numWanted The number of answers to get
 * @returns An array of the top answers
 * @async
 */
export async function callGetTopAnswers(letters, numWanted) {
    let url = `${baseurl}/ENABLE2K/fybtopanswers?letters=${letters}&numWanted=${numWanted}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Start the game
 * @param {int} number The game number
 * @returns Game data or an error, json format
 * @async
 */
export async function callStartGame(number) {
    let url =`${baseurl}/fyb/startgame?number=${number}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Send a player move and get back updated game data
 * @param {int} number The game number
 * @param {string} name The player name
 * @param {string} type The type of move (VALID, PHONY, PASS, TIMEOUT)
 * @param {string} word The word
 * @returns The updated game data or an error
 */
export async function callMakeMove(number, name, type, word) {
    let url =`${baseurl}/fyb/makemove?number=${number}&name=${name}&type=${type}&word=${word}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Tell server you want to play again, get back updated game data
 * @param {int} number The game number
 * @returns Game data or an error, json format
 * @async
 */
 export async function callPlayAgain(number) {
    let url =`${baseurl}/fyb/playagain?number=${number}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Get game data
 * @param {int} number The game number
 * @returns Game data or an error, json format
 * @async
 */
 export async function callGetGame(number) {
    let url =`${baseurl}/fyb/getgame?number=${number}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Get game list
 * @param {string} type The game type (CLASSIC, SURVIVAL)
 * @returns Game list or an error, json format
 * @async
 */
 export async function callGetGameList(type) {
    let url =`${baseurl}/fyb/listgames?type=${type}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Create new game
 * @param {string}  type Game type (CLASSIC, SURVIVAL)
 * @param {string}  name Player name
 * @param {boolean} validOnly   Whether to allow mulligans
 * @param {boolean} timeLimit   Whether time limit applies
 * @returns Game data or an error, json format
 * @async
 */
export async function callCreateGame(type, name, validOnly, timeLimit) {
    let url = `${baseurl}/fyb/creategame?type=${type}&name=${name}&validOnly=${validOnly}&timeLimit=${timeLimit}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Join game
 * @param {int} number The game number
 * @param {string} name The player name
 * @returns Game data or an error, json format
 * @async
 */
 export async function callJoinGame(number, name) {
    let url =`${baseurl}/fyb/joingame?number=${number}&name=${name}`;
    let response = await typicalCall(url);
    return response;
}
/**
 * Delete the game
 * @param {int} number The game number
 * @returns The updated game list
 * @async
 */
 export async function callDeleteGame(number) {
    let url =`${baseurl}/fyb/deletegame?number=${number}`;
    let response = await typicalCall(url);
    return response;
}
