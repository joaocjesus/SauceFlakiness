import { Buffer } from 'buffer';

const USERNAME = process.env.REACT_APP_SAUCE_USERNAME || '';
const PASSWORD = process.env.REACT_APP_SAUCE_KEY || '';
const ORG_ID = process.env.REACT_APP_SAUCE_ORG_ID || '';
const ENDPOINT = `${process.env.REACT_APP_SAUCE_ENDPOINT}/v2/insights/rdc/test-cases`;

const encodedAuthString = (Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64'));
console.log(encodedAuthString);

export const getRuns = async () => {
  try {
    const request = new URL(ENDPOINT);
    const params = new URLSearchParams({
      org_id: ORG_ID,
      limit: '5000',
    });

    request.search = params.toString();

    console.log(request);

    const response = await fetch(request, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Basic ${encodedAuthString}`,
        'Access-Control-Allow-Origin': 'https://flakiness.pages.dev',
      },
      redirect: 'follow',
    });
    console.log(response);
    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    return response.json();
  } catch (err) {
    console.log(err);
  }
};
