import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { episodeImages } from "../utils/episodeImages";

export default function EpisodeScreen({ route }) {
  const { episode } = route.params;

  return (
    <View style={styles.container}>
      <Image source={episodeImages[episode.image]} style={styles.image} />
      <Text style={styles.title}>{episode.title}</Text>
      <Text style={styles.desc}>{episode.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: "100%", height: 200, borderRadius: 12 },
  title: { marginTop: 12, fontSize: 18, fontWeight: "bold" },
  desc: { marginTop: 8 },
});
