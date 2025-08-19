import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AppLabelInput, AppButton } from '../components/UI/AppControl';
import styles from '../theme/styles';
import AppLogo from '../components/UI/AppLogo';

export default function HomePromotorScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AppLogo/>
      <Text style={styles.title}>📣 Dashboard Promotor</Text>
      <Text style={styles.subtitle}>Accesos a ventas, clientes y reportes rápidos.</Text>

      <AppButton
        title="Comenzar"
        onPress={() => navigation.navigate('Numero')}
      />
    </View>
  );
}
