import React from "react";
import { TouchableOpacity, Text, Image, View, StyleSheet } from "react-native";
import { activePalette } from "../screens/EpisodeScreen";
export default function Card({ title, image, onPress, isList }) {
  return (
    <TouchableOpacity style={isList ? styles.listCard : styles.gridCard} onPress={onPress}>
      {image && <Image source={image} style={isList ? styles.listImage : styles.gridImage} />}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: activePalette.primary,
    alignItems: "center",
  },
  gridImage: {
    width: "100%",
    height: 120,
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: activePalette.primary,
  },
  listImage: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  title: {
    fontWeight: "bold",
    color: activePalette.text,
    padding: 6,
  },
});
