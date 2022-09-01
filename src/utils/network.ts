import 'whatwg-fetch';

export const call = async ({
  url,
  body = null,
  headers = {},
  parseJson = true
}: {
  url: string;
  body?: any;
  headers?: Record<string, any>;
  cachedFallback?: boolean;
  parseJson?: boolean;
}) => {
  console.log('[NETWORK]', `Calling endpoint:`, url.split('?')[0]);

  try {
    const response = await window.fetch(url, {
      method: !body ? 'GET' : 'POST',
      body: !body ? undefined : JSON.stringify(body),
      headers: {
        ...headers
      }
    });

    if (response.status === 200) {
      const returnableResponse = parseJson ? await response.json() : await response.text();

      return returnableResponse;
    }
    throw new Error('Non 200 response received' + response.status + ':' + response.statusText);
  } catch (err) {
    console.error(
      '[NETWORK]`, `Downstream call returned non 200 response. Failed to call:',
      JSON.stringify({ url }),
      err
    );

    // Network call failed and no cache available.
    // This is bad
    return {};
  }
};
