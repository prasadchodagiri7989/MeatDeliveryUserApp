import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProductCardProps {
  name: string;
  price: string;
  rating: string;
  time: string;
  image?: any;
}

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2; // 2 per row with spacing

export default function ProductCard({
  name,
  price,
  rating,
  time,
  image,
}: ProductCardProps) {
  return (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      {/* Product Image */}
      <Image
        source={image || require("../assets/images/instant-pic.png")}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.price}>{price}</Text>

        <View style={styles.row}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{rating}</Text>
          <Ionicons
            name="time-outline"
            size={14}
            color="#666"
            style={{ marginLeft: 8 }}
          />
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: CARD_MARGIN,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  image: {
    width: "90%",
    height: 120,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 10,
  },
  addButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#d62828",
    borderRadius: 15,
    padding: 4,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#333",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    color: "#333",
  },
  time: {
    fontSize: 12,
    marginLeft: 4,
    color: "#333",
  },
});
