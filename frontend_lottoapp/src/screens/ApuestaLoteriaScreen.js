import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import styles from '../theme/styles';
import { apiGet } from '../api/client';
import {AppButton} from '../components/UI/AppControl';

const MAX_SELECTION = 3; // configurable

export default function ApuestaLoteriaScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [loterias, setLoterias] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet('/api/loterias');
        setLoterias(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleSelect = (loteria) => {
    const exists = selected.find((s) => s.idloteria === loteria.idloteria);
    if (exists) {
      // quitar
      setSelected(selected.filter((s) => s.idloteria !== loteria.idloteria));
    } else {
      if (selected.length >= MAX_SELECTION) {
        Alert.alert(`Máximo ${MAX_SELECTION} loterías permitidas`);
        return;
      }
      setSelected([...selected, loteria]);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0056b8" />;

  return (
      <View style={[styles.container,{alignItems:'left', maxHeight:'80%'}]}>
        <View style={[{alignItems: 'center'}]}>
          <Text style={styles.title}>Seleccione Loterías</Text>
        </View>
        <FlatList
          data={loterias}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
          numColumns={3}
          keyExtractor={(item) => item.idloteria.toString()}
          renderItem={({ item }) => {
            const isSelected = selected.some((s) => s.idloteria === item.idloteria);
            return (
              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    marginHorizontal: 5,
                    padding: 10,
                    minWidth:'30%',
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: isSelected ? '#d1e7dd' : '#f0f0f0',
                  },
                ]}
                onPress={() => toggleSelect(item)}
              >
                <Text style={styles.listItemText}>
                  {item.descrip} {isSelected ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        
        {selected.length > 0 && (
          <View style={[{alignItems:'center', paddingVertical:'5%'}]}>
            <AppButton title={`Continuar (${selected.length})`} 
              onPress={() => navigation.navigate('ApuestaNumeros', { loterias: selected })} />
          </View>
        )}
      </View>

  );
}



const styleLotto = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'left',      // centra horizontal
    backgroundColor: '#fff',
    padding: 20,
    maxHeight:'50%'
  },
});