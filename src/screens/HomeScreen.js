import React, { useMemo, useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import Card from "../components/card";
import seasonsSource from "../components/Episodes/seasons.json";
import { episodeImages } from "../utils/episodeImages";

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

export default function HomeScreen({ navigation }) {
  const [isList, setIsList] = useState(false);

  const seasons = useMemo(() => resolveSeasonsJson(seasonsSource), []);
  const seasonKeys = useMemo(() => Object.keys(seasons), [seasons]);

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
        keyExtractor={(item) => item}
        numColumns={isList ? 1 : 2}
        columnWrapperStyle={isList ? null : { justifyContent: "space-between" }}
        renderItem={({ item }) => {
          const seasonNumber = String(item || "").replace("season", "");
          const seasonImageName = `Season_${seasonNumber}_Icon.webp`;
          const seasonImage = episodeImages[seasonImageName];

          return (
            <Card
              title={`Temporada ${seasonNumber}`}
              image={seasonImage}
              onPress={() => navigation.navigate("Season", { seasonKey: item })}
              isList={isList}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
});
