import React, { useMemo, useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import Card from "../components/card";
import { episodeImages } from "../utils/episodeImages";
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

function resolveInfoCapsSeasons(source) {
  const normalized = unwrapDefaultChain(source);

  if (normalized && typeof normalized === "object" && Array.isArray(normalized.seasons)) {
    return normalized.seasons;
  }

  return [];
}

function mapInfoEpisode(episode, seasonId) {
  const id = episode?.id || "";
  const rawImage = typeof episode?.image === "string" ? episode.image : "";
  const image = rawImage ? rawImage.replace(".jpg", ".webp") : `${id}.webp`;

  return {
    id,
    seasonId: seasonId || null,
    episodeNumber: episode?.episodeNumber ?? null,
    title: episode?.title || "Episodio",
    duration: episode?.duration || "",
    airDate: episode?.airDate || "",
    synopsis: episode?.synopsis || "Sin descripción disponible",
    description: episode?.synopsis || "Sin descripción disponible",
    image,
  };
}

export default function SeasonScreen({ route, navigation }) {
  const seasonKey = route?.params?.seasonKey;
  const [isList, setIsList] = useState(false);

  const seasonsByKey = useMemo(() => {
    const seasonsList = resolveInfoCapsSeasons(infoCapsSource);

    return seasonsList.reduce((acc, season, index) => {
      const seasonId = season?.id || index + 1;
      const key = `season${seasonId}`;
      const episodes = Array.isArray(season?.episodes)
        ? season.episodes.map((episode) => mapInfoEpisode(episode, seasonId))
        : [];
      acc[key] = episodes;
      return acc;
    }, {});
  }, []);

  const rawEpisodes = seasonKey ? seasonsByKey[seasonKey] : [];
  const episodes = Array.isArray(rawEpisodes) ? rawEpisodes : [];
  const selectedSeasonId = String(seasonKey || "").replace("season", "");
  const selectedSeasonTitle = selectedSeasonId
    ? `Temporada ${selectedSeasonId}`
    : "Temporada seleccionada";

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
            onPress={() =>
              navigation.navigate("Episode", {
                episode: item || {},
                selectedSeasonTitle,
              })
            }
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
