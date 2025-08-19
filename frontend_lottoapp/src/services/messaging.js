import { Linking, Alert } from 'react-native';

/**
 * Enviar SMS al número indicado
 * @param {string} telefono - Número de celular
 * @param {string} mensaje - Texto a enviar
 */
export const enviarSMS = (telefono, mensaje) => {
  if (!telefono) {
    Alert.alert("Error", "Número de teléfono inválido");
    return;
  }
  const url = `sms:${telefono}?body=${encodeURIComponent(mensaje)}`;
  Linking.openURL(url).catch(() =>
    Alert.alert("Error", "No se pudo abrir SMS en este dispositivo")
  );
};

/**
 * Enviar WhatsApp al número indicado
 * @param {string} telefono - Número de celular en formato internacional (ej: 573001234567)
 * @param {string} mensaje - Texto a enviar
 */
export const enviarWhatsApp = (telefono, mensaje) => {
  if (!telefono) {
    Alert.alert("Error", "Número de teléfono inválido");
    return;
  }
  const url = `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
  Linking.openURL(url).catch(() =>
    Alert.alert("Error", "No se pudo abrir WhatsApp. Asegúrate de tenerlo instalado")
  );
};
