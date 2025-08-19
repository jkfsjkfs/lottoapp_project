import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import styles from '../theme/styles';
import { AppButton } from '../components/UI/AppControl';

export default function LoginScreen() {
  const loginFn = useAuthStore((s) => s.login);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await loginFn(login, password);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo iniciar sesión');
    }
  };

  return (
    <View style={styleLogin.container}>
      <Image 
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={login}
        onChangeText={setLogin}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      
      <AppButton title="Entrar" onPress={handleLogin}/>
      
    </View>
  );
}

const styleLogin = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',      // centra horizontal
    backgroundColor: '#fff',
    padding: 20
    
  }
});
