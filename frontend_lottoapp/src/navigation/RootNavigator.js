import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { AuthContext } from '../app/AppProvider';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NumeroScreen from '../screens/NumeroScreen';
import DatosScreen from '../screens/DatosScreen';
import ConfirmacionScreen from '../screens/ConfirmacionScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} options={{ title: 'Acceso' }} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} options={{ title: 'LOTTO COLEGIAL' }} />
      <Stack.Screen name={ROUTES.NUMERO} component={NumeroScreen} options={{ title: 'Número' }} />
      <Stack.Screen name={ROUTES.DATOS} component={DatosScreen} options={{ title: 'Datos' }} />
      <Stack.Screen name={ROUTES.CONFIRMACION} component={ConfirmacionScreen} options={{ title: 'Confirmación' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return null;
  }
  return user ? <AppStack /> : <AuthStack />;
}
