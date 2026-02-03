import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import EpisodeCard from "../components/EpisodeCard";
import { colors } from "../styles/colors";

const EPISODES = [
  {
    id: "1",
    title: "Episodio 1",
    image: "https://via.placeholder.com/300x200",
    description: "El inicio del recuerdo.",
  },
  {
    id: "2",
    title: "Episodio 2",
    image: "https://via.placeholder.com/300x200",
    description: "La memoria se fragmenta.",
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TheSimpson</Text>

      <FlatList
        data={EPISODES}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EpisodeCard
            episode={item}
            onPress={() =>
              navigation.navigate("Episode", { episode: item })
            }
          />
        )}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 12,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
