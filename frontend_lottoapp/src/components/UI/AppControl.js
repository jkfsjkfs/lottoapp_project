import React from 'react';
import { View, Button, Text } from 'react-native';
import styles from '../../theme/styles';

export function AppButton({ title, onPress, ...props }) {
  return (
    <View style={styles.buttonContainer}>
        <Button title={title} onPress={onPress} {...props} />
    </View>
  );
}

export function AppLabelInput({ title, ...props }) {
    return (
        <View style={styles.buttonContainer}>
            <Text style={styles.inputlabel}>{title}</Text>
        </View>
    );
}


