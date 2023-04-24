const username = process.env.REACT_APP_SAUCE_USERNAME || '';
const password = process.env.REACT_APP_SAUCE_KEY || '';
const org_id = process.env.REACT_APP_SAUCE_ORG_ID || '';

const authString = `${username}:${password}`;
const encodedAuthString = btoa(authString);

const endpoint = 'http://localhost:3000/api/v2/insights/rdc/test-cases';

export const getRuns = async () => {
  try {
    const url = new URL(endpoint);
    const params = new URLSearchParams({
      org_id,
      limit: '5000',
    });

    url.search = params.toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuthString}`,
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    return response.json();
  } catch (err) {
    console.log(err);
  }
};
