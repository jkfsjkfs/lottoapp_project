import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setItem(key, value) {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

export async function getItem(key, fallback = null) {
  try {
    const v = await AsyncStorage.getItem(key);
    return v != null ? JSON.parse(v) : fallback;
  } catch (e) { return fallback; }
}

export async function removeItem(key) {
  try { await AsyncStorage.removeItem(key); } catch (e) {}
}
