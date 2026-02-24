import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { episodeImages } from "../utils/episodeImages";

const FAVORITES_STORAGE_KEY = "@simpson:favorites";
const WATCHED_STORAGE_KEY = "@simpson:watched";

// Ejemplos de paletas oscuras (elige la que prefieras)
const palettes = {
  obsidianBlue: {
    background: "#0D1117",
    card: "#161B22",
    primary: "#1F6FEB",
    accent: "#2EA043",
    text: "#E6EDF3",
    muted: "#8B949E",
  },
  nightGreen: {
    background: "#0A0F0D",
    card: "#121A16",
    primary: "#1B6CA8",
    accent: "#2EC27E",
    text: "#F2F4F8",
    muted: "#8E9AA6",
  },
  graphitePrimary: {
    background: "#121212",
    card: "#1E1E1E",
    primary: "#0D6EFD",
    accent: "#20C997",
    text: "#F5F5F5",
    muted: "#A1A1AA",
  },
};

const activePalette = palettes.obsidianBlue;

function getEpisodeCode(episode) {
  if (episode?.id) {
    return String(episode.id);
  }

  if (episode?.image) {
    return String(episode.image).replace(".webp", "").replace(".jpg", "");
  }

  return "";
}

function getSeasonAndEpisode(episode) {
  if (episode?.seasonId && episode?.episodeNumber) {
    return { season: episode.seasonId, episode: episode.episodeNumber };
  }

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
  if (!storedValue) return {};
  return JSON.parse(storedValue);
}

function formatAirDate(value) {
  if (!value || value === "unknown") return "Fecha no disponible";
  return value;
}

export default function EpisodeScreen({ route }) {
  const episode = route?.params?.episode || {};
  const episodeCode = useMemo(() => getEpisodeCode(episode), [episode]);
  const seasonEpisode = useMemo(() => getSeasonAndEpisode(episode), [episode]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const loadStoredState = useCallback(async () => {
    if (!episodeCode) return;

    const favorites = await getStoredMap(FAVORITES_STORAGE_KEY);
    const watched = await getStoredMap(WATCHED_STORAGE_KEY);

    setIsFavorite(Boolean(favorites[episodeCode]));
    setIsWatched(Boolean(watched[episodeCode]));
  }, [episodeCode]);

  useEffect(() => {
    loadStoredState();
  }, [loadStoredState]);

  const toggleFavorite = useCallback(async () => {
    if (!episodeCode) return;

    const favorites = await getStoredMap(FAVORITES_STORAGE_KEY);
    const nextValue = !favorites[episodeCode];

    if (nextValue) favorites[episodeCode] = true;
    else delete favorites[episodeCode];

    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    setIsFavorite(nextValue);
  }, [episodeCode]);

  const toggleWatched = useCallback(async () => {
    if (!episodeCode) return;

    const watched = await getStoredMap(WATCHED_STORAGE_KEY);
    const nextValue = !watched[episodeCode];

    if (nextValue) watched[episodeCode] = true;
    else delete watched[episodeCode];

    await AsyncStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(watched));
    setIsWatched(nextValue);
  }, [episodeCode]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.posterCard}>
        {episodeImages[episode?.image] ? (
          <Image source={episodeImages[episode.image]} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={styles.imageFallbackText}>Sin imagen</Text>
          </View>
        )}

        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteIcon}>{isFavorite ? "★" : "☆"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.watchedButton} onPress={toggleWatched}>
          <Text style={styles.watchedIcon}>{isWatched ? "👁️" : "🙈"}</Text>
          <Text style={styles.watchedText}>{isWatched ? "Visto" : "No visto"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => Alert.alert("Play", "Reproducción aún no implementada")}
        >
          <Text style={styles.playIcon}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.title}>{episode?.title || "Episodio"}</Text>

        <Text style={styles.codeLine}>
          T{seasonEpisode.season} · E{seasonEpisode.episode} · ID {episodeCode || "N/A"}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Duración:</Text>
          <Text style={styles.metaValue}>{episode?.duration ? `${episode.duration} min` : "N/A"}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Emisión:</Text>
          <Text style={styles.metaValue}>{formatAirDate(episode?.airDate)}</Text>
        </View>

        <Text style={styles.synopsisLabel}>Sinopsis</Text>
        <Text style={styles.desc}>{episode?.synopsis || episode?.description || "Sin descripción disponible"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: activePalette.background,
  },
  content: {
    padding: 14,
    gap: 14,
  },
  posterCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: activePalette.card,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 240,
  },
  imageFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageFallbackText: {
    color: activePalette.muted,
    fontWeight: "600",
  },
  favoriteButton: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 22,
    color: "#FFD166",
  },
  watchedButton: {
    position: "absolute",
    left: 12,
    bottom: 12,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.55)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  watchedIcon: {
    fontSize: 15,
  },
  watchedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  playButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: activePalette.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "white",
    fontSize: 22,
    marginLeft: 2,
  },
  infoCard: {
    backgroundColor: activePalette.card,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  title: {
    color: activePalette.text,
    fontSize: 21,
    fontWeight: "800",
  },
  codeLine: {
    color: activePalette.accent,
    fontWeight: "700",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaLabel: {
    color: activePalette.muted,
    fontWeight: "700",
  },
  metaValue: {
    color: activePalette.text,
  },
  synopsisLabel: {
    marginTop: 6,
    color: activePalette.text,
    fontWeight: "800",
    fontSize: 16,
  },
  desc: {
    color: activePalette.text,
    lineHeight: 21,
  },
});
