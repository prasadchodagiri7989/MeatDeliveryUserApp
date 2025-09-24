import React, { useRef, useState } from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const banners = [
  require("../assets/images/AD-Slide.png"),
  require("../assets/images/AD-Slide.png"),
  require("../assets/images/AD-Slide.png"),
  require("../assets/images/AD-Slide.png"),
];

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.bannerContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
      >
        {banners.map((banner, index) => (
          <Image
            key={index}
            source={banner}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: "relative",
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden", // <-- this ensures all 4 corners are rounded
  },
  bannerImage: {
    width: width - 40, // account for horizontal margin
    height: 160,
    borderRadius: 10, // optional now, parent already clips
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    right: 15,
    flexDirection: "row",
    backgroundColor: "white",
    padding: 6,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#c1c1c1ff",
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {
    opacity: 1,
    backgroundColor: "#D13635",
    width: 20,
  },
});

