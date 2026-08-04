const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';

export async function apiRequest(path, options = {}) {
  const { token, body, headers, ...rest } = options;
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Unable to connect to the backend server. Start the server on port 3000 and try again.');
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}
