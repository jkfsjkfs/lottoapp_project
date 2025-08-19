import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Logo de la app */}
      <Image
        source={require('../../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Subtítulo */}
      <Text style={styles.subtitle}>Cargando tu suerte...</Text>

      {/* Loader */}
      <ActivityIndicator size="large" color="#0056b8" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5', // Azul corporativo de fondo
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#0A2342',
  },
});
