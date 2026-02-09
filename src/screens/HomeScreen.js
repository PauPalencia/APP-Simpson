import React from "react";
import { View, StyleSheet } from "react-native";
import { Grid } from "react-native-flexible-grid";
import EpisodeCard from "../components/EpisodeCard";
import seasons from "../components/Episodes/seasons.json";

export default function HomeScreen({ navigation }) {
  const episodes = seasons.season1.map(ep => ({
    ...ep,
    image: require(`../../assets/episodes/${ep.image}`)
  }));

  return (
    <View style={styles.container}>
      <Grid
        data={episodes}
        renderItem={({ item }) => (
          <EpisodeCard
            episode={item}
            onPress={() =>
              navigation.navigate("Episode", { episode: item })
            }
          />
        )}
        itemSpacing={12}
        itemsPerRow={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
});
