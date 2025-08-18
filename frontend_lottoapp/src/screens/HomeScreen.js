import { View, Text, Button, Image } from 'react-native';
import styles from '../theme/styles';

import { AppButton } from '../components/UI/AppControl';

export default function HomeScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/logo.png')}
        style={styles.logoHome}
        resizeMode="contain"
      />

      
      <AppButton title="Comenzar" onPress={() => navigation.navigate('Numero')} />
      

   
    </View>
  );
}
