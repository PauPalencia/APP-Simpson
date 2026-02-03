import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

export default function EpisodeScreen({ route }) {
  const { episode } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: episode.image }} style={styles.image} />
      <Text style={styles.title}>{episode.title}</Text>
      <Text style={styles.text}>{episode.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    color: colors.muted,
    fontSize: 14,
  },
});
