import React from 'react';
import { Button } from 'react-native';

export default function AppButton({ title, onPress, ...props }) {
  return <Button title={title} onPress={onPress} {...props} />;
}
