import React, { useMemo, useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import Card from "../components/card";
import infoCapsSource from "../components/Episodes/Info.Caps";
import { episodeImages } from "../utils/episodeImages";
import { activePalette } from "./EpisodeScreen";

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

export default function HomeScreen({ navigation }) {
  const [isList, setIsList] = useState(false);

  const seasons = useMemo(() => resolveInfoCapsSeasons(infoCapsSource), []);

  const seasonKeys = useMemo(
    () => seasons.map((season, index) => ({
      key: `season${season?.id || index + 1}`,
      id: season?.id || index + 1,
      image: `Season_${season?.id || index + 1}_Icon.webp`,
    })),
    [seasons]
  );

  const listKey = isList ? "list" : "grid";

  return (
    <View style={styles.container}>
      <Button
        title={isList ? "Modo Cuadrícula" : "Modo Lista"}
        onPress={() => setIsList(!isList)}
      />

      <FlatList
        key={listKey}
        data={seasonKeys}
        marginTop={12}
        keyExtractor={(item) => item.key}
        numColumns={isList ? 1 : 2}
        columnWrapperStyle={isList ? null : { justifyContent: "space-between", backgroundColor: activePalette.background, }}
        renderItem={({ item }) => (
          <Card
            title={`Temporada ${item.id}`}
            image={episodeImages[item.image]}
            onPress={() => navigation.navigate("Season", { seasonKey: item.key })}
            isList={isList}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: activePalette.background },
});