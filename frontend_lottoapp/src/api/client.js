// src/api/client.js
import Constants from 'expo-constants';
import { getBaseURL } from './baseUrl';

const BASE = getBaseURL();
const API_KEY = (Constants.expoConfig?.extra || {}).apiKey;

function keyHeaders(extra) {
  return {
    'Content-Type': 'application/json',
    'x-app-key': API_KEY,     // ← se envía siempre
    ...(extra || {})
  };
}

export async function apiGet(path) {
  const r = await fetch(`${BASE}${path}`, { headers: keyHeaders() });
  if (r.status === 401) throw new Error('No autorizado (x-app-key)');
  if (!r.ok) throw new Error(`Error GET ${path}`);
  return r.json();
}

export async function apiPost(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: keyHeaders(),
    body: JSON.stringify(body)
  });
  if (r.status === 401) throw new Error('No autorizado (x-app-key)');
  if (!r.ok) {
    const msg = await r.text().catch(() => 'Error POST');
    throw new Error(msg || 'Error POST');
  }
  return r.json();
}

export { BASE as API_BASE_URL };
