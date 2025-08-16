import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { isNumeroValido } from '../../services/validation/numeroRules';
import styles from '../../theme/styles';

export default function NumeroInput({ value, onChangeText, ...props }) {
  const [touched, setTouched] = useState(false);
  const valido = isNumeroValido(value);
  return (
    <View>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={value}
        onChangeText={onChangeText}
        onBlur={() => setTouched(true)}
        {...props}
      />
      {touched && !valido && <Text style={{ color: 'red' }}>Debe ingresar un número de 2 a 4 cifras.</Text>}
    </View>
  );
}
