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
        <Stack.Screen name="Home" component={HomeScreen} options={{
          title: "Temporadas",
          headerStyle: { backgroundColor: activePalette.card },
          headerTintColor: "#E6EDF3",
          headerTitleStyle: { fontWeight: "700" },
        }}/>
        <Stack.Screen name="Season" component={SeasonScreen} options={{
          title: "Capítulos",
          headerStyle: { backgroundColor: activePalette.card },
          headerTintColor: "#E6EDF3",
          headerTitleStyle: { fontWeight: "700" },
        }}/>
              <Stack.Screen name="Episode" component={EpisodeScreen} options={{
          title: "Capítulo",
          headerStyle: { backgroundColor: activePalette.card },
          headerTintColor: "#E6EDF3",
          headerTitleStyle: { fontWeight: "700" },
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}