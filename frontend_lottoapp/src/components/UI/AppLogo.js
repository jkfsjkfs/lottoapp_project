import { View, Image } from 'react-native';
import styles from '../../theme/styles';

export default function AppLogo() {
  return (
    <View >
        <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoHome}
            resizeMode="contain"
        />
    </View>
  );
}


