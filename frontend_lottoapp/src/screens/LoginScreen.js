import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import styles from '../theme/styles';
import { AuthContext } from '../app/AppProvider';
import { loginUsuario } from '../services/api/authService';
import useAuth from '../hooks/useAuth';





export default function LoginScreen() {
const { user, loading } = useAuth();
console.log('CTX:', { user, loading });
}

/*
export default function LoginScreenA() {

  const { login } = useContext(AuthContext);
  const [loginText, setLoginText] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  

  const onSubmit = async () => {
    if (!loginText || !password) {
      Alert.alert('Campos requeridos', 'Ingresa usuario y contraseña.');
      return;
    }
    setCargando(true);
    try {
      await login(loginText, password, loginUsuario);
    } catch (e) {
      Alert.alert('Error', e?.message || 'No fue posible iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <Text style={styles.label}>Usuario</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={loginText}
        onChangeText={setLoginText}
        placeholder="tu_usuario"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      {cargando ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Entrar" onPress={onSubmit} />
      )}
    </View>
  );
}


*/