import React, { useState } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import Card from "../components/card";
import seasons from "../components/Episodes/seasons.json";
import { episodeImages } from "../utils/episodeImages";

export default function HomeScreen({ navigation }) {
  const [isList, setIsList] = useState(false);

  // Todas las temporadas automáticamente
  const seasonKeys = Object.keys(seasons); // ["season1", "season2", ..., "season34"]

  // Cambiar key para forzar rerender al cambiar columnas
  const listKey = isList ? 'list' : 'grid';

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
          // Obtener imagen de la temporada: Season_1_Icon.webp, Season_2_Icon.webp...
          const seasonNumber = item.replace("season", ""); // "1", "2", ...
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
