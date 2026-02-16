import React, { useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import Card from "../components/card";
import { episodeImages } from "../utils/episodeImages";
import seasons from "../components/Episodes/seasons.json";
import infoCaps from "../components/Episodes/Info.Caps";

const episodeInfoById = new Map(
  infoCaps.seasons.flatMap((season) =>
    season.episodes.map((episode) => [episode.id, episode])
  )
);

export default function SeasonScreen({ route, navigation }) {
  const { seasonKey } = route.params;
  const [isList, setIsList] = useState(false);

  const episodes = (seasons[seasonKey] || []).map((episode) => {
    const episodeId = episode.image.replace(".webp", "");
    const extraInfo = episodeInfoById.get(episodeId);

    if (!extraInfo) {
      return episode;
    }

    return {
      ...episode,
      title: extraInfo.title,
      description: extraInfo.synopsis,
    };
  });

  const listKey = isList ? 'list' : 'grid';

  return (
    <View style={styles.container}>
      <Button
        title={isList ? "Modo Cuadrícula" : "Modo Lista"}
        onPress={() => setIsList(!isList)}
      />

      <FlatList
        key={listKey} // FORZAR rerender
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={isList ? 1 : 2}
        columnWrapperStyle={isList ? null : { justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            image={episodeImages[item.image]}
            onPress={() => navigation.navigate("Episode", { episode: item })}
            isList={isList}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
});
