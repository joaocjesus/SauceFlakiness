const username = 'joaocjesus'
const password = 'bda43089-bcb0-4371-9552-ba88cd1dbced';

export const getRuns = async () => {
  try {
    const url = new URL('http://localhost:3000/api/v2/insights/rdc/test-cases');

    const authString = `${username}:${password}`;
    const encodedAuthString = btoa(authString);

    const params = new URLSearchParams({
      org_id: '2eb32510441f430e96161acc6fb8c441',
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

    console.log('-->', response);

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    return response.json();
  } catch (err) {
    console.log(err);
  }
};
