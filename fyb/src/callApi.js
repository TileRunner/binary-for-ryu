const baseurl = (process.env.NODE_ENV === 'production' ? 'https://enigmatic-lake-42795.herokuapp.com' : 'http://localhost:5000');

export async function callApi(route) {
    let url = `${baseurl}/fyb/${route}`;
    try {
        const response = await fetch(url);
        const jdata = await response.json();
        return jdata;           
    } catch (error) {
        console.log(error);
        return {error: 'Problem with ' + url};
    }
}

/**
 * Determine whether a word is in the slur-expunged ENABLE2K lexicon, case insensitive
 * @param {string} word A word
 * @returns Whether the word is in the ENABLE2K lexicon
 * @async
 */
 export async function isWordValid(word) {
    let url = `${baseurl}/ENABLE2K?exists=${word.toLowerCase()}`;
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.exists;
}

/** Pre pick all fry letters for a game
 * @returns A string of pre-picked fry letters.
 * @async
 */
export async function prepickFryLetters() {
    let url = `${baseurl}/ENABLE2K?prepickfry=true&guarantee=6`;
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.fryLetters.join('');
}

/**
 * 
 * @param {Array[string]} fryLetters The fry letters that you want possible answers for
 * @param {number} count The number of possible answers to return
 * @returns {Array[string]} An array of possible answers
 */
export async function getPossibleAnswers(fryLetters, count) {
    let url = `${baseurl}/ENABLE2K?topfry=true&letters=${fryLetters.join('')}&count=${count}`;
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.answers;
}