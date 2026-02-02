import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EpisodeCard from "../components/EpisodeCard";
import { theme } from "../styles/theme";

const { height } = Dimensions.get("window");

const episodes = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `FRAGMENTO ${String(i + 1).padStart(3, "0")}`,
  description: "Un instante guardado fuera del tiempo.",
  image: `https://picsum.photos/600/900?random=${i + 1}`,
  lore: "Cada recuerdo observado altera al observador."
}));

export default function EpisodesScreen() {
  const scrollY = useSharedValue(0);
  const [episodeState, setEpisodeState] = useState({});

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    const data = await AsyncStorage.getItem("episodeState");
    if (data) setEpisodeState(JSON.parse(data));
  };

  const saveState = async (updated) => {
    setEpisodeState(updated);
    await AsyncStorage.setItem("episodeState", JSON.stringify(updated));
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  return (
    <Animated.ScrollView
      pagingEnabled
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={{ backgroundColor: theme.bg }}
    >
      {episodes.map((item, index) => (
        <EpisodeCard
          key={item.id}
          item={item}
          index={index}
          scrollY={scrollY}
          height={height}
          state={episodeState[item.id] || { progress: 0, seen: false }}
          episodeState={episodeState}
          saveState={saveState}
        />
      ))}
    </Animated.ScrollView>
  );
}
