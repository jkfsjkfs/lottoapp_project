import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { enviarSMS, enviarWhatsApp } from '../../services/messaging';

export default function MessageActionsModal({ telefono, mensaje }) {
  const [visible, setVisible] = useState(false);


  return (
    <View>
      {/* Botón principal */}
      <TouchableOpacity
        style={styles.mainBtn}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="share-social-outline" size={22} color="#fff" />
        <Text style={styles.mainBtnText}>Enviar</Text>
      </TouchableOpacity>

      {/* Modal con opciones */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.title}>Enviar por:</Text>

            <TouchableOpacity
              style={[styles.option, { backgroundColor: '#0d6efd' }]}
              onPress={() => {
                setVisible(false);
                enviarSMS(telefono, mensaje);
              }}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#fff" />
              <Text style={styles.optionText}>SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, { backgroundColor: '#25d366' }]}
              onPress={() => {
                setVisible(false);
                enviarWhatsApp(telefono, mensaje);
              }}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.optionText}>WhatsApp</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056b8',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: 'center',
  },
  mainBtnText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    width: '100%',
    justifyContent: 'center',
  },
  optionText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});
