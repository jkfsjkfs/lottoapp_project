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


async function handleResponse(r, method, path) {
  let data;
  try {
    data = await r.json(); // intenta parsear JSON
  } catch {
    const txt = await r.text();
    data = { message: txt };
  }

  if (!r.ok) {
    if (r.status === 401) {
      throw new Error(data.message || "No autorizado (x-app-key)");
    }
    throw new Error(data.message || `Error ${method} ${path}`);
  }

  return data;
}

export async function apiGet(path) {
  const r = await fetch(`${BASE}${path}`, { headers: keyHeaders() });
  return handleResponse(r, "GET", path);
}

export async function apiPost(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: keyHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(r, "POST", path);
}


export { BASE as API_BASE_URL };
