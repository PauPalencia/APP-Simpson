import React, { useMemo, useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import Card from "../components/card";
import { episodeImages } from "../utils/episodeImages";
import seasons from "../components/Episodes/seasons.json";
import infoCapsSource from "../components/Episodes/Info.Caps";

function resolveInfoCapsSeasons(source) {
  if (Array.isArray(source)) {
    return source;
  }

  if (!source || typeof source !== "object") {
    return [];
  }

  if (Array.isArray(source.seasons)) {
    return source.seasons;
  }

  if (Array.isArray(source.default)) {
    return source.default;
  }

  if (Array.isArray(source.default?.seasons)) {
    return source.default.seasons;
  }

  return [];
}

export default function SeasonScreen({ route, navigation }) {
  const seasonKey = route?.params?.seasonKey;
  const [isList, setIsList] = useState(false);

  const episodeInfoById = useMemo(() => {
    const infoCapsSeasons = resolveInfoCapsSeasons(infoCapsSource);

    return new Map(
      infoCapsSeasons.flatMap((season) =>
        (Array.isArray(season?.episodes) ? season.episodes : []).map((episode) => [episode?.id, episode])
      )
    );
  }, []);

  const rawEpisodes = seasonKey ? seasons?.[seasonKey] : [];
  const episodes = (Array.isArray(rawEpisodes) ? rawEpisodes : []).map((episode) => {
    const imageName = typeof episode?.image === "string" ? episode.image : "";
    const episodeId = imageName.replace(".webp", "");
    const extraInfo = episodeInfoById.get(episodeId);

    if (!extraInfo) {
      return episode;
    }

    return {
      ...episode,
      title: extraInfo.title || episode?.title,
      description: extraInfo.synopsis || episode?.description,
    };
  });

  const listKey = isList ? "list" : "grid";

  return (
    <View style={styles.container}>
      <Button
        title={isList ? "Modo Cuadrícula" : "Modo Lista"}
        onPress={() => setIsList(!isList)}
      />

      <FlatList
        key={listKey}
        data={episodes}
        keyExtractor={(item, index) =>
          item?.id != null ? String(item.id) : `${seasonKey || "season"}-${index}`
        }
        numColumns={isList ? 1 : 2}
        columnWrapperStyle={isList ? null : { justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <Card
            title={item?.title || "Episodio"}
            image={episodeImages[item?.image]}
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
