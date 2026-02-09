import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EpisodeScreen from "./src/screens/EpisodeScreen";
import SeasonsScreen from "./src/screens/SeasonsScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Episode" component={EpisodeScreen} />
        <Stack.Screen name="SeasonScreen" component={SeasonsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
