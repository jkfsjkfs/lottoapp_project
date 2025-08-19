import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons, Entypo, FontAwesome5 } from "@expo/vector-icons";

export default function ReportesScreen({ navigation }) {
  const menuItems = [
    {
      id: "venta",
      title: "Venta Detallado",
      desc: "Ventas realizadas en un rango de fechas.",
      icon: <MaterialIcons name="shopping-bag" size={28} color="#4CAF50" />,
      route: "VentaDetallado",
    },
    {
      id: "premios",
      title: "Premios",
      desc: "Lista de ganadores por fecha.",
      icon: <Entypo name="medal" size={28} color="#2196F3" />,
      route: "Premios",
    },
    {
      id: "resultados",
      title: "Resultados",
      desc: "Consulte la lista de resultados por fecha.",
      icon: <MaterialIcons name="list-alt" size={28} color="#FFC107" />,
      route: "Resultados",
    },
    {
      id: "cierres",
      title: "Cierres",
      desc: "Horarios de apertura y cierre de loterías.",
      icon: <FontAwesome5 name="times-circle" size={28} color="#F44336" />,
      route: "Cierres",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => navigation.navigate(item.route)}
        >
          <View style={styles.icon}>{item.icon}</View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  desc: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
});
