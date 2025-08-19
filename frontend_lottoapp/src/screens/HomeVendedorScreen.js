import React, {  useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../components/UI/AppLogo';
import { apiGet } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


export default function HomeVendedorScreen({ navigation }) {
  // TODO: estos valores vendrán del backend

  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [ventasTotales, setVentas] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [currentDate, setFecha] = useState('');
  
  
  const fetchResumen = async () => {
    try {
      const hoy = new Date();
      setFecha(hoy);
    const data = await apiGet(`/api/ventas/resumen?idusuario=${user.idusuario}&fecha=${hoy.toISOString().split('T')[0]}`);
      setVentas(data.ventasTotales);
      setComisiones(data.comisiones);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 cada vez que el screen tiene focus → refresca
  useFocusEffect(
    useCallback(() => {
      fetchResumen();
    }, [user.idusuario])
  );

  if (loading) return <ActivityIndicator size="large" color="#0056b8" />;

  return (
    <View style={styles.container}>
    <AppLogo/>
      {/* Resumen de ventas */}
      <Text style={styles.title}>Fecha: {currentDate.toLocaleDateString('es-CO')}</Text>          
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Ventas Totales</Text>
          <Text style={styles.summaryValue}>${ventasTotales.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Comisiones</Text>
          <Text style={styles.summaryValue}>${comisiones.toLocaleString()}</Text>
        </View>
      </View>

      {/* Acceso principal */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate('Apuesta')}
      >
        <Ionicons name="ticket-outline" size={70} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.mainButtonText}>Apuesta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    padding: 20,
  },
  title:{
    fontSize:24,
    fontWeight:'bold',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0056b8',
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 15,
    width: '95%',
    height: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mainButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
});
