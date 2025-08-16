// src/screens/ConfirmacionScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../theme/styles';

export default function ConfirmacionScreen({ route, navigation }) {
  const { numero, nombre } = route.params || {};

  const handleAceptar = () => {
    navigation.popToTop(); // Regresa a Home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Registro Exitoso!</Text>
      <Text style={styles.label}>
        {nombre} ha comprado el número {numero}
      </Text>
      <Button title="Aceptar" onPress={handleAceptar} />
    </View>
  );
}
