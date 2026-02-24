import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import SeasonScreen from "./src/screens/SeasionScreen";
import EpisodeScreen from "./src/screens/EpisodeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Season" component={SeasonScreen} />
        <Stack.Screen
          name="Episode"
          component={EpisodeScreen}
          options={({ route }) => {
            const selectedSeason = route?.params?.episode?.seasonId;

            return {
              title: selectedSeason ? `Temporada ${selectedSeason}` : "Episodio",
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}