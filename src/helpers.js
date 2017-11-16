import axios from 'axios';
import querystring from 'querystring';
import { pathOr } from 'ramda';
import { terms } from './terms';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';

const getSpotifyToken = async () => {
    try {
        // auth request to spotify
        const { data } = await axios.post(SPOTIFY_AUTH_URL,
            querystring.stringify({
                grant_type: 'client_credentials'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${process.env.SPOTIFY_BASE64}`
                }
            });

        const { access_token } = data;

        return access_token;
    } catch (e) {
        console.log(e);
    }
};
// Returns a random integer between min (included) and max (included)
const getRandomInt = (min, max) =>  Math.floor(Math.random() * (max - min + 1)) + min;

const getTermFromList = (list) => {
    const index = getRandomInt(0, list.length - 1);

    return list[index];
};

const handleResults = (results, token) => {
    if (!results.total) {
        return performQuery(token)
    }

    const { tracks } = results;
    const extractArtistName = pathOr('Jane Child', [
        'tracks', 'items', 0, 'artists', 0, 'name'
    ]);
    const extractTrackName = pathOr('I don\'t Wanna Fall in Love', [
        'tracks', 'items', 0, 'name'
    ]);
    const artistName = extractArtistName(tracks);
    const trackName = extractTrackName(tracks);

    return `You should play ${trackName} by ${artistName}.`;
};

export const performQuery = async () => {
    try {
        const term = getTermFromList(terms);
        const token = await getSpotifyToken();
        const url = `https://api.spotify.com/v1/search?q=${term}&type=track&limit=1`;
        const { data } = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return handleResults(data);
    } catch (e) {
        console.log(e);
    }
};
