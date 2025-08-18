import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { getProfileName } from '../constants/profiles';
import styles from '../theme/styles';
import { AppButton } from '../components/UI/AppControl';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

const handleLogout = () => {
      Alert.alert('Cerrar sesión', '¿Seguro que deseas cerrar sesión?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí,Cerrar', style: 'destructive', onPress: logout },
      ]);
    }


  return (
    <View style={stylesProfile.container}>
      {/* Icono como avatar */}
      <View style={stylesProfile.avatar}>
        <Ionicons name="person-circle-outline" size={120} color="#0056b8" />
      </View>

      {/* Nombre */}
      <Text style={stylesProfile.name}>{user?.nombre || 'Usuario'}</Text>

      {/* Info básica */}
      <View style={stylesProfile.infoBox}>
        <Ionicons name="id-card-outline" size={20} color="#0056b8" />
        <Text style={stylesProfile.label}>ID Usuario:</Text>
        <Text style={stylesProfile.value}>{user?.idusuario}</Text>
      </View>

      <View style={stylesProfile.infoBox}>
        <Ionicons name="people-outline" size={20} color="#0056b8" />
        <Text style={stylesProfile.label}>Perfil:</Text>
        <Text style={stylesProfile.value}>{user?.idperfil || 'N/A'} - {getProfileName(user?.idperfil)}</Text>
      </View>

      <View style={stylesProfile.infoBox}>
        <Ionicons name="person-outline" size={20} color="#0056b8" />
        <Text style={stylesProfile.label}>Login:</Text>
        <Text style={stylesProfile.value}>{user?.login}</Text>
      </View>

      {/* Botón cerrar sesión */}

      <View style={stylesProfile.buttonContainer}>
        <TouchableOpacity style={stylesProfile.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={stylesProfile.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stylesProfile = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  avatar: {
    marginVertical: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0056b8',
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Android
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  value: {
    color: '#555',
  },
  logoutBtn: {
    flexDirection: 'row',
    textAlign:'center',
    alignItems: 'center',
    justifyContent: 'center', // 👈 centra horizontalmente
    marginTop: 40,
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 10,
    width: '90%',
    borderRadius: 8,
    overflow: 'hidden'
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
