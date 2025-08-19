import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { apiGet } from '../api/client';
import { useAuthStore } from '../store/authStore';
import styles from '../theme/styles';

import MessageActionsModal from '../components/UI/MessageActionsModal';



export default function UltimaVentaScreen() {
  const user = useAuthStore((s) => s.user);
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet(`/api/ventas/ultima?idusuario=${user.idusuario}`);
        setVenta(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0056b8" />;



  if (!venta) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>No hay ventas registradas</Text>
      </View>
    );
  }

  const { registro, detalles } = venta;

  // 👇 Calculamos total y comisión en el frontend
  const total = detalles.reduce((acc, d) => acc + d.valor, 0);
  const comision = user?.comision ? (total * user.comision) / 100 : 0;

  return (
    <View style={[styles.container,{ alignItems:'left', maxHeight: '82%'}]}>
      <View style={[{alignItems:'center'}]}>
        <Text style={styles.title}>🧾 Última Venta</Text>
      </View>

      <View style={[{alignItems:'flex-start'}]}>
        <Text style={styles.subtitle}>Fecha:  {new Date(registro.fecha).toLocaleString()}</Text>
        <Text style={styles.subtitle}>Venta #:  {registro.id}</Text>
        <Text style={styles.subtitle}>Cliente:  {registro.nombre}</Text>
        <Text style={styles.subtitle}>Teléfono:  {registro.telefono}</Text>
      </View>
      
<MessageActionsModal
  telefono={registro.telefono}
  mensaje={`Hola ${registro.nombre}, tu apuesta fue registrada. 
Fecha:  ${registro.fecha.toLocaleString()} #Venta: ${registro.id} Vendedor: ${registro.idusuario}
Números: ${venta.detalles.map(a => `${a.numero} (${a.loteria})`).join(", ")} 
Total: $${total.toLocaleString('es-CO')}`}
/>

      {/* Resumen de totales */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        width: '100%',
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#666' }}>Total Venta</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0056b8' }}>
            ${total.toLocaleString('es-CO')}
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#666' }}>Comisión</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#28a745' }}>
            ${comision.toLocaleString('es-CO')}
          </Text>
        </View>
      </View>



      {/* Listado de apuestas */}
      <FlatList
        data={detalles}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: 10, width: '100%' }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa',
              padding: 10,
              borderRadius: 8,
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              🎟️ {item.numero} ({item.loteria})
            </Text>
            <Text style={{ fontSize: 16, color: '#333' }}>
              💲{item.valor.toLocaleString('es-CO')}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
