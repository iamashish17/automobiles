const DEFAULT_KHALTI_BASE_URL = 'https://dev.khalti.com/api/v2';

function getKhaltiConfig() {
  const secretKey = process.env.KHALTI_SECRET_KEY;
  if (!secretKey) {
    throw new Error('KHALTI_SECRET_KEY is required');
  }

  return {
    secretKey,
    baseUrl: (process.env.KHALTI_BASE_URL || DEFAULT_KHALTI_BASE_URL).replace(/\/$/, ''),
  };
}

async function khaltiRequest(path, payload) {
  const { secretKey, baseUrl } = getKhaltiConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.detail || data?.error_key || 'Khalti payment request failed');
  }

  return data;
}

exports.initiatePayment = (payload) => khaltiRequest('/epayment/initiate/', payload);
exports.lookupPayment = (pidx) => khaltiRequest('/epayment/lookup/', { pidx });
