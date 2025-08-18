import React from 'react';
import { View, Text } from 'react-native';
import styles from '../theme/styles';

export default function ReportesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Reportes</Text>
      <Text style={styles.subtitle}>
        Aquí podrás consultar reportes detallados de ventas, números y usuarios.
      </Text>
      <Text style={styles.placeholder}>⚙️ Próximamente más funcionalidades...</Text>
    </View>
  );
}
