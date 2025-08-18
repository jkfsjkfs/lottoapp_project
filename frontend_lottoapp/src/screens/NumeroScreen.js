// src/screens/NumeroScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';
import styles from '../theme/styles';
import { isNumeroValido } from '../services/validation/numeroRules';
import { AppLabelInput, AppButton } from '../components/UI/AppControl';

export default function NumeroScreen({ navigation }) {
  const [numero, setNumero] = useState('');

  const handleContinue = () => {
    if (!isNumeroValido(numero)) {
      Alert.alert('Número inválido', 'Debe ingresar un número de 2 a 4 cifras.');
      return;
    }
    navigation.navigate('Datos', { numero });
  };

  return (
    <View style={styles.container}>
      <AppLabelInput title='Ingresar Número:' />
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={numero}
        onChangeText={setNumero}
        maxLength={4}
      />
      <AppButton title="Continuar" onPress={handleContinue} />
    </View>
  );
}
