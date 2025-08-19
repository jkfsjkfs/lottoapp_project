import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import styles from '../theme/styles';
import { apiPost } from '../api/client';
import AppLogo from '../components/UI/AppLogo'
import {AppButton} from '../components/UI/AppControl';

export default function ApuestaResumenScreen({ route, navigation }) {
  const { loterias, apuestas } = route.params;

  // Datos comprador
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  // Cálculos
  const subtotal = apuestas.reduce((acc, a) => acc + a.valor, 0);
  const total = subtotal * loterias.length; // multiplicar × cantidad de loterías

  // Formateador con padding
  const formatCurrency = (value, espaciado = false) => {
    const formatted = new Intl.NumberFormat('es-CO').format(value);
    return espaciado ?  formatted.padStart(10, ' ') : formatted; // 👈 rellena hasta 10 caracteres
  };


  const confirmar = async () => {
    if (!nombre || !telefono) {
      Alert.alert('Datos incompletos', 'Por favor ingresa nombre y teléfono del comprador.');
      return;
    }

    try {
      await apiPost('/api/apuestas', { loterias, apuestas, total, comprador: { nombre, telefono } });
      Alert.alert('✅ Éxito', 'Apuesta registrada correctamente');
      navigation.popToTop();
    } catch (err) {
      Alert.alert('❌ Error', err.message);
    }
  };

  return (
    <View style={[styles.container,{ alignItems:'left', maxHeight: '82%'}]}>
      <View style={[{alignItems:'center'}]}>
      <AppLogo/>
      {/* Datos comprador */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del comprador"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />
      <Text style={[styles.title,{marginBottom:0}]}>Total ({loterias.length} Loterías):   $ {formatCurrency(total)}</Text>        


      </View>

      {/* Botón confirmar */}
      {apuestas.length > 0 && (
            <View style={[{alignItems:'center', paddingVertical:'5%'}]}>
              <AppButton title="Confirmar Apuesta" 
                onPress={confirmar} 
                />
            </View>)}


      <View style={[{alignItems:'center'}]}>
      <Text style={styles.subtitle}>-------------------------------------------</Text>
      
      <Text style={styles.subtitle}>Resumen de la Apuesta</Text>
      {/* Loterías seleccionadas */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
        {loterias.map((lot) => (
          <View
            key={lot.idloteria}
            style={{
              backgroundColor: '#d1e7dd',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              margin: 4,
            }}
          >
            <Text style={{ color: '#0a3622', fontWeight: '600' }}>{lot.descrip}</Text>
          </View>
        ))}
      </View>

      {/* Listado apuestas */}
      <FlatList
        data={apuestas}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginBottom: 20, width: '100%' }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa',
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '500' }}>🎟️ {item.numero}</Text>
            <Text style={{ fontSize: 16, color: '#333' }}>💲{item.valor.toLocaleString('es-CO')}</Text>
          </View>
        )}
      />
      </View>
      <View style={[{alignItems:'flex-end'}]}>
        <Text style={styles.subtitle}>Subtotal: ${subtotal.toLocaleString('es-CO')}</Text>
        </View>
    </View>
  );
}
