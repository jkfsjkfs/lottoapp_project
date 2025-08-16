// src/api/baseUrl.js
import Constants from 'expo-constants';

export function getBaseURL() {
  const extra = Constants.expoConfig?.extra || {};
  const port = extra.apiPortDev || 3001;

  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri; // "192.168.x.x:19000"
    if (hostUri) {
      const host = hostUri.split(':')[0];
      return `http://${host}:${port}`;
    }
    // Fallbacks si no hay hostUri:
    // return `http://10.0.2.2:${port}`;   // Android emulador
    // return `http://localhost:${port}`;  // iOS simulador
  }

  return extra.apiURLProd || 'https://tu-dominio.com';
}
