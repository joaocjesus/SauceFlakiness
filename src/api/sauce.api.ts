import { Buffer } from 'buffer';
import { throwErrorIfAnyEmpty } from '../helpers/helpers';

const {
  REACT_APP_USERNAME: USERNAME,
  REACT_APP_KEY: PASSWORD,
  REACT_APP_ORG_ID: ORG_ID,
  REACT_APP_API_URL: API_URL,
  REACT_APP_TESTS_ENDPOINT: TESTS_ENDPOINT,
  REACT_APP_API_ENV: API_ENV,
} = process.env;

const ENDPOINT = `${API_URL}${TESTS_ENDPOINT}`;
const encodedAuthString = (Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64'));

export const getTestCases = async () => {

  throwErrorIfAnyEmpty({ USERNAME, PASSWORD, ORG_ID, API_URL, ENDPOINT, TESTS_ENDPOINT });

  try {
    const request = new URL(ENDPOINT);
    const params = new URLSearchParams({
      org_id: ORG_ID || '',
      limit: '5000',
    });

    request.search = params.toString();

    if (API_ENV === 'LOCAL') {
      return require('./testcases.json');
    }

    Logger.log('Request: ', request)

    const response = await fetch(request, {
      method: 'GET',
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Basic ${encodedAuthString}`,
      },
      redirect: 'follow',
    });

    Logger.log('Response: ', response);
    return response.json();
  } catch (err) {
    Logger.error(err);
  }
};
