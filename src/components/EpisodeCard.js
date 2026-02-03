import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../styles/colors";

export default function EpisodeCard({ episode, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: episode.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {episode.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 100,
  },
  info: {
    padding: 8,
  },
  title: {
    color: colors.text,
    fontWeight: "bold",
  },
  desc: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
});
