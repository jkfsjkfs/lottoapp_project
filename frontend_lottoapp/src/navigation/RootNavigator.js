import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import HomeScreen from '../screens/HomeScreen';
import NumeroScreen from '../screens/NumeroScreen';
import DatosScreen from '../screens/DatosScreen';
import ConfirmacionScreen from '../screens/ConfirmacionScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} options={{ title: 'LOTTO COLEGIAL' }} />
      <Stack.Screen name={ROUTES.NUMERO} component={NumeroScreen} options={{ title: 'Número' }} />
      <Stack.Screen name={ROUTES.DATOS} component={DatosScreen} options={{ title: 'Datos' }} />
      <Stack.Screen name={ROUTES.CONFIRMACION} component={ConfirmacionScreen} options={{ title: 'Confirmación' }} />
    </Stack.Navigator>
  );
}
