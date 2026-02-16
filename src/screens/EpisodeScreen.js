import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { episodeImages } from "../utils/episodeImages";

const FAVORITES_STORAGE_KEY = "@simpson:favorites";
const WATCHED_STORAGE_KEY = "@simpson:watched";

function getEpisodeCode(episode) {
  if (episode?.image) {
    return episode.image.replace(".webp", "");
  }

  return episode?.id?.toString() || "";
}

function getSeasonAndEpisode(episode) {
  const code = getEpisodeCode(episode);
  const parts = code.split("x");

  if (parts.length !== 2) {
    return { season: "?", episode: "?" };
  }

  const [seasonPart, episodePart] = parts;

  return {
    season: Number.parseInt(seasonPart, 10) || seasonPart,
    episode: Number.parseInt(episodePart, 10) || episodePart,
  };
}

async function getStoredMap(key) {
  const storedValue = await AsyncStorage.getItem(key);

  if (!storedValue) {
    return {};
  }

  return JSON.parse(storedValue);
}

export default function EpisodeScreen({ route }) {
  const episode = route?.params?.episode || {};
  const episodeCode = useMemo(() => getEpisodeCode(episode), [episode]);
  const seasonEpisode = useMemo(() => getSeasonAndEpisode(episode), [episode]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const loadStoredState = useCallback(async () => {
    if (!episodeCode) {
      return;
    }

    const favorites = await getStoredMap(FAVORITES_STORAGE_KEY);
    const watched = await getStoredMap(WATCHED_STORAGE_KEY);

    setIsFavorite(Boolean(favorites[episodeCode]));
    setIsWatched(Boolean(watched[episodeCode]));
  }, [episodeCode]);

  useEffect(() => {
    loadStoredState();
  }, [loadStoredState]);

  const toggleFavorite = useCallback(async () => {
    if (!episodeCode) {
      return;
    }

    const favorites = await getStoredMap(FAVORITES_STORAGE_KEY);
    const nextValue = !favorites[episodeCode];

    if (nextValue) {
      favorites[episodeCode] = true;
    } else {
      delete favorites[episodeCode];
    }

    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    setIsFavorite(nextValue);
  }, [episodeCode]);

  const toggleWatched = useCallback(async () => {
    if (!episodeCode) {
      return;
    }

    const watched = await getStoredMap(WATCHED_STORAGE_KEY);
    const nextValue = !watched[episodeCode];

    if (nextValue) {
      watched[episodeCode] = true;
    } else {
      delete watched[episodeCode];
    }

    await AsyncStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(watched));
    setIsWatched(nextValue);
  }, [episodeCode]);

  return (
    <View style={styles.container}>
      {episodeImages[episode?.image] ? (
        <Image source={episodeImages[episode.image]} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{episode?.title || "Episodio"}</Text>
      <Text style={styles.meta}>
        Temporada {seasonEpisode.season} · Capítulo {seasonEpisode.episode}
      </Text>
      <Text style={styles.desc}>{episode?.description || "Sin descripción disponible"}</Text>

      <View style={styles.actions}>
        <Button
          title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          onPress={toggleFavorite}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title={isWatched ? "Marcar como no visto" : "Marcar como visto"}
          onPress={toggleWatched}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Play"
          onPress={() => Alert.alert("Play", "Reproducción aún no implementada")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: "100%", height: 200, borderRadius: 12 },
  title: { marginTop: 12, fontSize: 18, fontWeight: "bold" },
  meta: { marginTop: 8, fontSize: 14, color: "#555" },
  desc: { marginTop: 8 },
  actions: { marginTop: 12 },
});
