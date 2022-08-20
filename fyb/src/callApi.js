const baseurl = (process.env.NODE_ENV === 'production' ? 'https://enigmatic-lake-42795.herokuapp.com' : 'http://localhost:5000');

/**
 * Call the game server.
 * @param {string} route The part of the route that is specific to what the call is for
 * @returns The api response json. If an error is trapped the json is {error: 'Problem with url'} where url is the full url used.
 * @async
 */
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
 * @returns Whether the word is in the lexicon
 * @async
 */
 export async function isWordValid(word) {
    let url = `${baseurl}/ENABLE2K?exists=${word}`; // Server handles case insensitive logic
    const response = await fetch(url);
    const jdata = await response.json();
    return jdata.exists;
}
