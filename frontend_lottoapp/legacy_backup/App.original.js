import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { apiGet, apiPost } from './src/api/client';


const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOTTO COLEGIAL</Text>
      <Button title="Comenzar" onPress={() => navigation.navigate('Numero')} />
    </View>
  );
}

function NumeroScreen({ navigation }) {
  const [numero, setNumero] = useState('');

  const handleContinue = () => {
    if (!/^[0-9]{2,4}$/.test(numero)) {
      Alert.alert('Número inválido', 'Debe ingresar un número de 2 a 4 cifras.');
      return;
    }
    navigation.navigate('Datos', { numero });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ingresar Número</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={numero}
        onChangeText={setNumero}
        maxLength={4}
      />
      <Button title="Continuar" onPress={handleContinue} />
    </View>
  );
}


function DatosScreen({ route, navigation }) {
  const { numero } = route.params;
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);

const handleRegistrar = async () => {
  if (!nombre || !telefono) {
    Alert.alert('Campos requeridos', 'Por favor completa todos los campos.');
    return;
  }

  setCargando(true);
  try {
    // 1) Consultar si el número ya existe
    /*const yaExiste = await apiGet(`/api/registros/${numero}`);
    const ocupado = Array.isArray(yaExiste) && yaExiste.length > 0;

    if (ocupado) {
      setCargando(false);
      Alert.alert('Número en uso', `El número ${numero} ya está registrado.`);
      return;
    }
    */
    // 2) Registrar
    await apiPost('/api/registros', { numero, nombre, telefono });

    setCargando(false);
    navigation.navigate('Confirmacion', { numero, nombre });
  } catch (err) {
    setCargando(false);
    Alert.alert('Error', err?.message || 'No se pudo registrar.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />
      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />
      <Text style={styles.label}>Número comprado: {numero}</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#0056b8" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Registrar" onPress={handleRegistrar} />
      )}
    </View>
  );
}


function ConfirmacionScreen({ route, navigation }) {
  const { numero, nombre } = route.params;

  const handleAceptar = () => {
    navigation.popToTop(); // Regresa a la pantalla inicial (Home)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Registro Exitoso!</Text>
      <Text style={styles.label}>{nombre} ha comprado el número {numero}</Text>
      <Button title="Aceptar" onPress={handleAceptar} />
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />
        <Stack.Screen name="Numero" component={NumeroScreen} options={{ title: 'Registrar Número' }} />
        <Stack.Screen name="Datos" component={DatosScreen} options={{ title: 'Datos del Comprador' }} />
        <Stack.Screen name="Confirmacion" component={ConfirmacionScreen} options={{ title: 'Confirmación' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#0056b8',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});
