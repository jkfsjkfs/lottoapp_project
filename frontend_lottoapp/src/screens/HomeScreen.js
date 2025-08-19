import React from 'react';
import { useAuthStore } from '../store/authStore';
import { PROFILES } from '../constants/profiles';
import { View, Image } from 'react-native';
import styles from '../theme/styles';
import HomeAdminScreen from './HomeAdminScreen';
import HomePromotorScreen from './HomePromotorScreen';
import HomeVendedorScreen from './HomeVendedorScreen';



export default function HomeScreen({ navigation }) {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;
 
    switch (user.idperfil) {
      case PROFILES.ADMIN.id:
        return <HomeAdminScreen navigation={navigation} />;
      case PROFILES.PROMOTOR.id:
        return <HomePromotorScreen navigation={navigation} />;
      case PROFILES.VENDEDOR.id:
        return <HomeVendedorScreen navigation={navigation} />;
      default:
        return <HomeVendedorScreen navigation={navigation} />; // fallback
    }
  
}
