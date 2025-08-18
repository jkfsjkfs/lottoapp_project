import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { useAuthStore } from '../store/authStore';



import styles from '../theme/styles';
import { View,  Text,  TouchableOpacity,  Modal,  Pressable,  Alert, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 👈 iconos de Expo
import ProfileScreen from '../screens/ProfileScreen';
import ReportesScreen from '../screens/ReportesScreen';
import UltimaVentaScreen from '../screens/UltimaVentaScreen';

import { PROFILES, getProfileName } from '../constants/profiles';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NumeroScreen from '../screens/NumeroScreen';
import DatosScreen from '../screens/DatosScreen';
import ConfirmacionScreen from '../screens/ConfirmacionScreen';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
      })}
    >
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.NUMERO} component={NumeroScreen} />
      <Stack.Screen name={ROUTES.DATOS} component={DatosScreen} />
      <Stack.Screen name={ROUTES.CONFIRMACION} component={ConfirmacionScreen} />
      <Stack.Screen name={ROUTES.PERFIL} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.REPORTES} component={ReportesScreen} />
      <Stack.Screen name={ROUTES.ULTIMAVENTA} component={UltimaVentaScreen} />
    </Stack.Navigator>
  );
}


function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}


function CustomHeader({ navigation }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuVisible, setMenuVisible] = useState(false);


  const handleExit = () => {
    Alert.alert('Salir de la app', '¿Seguro que quieres salir sin cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí,Salir', style: 'destructive', onPress: () => {
        BackHandler.exitApp();
      }},
    ]);
  };

  return (
    <View style={styles.header}>
      {/* Usuario a la izquierda */}
      <Text style={styles.userName}>{user?.nombre || 'Usuario'} ({getProfileName(user?.idperfil)})</Text>

      {/* Botón hamburguesa */}
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={28} color="#FFD700" />
      </TouchableOpacity>

      {/* Menú modal */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable
          style={styles.backdrop}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            {/* Home */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate(ROUTES.HOME);
              }}
            >
              <Ionicons name="home-outline" size={20} color="#0056b8" />
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            {/* Perfil */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate(ROUTES.PERFIL);
              }}
            >
              <Ionicons name="person-outline" size={20} color="#0056b8" />
              <Text style={styles.menuText}>Perfil</Text>
            </TouchableOpacity>


            {/* Reportes y Última Venta → solo si idperfil === 3 */}
            {user?.idperfil === PROFILES.VENDEDOR.id && (
              <>
               <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate(ROUTES.REPORTES);
                  }}
                >
                  <Ionicons name="bar-chart-outline" size={20} color="#0056b8" />
                  <Text style={styles.menuText}>Reportes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate(ROUTES.ULTIMAVENTA);
                  }}
                >
                  <Ionicons name="cash-outline" size={20} color="#0056b8" />
                  <Text style={styles.menuText}>Última Venta</Text>
                </TouchableOpacity>

              </>
            )}


            {/* Salir de la app */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                handleExit();
              }}
            >
              <Ionicons name="exit-outline" size={20} color="red" />
              <Text style={[styles.menuText, { color: 'red' }]}>Salir de la app</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}


export default function RootNavigator() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init(); // 👈 valida expiración de 12h
  }, []);

  if (loading) return <SplashScreen />;

  return user ? <AppStack /> : <AuthStack />;
}
