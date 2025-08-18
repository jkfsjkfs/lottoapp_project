import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput, ActivityIndicator } from 'react-native';
import styles from '../theme/styles';
import NumeroInput from '../components/domain/NumeroInput';
import { isNumeroValido } from '../services/validation/numeroRules';
import { apiGet, apiPost } from '../api/client'; // preserva cliente existente si aplica
import useAuth from '../hooks/useAuth';

const { user } = useAuth(); // user.idusuario, user.idperfil

export default function HomeScreen({ route, navigation }) {
  // Nota: Esta pantalla fue extraída automáticamente desde App.js.
  // Ajusta imports/handlers si es necesario.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOTTO APP21</Text>
      <Button title="Comenzar" onPress={() => navigation.navigate('Numero')} />
    </View>
  );

}
