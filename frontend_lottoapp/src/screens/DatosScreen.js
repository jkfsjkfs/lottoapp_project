// src/screens/DatosScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import styles from '../theme/styles';
import { apiGet, apiPost } from '../api/client';

export default function DatosScreen({ route, navigation }) {
  const { numero } = route.params;
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistrar = async () => {
    if (!nombre || !telefono) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos.');
      return;
    }

    setCargando(true);
    try {
      // 1) Consultar si el número ya existe
      /*
      const yaExiste = await apiGet(`/api/registros/${numero}`);
      const ocupado = Array.isArray(yaExiste) && yaExiste.length > 0;

      if (ocupado) {
        setCargando(false);
        Alert.alert('Número en uso', `El número ${numero} ya está registrado.`);
        return;
      }
      */
      // 2) Registrar
      await apiPost('/api/registros', { numero, nombre, telefono });

      setCargando(false);
      navigation.navigate('Confirmacion', { numero, nombre });
    } catch (err) {
      setCargando(false);
      Alert.alert('Error', err?.message || 'No se pudo registrar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Tu nombre"
      />
      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Tu teléfono"
      />
      <Text style={styles.label}>Número comprado: {numero}</Text>

      {cargando ? (
        <ActivityIndicator
          size="large"
          color="#0056b8"
          style={{ marginTop: 20 }}
        />
      ) : (
        <Button title="Registrar" onPress={handleRegistrar} />
      )}
    </View>
  );
}
