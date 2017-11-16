import axios from 'axios';
import { performQuery } from './src/helpers';

export const song = async (event, context, callback) => {
    const url = process.env.SLACK_WEBHOOK;

    try {
        const result = await performQuery();
        const { data } = await axios.post(url, {
            text: result
        });

        callback(null, { statusCode: 200 });
    } catch (e) {
        callback(e);
    }
};
