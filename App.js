import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from "react";

export default function App() {
  return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <Text style={{ color: "white" }}>APP CARGADA</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
