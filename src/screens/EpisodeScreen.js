import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

export default function EpisodeScreen({ route }) {
  const { episode } = route.params;

  return (
    <View style={styles.container}>
      <Image source={episode.image} style={styles.image} />
      <Text style={styles.title}>{episode.title}</Text>
      <Text style={styles.desc}>{episode.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  title: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  desc: {
    marginTop: 8,
    color: colors.muted,
  },
});
