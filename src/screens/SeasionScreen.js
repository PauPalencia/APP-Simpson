import React, { useMemo, useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import Card from "../components/card";
import { episodeImages } from "../utils/episodeImages";
import seasonsSource from "../components/Episodes/seasons.json";
import infoCapsSource from "../components/Episodes/Info.Caps";

function unwrapDefaultChain(value) {
  let current = value;
  let guard = 0;

  while (current && typeof current === "object" && "default" in current && guard < 6) {
    current = current.default;
    guard += 1;
  }

  return current;
}

function resolveSeasonsJson(source) {
  const normalized = unwrapDefaultChain(source);

  if (normalized && typeof normalized === "object" && !Array.isArray(normalized)) {
    return normalized;
  }

  return {};
}

function resolveInfoCapsEpisodes(source) {
  const normalized = unwrapDefaultChain(source);

  if (!normalized || typeof normalized !== "object") {
    return [];
  }

  const list = Array.isArray(normalized.seasons) ? normalized.seasons : [];

  return list.flatMap((season) =>
    Array.isArray(season?.episodes) ? season.episodes : []
  );
}

export default function SeasonScreen({ route, navigation }) {
  const seasonKey = route?.params?.seasonKey;
  const [isList, setIsList] = useState(false);

  const seasons = useMemo(() => resolveSeasonsJson(seasonsSource), []);

  const episodeInfoById = useMemo(() => {
    const episodes = resolveInfoCapsEpisodes(infoCapsSource);

    return new Map(
      episodes
        .filter((episode) => typeof episode?.id === "string" && episode.id.length > 0)
        .map((episode) => [episode.id, episode])
    );
  }, []);

  const rawEpisodes = seasonKey ? seasons[seasonKey] : [];
  const episodes = (Array.isArray(rawEpisodes) ? rawEpisodes : []).map((episode) => {
    const imageName = typeof episode?.image === "string" ? episode.image : "";
    const episodeId = imageName.replace(".webp", "");
    const extraInfo = episodeInfoById.get(episodeId);

    return {
      ...episode,
      title: extraInfo?.title || episode?.title || "Episodio",
      description: extraInfo?.synopsis || episode?.description || "Sin descripción disponible",
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
            onPress={() => navigation.navigate("Episode", { episode: item || {} })}
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
