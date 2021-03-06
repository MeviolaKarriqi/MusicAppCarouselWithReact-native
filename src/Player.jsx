import React, { useRef, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";

import songs from "./data";
import Controller from "./Controller";
import { ImageBackground } from 'react-native-web';
import assets from '../.expo-shared/assets.json';

const { width, height } = Dimensions.get("window");

export default function Player() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const slider = useRef(null);
  const [songIndex, setSongIndex] = useState(0);
  const position = useRef(Animated.divide(scrollX, width)).current;

  useEffect(() => {

    scrollX.addListener(({ value }) => {
      const val = Math.round(value / width);

      setSongIndex(val);

    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const goNext = () => {
    slider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  const goPrv = () => {
    slider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderItem = ({ index, item }) => {
    return (
      <Animated.View
        style={{
          alignItems: "center",
          width: width,
          transform: [
            {
              translateX: Animated.multiply(
                Animated.add(position, -index),
                -100
              ),
            },
          ],
        }}
      >
        <Animated.Image
          source={item.image}
          style={{ width: 320, height: 320, borderRadius: 5 }}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={{ height: 320 }}>
        <Animated.FlatList
          ref={slider}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        />
      </SafeAreaView>
      <View>
        <Text style={styles.title}>{songs[songIndex].title}</Text>
        <Text style={styles.artist}>{songs[songIndex].artist}</Text>
      </View>

      <Controller onNext={goNext} onPrv={goPrv} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color:"midnightblue",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    textTransform: "capitalize",
  },
  artist: {
    color:"navy",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    textTransform: "capitalize",
    
  },
  container: {
      backgroundColor: "aliceblue",
    justifyContent: "space-evenly",
    height: height,
    maxHeight: height,
  },
});