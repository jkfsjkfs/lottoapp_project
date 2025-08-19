import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import styles from '../theme/styles';
import {AppButton} from '../components/UI/AppControl';

const MIN_VALOR = 1000;   // configurable
const MAX_VALOR = 50000;  // configurable

export default function ApuestaNumerosScreen({ route, navigation }) {
  const { loterias } = route.params;
  const [numero, setNumero] = useState('');
  const [valor, setValor] = useState('');
  const [apuestas, setApuestas] = useState([]);

// Formateador con padding
const formatCurrency = (value, espaciado = false) => {
  const formatted = new Intl.NumberFormat('es-CO').format(value);
  return espaciado ?  formatted.padStart(10, ' ') : formatted; // 👈 rellena hasta 10 caracteres
};


  const agregarApuesta = () => {
    // Validación número: 2 a 4 dígitos
    if (!/^\d{2,4}$/.test(numero)) {
      Alert.alert('Número inválido', 'Debe tener entre 2 y 4 cifras.');
      return;
    }

    // Validación valor: dentro del rango
    const val = parseInt(valor);
    if (isNaN(val) || val < MIN_VALOR || val > MAX_VALOR) {
      Alert.alert(
        'Valor inválido',
        `Valor entre ${formatCurrency(MIN_VALOR)} y 
        ${formatCurrency(MAX_VALOR)}.`
      );
      return;
    }

    // Agregar apuesta válida
    setApuestas([...apuestas, { numero, valor: val }]);
    setNumero('');
    setValor('');
  };

  const eliminarApuesta = (index) => {
    const nuevas = [...apuestas];
    nuevas.splice(index, 1);
    setApuestas(nuevas);
  };

  const total = apuestas.reduce((acc, a) => acc + a.valor, 0);

  return (
    <View style={[styles.container,{alignItems:'left', maxHeight: '80%'}]}>
    {/* Chips con las loterías seleccionadas */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom:5, marginTop:0, paddingTop:0 }}>
        {loterias.map((lot) => (
          <View
            key={lot.idloteria}
            style={[
                  {
                    flex: 1,
                    marginHorizontal: 5,
                    padding: 3,
                    minWidth:'30%',
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: '#d1e7dd',
                  },
                ]}
          >
            <Text style={{ color: '#0a3622', fontWeight: '600' }}>{lot.descrip}</Text>
          </View>
        ))}
      </View>
      <View style={[{alignItems:'center', paddingVertical:0}]}>
      {/* Inputs en fila */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 0 }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="Número"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
          maxLength={4}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 8 }]}
          placeholder={`Valor $`}
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
          maxLength={MAX_VALOR.toString().length}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={agregarApuesta}>
        <Text style={[styles.buttonText,{color:'green', 
              fontWeight: 'bolder', fontSize:18}]}>➕ Agregar</Text>
      </TouchableOpacity>
      </View>
      {/* Listado dinámico */}
      <FlatList
        data={apuestas}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginVertical: 20, width: '100%' }}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              paddingVertical: 3,
              paddingHorizontal: 15,
              marginBottom: 5,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {/* Número y valor alineados */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '500', width: 120 }}>
                🎟️ {item.numero}
              </Text>
              <Text style={{fontSize: 18,  color: '#333', flex: 1, width: 80  }}>
                💲{formatCurrency(item.valor, true)}
              </Text>
            </View>

            {/* Botón eliminar */}
            <TouchableOpacity
              onPress={() => eliminarApuesta(index)}
              style={{
                backgroundColor: '#dc3545',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={[styles.subtitle,{marginBottom:0}]}>Subtotal:  ${formatCurrency(total)}</Text>
      <Text style={[styles.title,{marginBottom:0}]}>Total ({loterias.length} Loterías):   $ {formatCurrency(total)}</Text>        
        {apuestas.length > 0 && (
        <View style={[{alignItems:'center', paddingVertical:'5%'}]}>
          <AppButton title="Continuar" 
            onPress={() => navigation.navigate('Resumen', { loterias, apuestas })} 
              style={[{margin:0, padding:0 }]}
            />
        </View>)}
    </View>
    
  );
}
