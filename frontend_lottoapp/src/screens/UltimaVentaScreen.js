import React from 'react';
import { View, Text } from 'react-native';
import styles from '../theme/styles';
import { Ionicons } from '@expo/vector-icons'; // 👈 iconos de Expo


export default function UltimaVentaScreen() {
  return (
    <View style={styles.container}>
        
      <Text style={styles.title}><Ionicons name="cash-outline" size={25} color="green" />  Última Venta</Text>
      <Text style={styles.subtitle}>
        Aquí podrás visualizar la información de la última venta registrada.
      </Text>
      <Text style={styles.placeholder}>⚙️ Próximamente más funcionalidades...</Text>
    </View>
  );
}

