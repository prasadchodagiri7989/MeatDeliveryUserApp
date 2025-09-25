import BannerCarousel from "@/components/BannerCarousel";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BannerSection from "../../components/BannerSection";
import ProductCard from "../../components/ProductCard";



const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2; // 2 cards per row with padding

export default function HomeScreen() {
  const router = useRouter();

  const handleNotificationPress = () => {
    router.push('/other/notifications');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Location + Notifications */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="location-sharp" size={20} color="#fff" />
          <View>
            <Text style={styles.locationText}>Current location</Text>
            <Text style={styles.cityText}>Elamkulam, Kerala</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for Tenderloin Cut"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
      </View>

      {/* Banner */}
      <BannerCarousel />


      {/* Premium Cuts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Premium Cuts</Text>
          <Text style={styles.sectionSub}>Pre-Orders Only</Text>
        </View>

        <View style={styles.grid}>
          {["Loin", "Shank", "Brisket", "Chuck"].map((item, index) => (
            <View key={index} style={styles.categoryBox}>
              <Image
                source={require("../../assets/images/categories-demo.png")}
                style={styles.categoryImg}
              />
              <Text style={styles.categoryText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Instant Deliverables */}
      <View style={styles.section}>
        <LinearGradient
          colors={["#D13635", "#FFFFFF"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instant Deliverables ⚡</Text>
          </View>

          <View style={styles.instantGrid}>
            <View style={styles.instantCard}>
              <ProductCard
                name="Beef"
                price="₹400/kg"
                rating="4.8"
                time="30 min"
                image={require("../../assets/images/instant-pic.png")}
              />
            </View>
            <View style={styles.instantCard}>
              <ProductCard
                name="Buffalo Liver"
                price="₹400/kg"
                rating="4.8"
                time="30 min"
                image={require("../../assets/images/instant-pic.png")}
              />
            </View>
            <View style={styles.instantCard}>
              <ProductCard
                name="Buffalo Brain"
                price="₹400/kg"
                rating="4.8"
                time="30 min"
                image={require("../../assets/images/instant-pic.png")}
              />
            </View>
            <View style={styles.instantCard}>
              <ProductCard
                name="Beef Curry Cut"
                price="₹420/kg"
                rating="4.9"
                time="25 min"
                image={require("../../assets/images/instant-pic.png")}
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Exclusive Collection */}
      <BannerSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#D13635",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationText: { fontSize: 12, color: "#fff" },
  cityText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  searchContainer: {
    position: "relative",
    backgroundColor: "#D13635",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  categoryBox: {
    width: "22%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    padding: 8,
  },
  categoryImg: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  gradientBackground: {
    padding: 12,
  },
  instantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  instantCard: {
    width: CARD_WIDTH, // 2 per row
    marginBottom: 15,
    marginHorizontal: 6, // <-- add this for spacing between cards
  },

  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingLeft: 38,
    paddingRight: 10,
    color: "#222",
    height: 56,
    fontSize: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 22,
    top: 18,
    zIndex: 1,
    marginTop: 10,
  },
  banner: { marginHorizontal: 15, marginBottom: 20, marginTop: 10 },
  bannerImage: { width: "100%", height: 160, borderRadius: 10 },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  sectionSub: { color: "#d62828", fontSize: 12 },
});
