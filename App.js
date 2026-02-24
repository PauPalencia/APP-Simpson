import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import SeasonScreen from "./src/screens/SeasionScreen";
import EpisodeScreen from "./src/screens/EpisodeScreen";
import { activePalette } from "./src/screens/EpisodeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        
        {/* Home */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Temporadas",
            headerStyle: { backgroundColor: activePalette.card },
            headerTintColor: "#E6EDF3",
            headerTitleStyle: { fontWeight: "700" },
          }}
        />

        {/* Season */}
        <Stack.Screen
          name="Season"
          component={SeasonScreen}
          options={({ route }) => {
            const selectedSeasonTitle = route?.params?.selectedSeasonTitle;
            const selectedSeason = route?.params?.seasonKey?.replace("season", "");

            return {
              title:
                selectedSeasonTitle ||
                (selectedSeason
                  ? `Temporada ${selectedSeason}`
                  : "Temporada seleccionada"),
              headerStyle: { backgroundColor: activePalette.card },
              headerTintColor: "#E6EDF3",
              headerTitleStyle: { fontWeight: "700" },
            };
          }}
        />

        {/* Episode */}
        <Stack.Screen
          name="Episode"
          component={EpisodeScreen}
          options={({ route }) => {
            const selectedSeasonTitle = route?.params?.selectedSeasonTitle;
            const selectedSeason = route?.params?.episode?.seasonId;

            return {
              title:
                selectedSeasonTitle ||
                (selectedSeason
                  ? `Temporada ${selectedSeason}`
                  : "Episodio"),
              headerStyle: { backgroundColor: activePalette.card },
              headerTintColor: "#E6EDF3",
              headerTitleStyle: { fontWeight: "700" },
            };
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}