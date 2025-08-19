import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AppLabelInput, AppButton } from '../components/UI/AppControl';
import styles from '../theme/styles';
import AppLogo from '../components/UI/AppLogo';

export default function HomeAdminScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AppLogo/>
      <Text style={styles.title}>🏛️ Dashboard Administrador</Text>
      <Text style={styles.subtitle}>
        Aquí verás estadísticas y configuraciones globales.
      </Text>
      <AppButton
        title="Comenzar"
        onPress={() => navigation.navigate('Numero')}
      />
    </View>
  );
}
