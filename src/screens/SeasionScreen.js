import React, { useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import Card from "../components/card";
import { episodeImages } from "../utils/episodeImages";
import seasons from "../components/Episodes/seasons.json";
import infoCaps from "../components/Episodes/Info.Caps";

const infoCapsSeasons = Array.isArray(infoCaps?.seasons)
  ? infoCaps.seasons
  : Array.isArray(infoCaps)
    ? infoCaps
    : [];

const episodeInfoById = new Map(
  infoCapsSeasons.flatMap((season) =>
    (season?.episodes || []).map((episode) => [episode.id, episode])
  )
);

export default function SeasonScreen({ route, navigation }) {
  const seasonKey = route?.params?.seasonKey;
  const [isList, setIsList] = useState(false);

  const rawEpisodes = seasonKey ? seasons?.[seasonKey] : [];
  const episodes = (Array.isArray(rawEpisodes) ? rawEpisodes : []).map((episode) => {
    const imageName = episode?.image || "";
    const episodeId = imageName.replace(".webp", "");
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
        keyExtractor={(item, index) => (item?.id != null ? String(item.id) : `${seasonKey || "season"}-${index}`)}
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
