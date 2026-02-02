import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from "react-native-reanimated";
import { theme } from "../styles/theme";

export default function EpisodeCard({
  item,
  index,
  scrollY,
  height,
  state,
  episodeState,
  saveState
}) {
  const inputRange = [
    (index - 1) * height,
    index * height,
    (index + 1) * height
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity
    };
  });

  const increaseProgress = () => {
    const newProgress = Math.min(state.progress + 25, 100);
    const updated = {
      ...episodeState,
      [item.id]: {
        progress: newProgress,
        seen: newProgress >= 100
      }
    };
    saveState(updated);
  };

  return (
    <Animated.View
      style={[
        {
          height,
          justifyContent: "center",
          alignItems: "center",
          padding: 18
        },
        animatedStyle
      ]}
    >
      <View
        style={{
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: theme.card,
          width: "100%"
        }}
      >
        {/* IMAGEN */}
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: height * 0.5 }}
        />

        {/* TEXTO */}
        <View style={{ padding: 16 }}>
          <Text style={{ color: theme.textMain, fontSize: 22, fontWeight: "bold" }}>
            {item.title}
          </Text>

          <Text style={{ color: theme.textSoft, marginTop: 6 }}>
            {item.description}
          </Text>

          <Text style={{ color: theme.accentSoft, marginTop: 10, fontSize: 13 }}>
            {item.lore}
          </Text>

          <Text style={{ color: theme.textSoft, marginTop: 12 }}>
            {state.seen
              ? "Este recuerdo ya forma parte de ti."
              : "Aún no has vivido este fragmento del tiempo."}
          </Text>

          {/* BARRA PROGRESO */}
          <View
            style={{
              height: 8,
              backgroundColor: "#020617",
              borderRadius: 6,
              marginTop: 12,
              overflow: "hidden"
            }}
          >
            <View
              style={{
                width: `${state.progress}%`,
                height: "100%",
                backgroundColor: theme.accent
              }}
            />
          </View>

          <Text style={{ color: theme.textSoft, marginTop: 6 }}>
            Progreso: {state.progress}%
          </Text>

          {/* BOTÓN */}
          <TouchableOpacity
            onPress={increaseProgress}
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 12,
              backgroundColor: theme.accent,
              alignItems: "center"
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#020617" }}>
              Registrar fragmento (+25%)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
