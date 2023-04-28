import { Buffer } from 'buffer';

const username = process.env.REACT_APP_SAUCE_USERNAME || '';
const password = process.env.REACT_APP_SAUCE_KEY || '';
const org_id = process.env.REACT_APP_SAUCE_ORG_ID || '';
const endpoint = `${process.env.REACT_APP_SAUCE_ENDPOINT}/v2/insights/rdc/test-cases`;
const encodedAuthString = (Buffer.from(`${username}:${password}`).toString('base64'));

export const getRuns = async () => {
  try {
    const url = new URL(endpoint);
    const params = new URLSearchParams({
      org_id,
      limit: '5000',
    });

    url.search = params.toString();

console.log(url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Basic ${encodedAuthString}`,
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    return response.json();
  } catch (err) {
    console.log(err);
  }
};
