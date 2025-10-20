import BannerCarousel from "@/components/BannerCarousel";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import BannerSection from "../../components/BannerSection";
import ProductCard from "../../components/ProductCard";
import { useAuth } from "../../contexts/AuthContext";
import { Address, addressService } from "../../services/addressService";
import { Product, productService } from "../../services/productService";



export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [premiumProducts, setPremiumProducts] = useState<Product[]>([]);
  const [loadingPremium, setLoadingPremium] = useState(true);
  const [instantProducts, setInstantProducts] = useState<Product[]>([]);
  const [loadingInstant, setLoadingInstant] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  // Fetch premium products on component mount
  useEffect(() => {
    const fetchPremiumProducts = async () => {
      try {
        setLoadingPremium(true);
        const products = await productService.getProductsByCategory("premium");
        // Limit to 4 products for the grid
        setPremiumProducts(products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching premium products:", error);
        // Set empty array if fetch fails
        setPremiumProducts([]);
      } finally {
        setLoadingPremium(false);
      }
    };

    fetchPremiumProducts();
  }, []);

  // Fetch instant delivery products (last 4 products)
  useEffect(() => {
    const fetchInstantProducts = async () => {
      try {
        setLoadingInstant(true);
        const allProducts = await productService.getAllProducts();
        // Get last 4 products for instant delivery
        const last4Products = allProducts.slice(-4);
        setInstantProducts(last4Products);
      } catch (error) {
        console.error("Error fetching instant products:", error);
        // Set empty array if fetch fails
        setInstantProducts([]);
      } finally {
        setLoadingInstant(false);
      }
    };

    fetchInstantProducts();
  }, []);

  // Fetch user's default address
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const defaultAddress = await addressService.getDefaultAddress();
        setCurrentAddress(defaultAddress);
      } catch (error) {
        console.error("Error fetching default address:", error);
        setCurrentAddress(null);
      }
    };

    // Only fetch address if user is authenticated
    if (user) {
      fetchDefaultAddress();
    }
  }, [user]);

  const handleNotificationPress = () => {
    router.push('/other/notifications');
  };

  const handleAddressPress = () => {
    router.push('/address-selection');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}` as any);
    }
  };

  const handleSearchInputSubmit = () => {
    handleSearch();
  };

  const handlePremiumProductPress = (product: Product) => {
    router.push(`/product-detail?id=${product._id || product.id}` as any);
  };

  const handleInstantProductPress = (product: Product) => {
    router.push(`/product-detail?id=${product._id || product.id}` as any);
  };

  // Helper function to format user location
  const getLocationText = () => {
    // If we have a fetched address from backend, use it
    if (currentAddress) {
      const { city, state, zipCode, street } = currentAddress;
      if (city && state) {
        return `${city}, ${state}`;
      } else if (city && zipCode) {
        return `${city}, ${zipCode}`;
      } else if (city) {
        return city;
      } else if (street) {
        return street;
      }
    }

    // Fallback to user profile data if available
    if (user?.city && user?.zipCode) {
      return `${user.city}, ${user.zipCode}`;
    }
    
    if (user?.city) {
      return user.city;
    }
    
    if (user?.address) {
      if (typeof user.address === 'string') {
        return user.address;
      }
      
      // Handle address object
      const addressObj = user.address as any;
      const city = addressObj.city || '';
      const location = addressObj.zipCode || addressObj.state || '';
      
      if (city && location) {
        return `${city}, ${location}`;
      } else if (city) {
        return city;
      } else if (location) {
        return location;
      }
    }
    
    // Default fallback - you may want to change this to your actual service area
    return "Select Location";
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        {/* Location + Notifications */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={{ flexDirection: "row", alignItems: "center" }} 
            onPress={handleAddressPress}
          >
            <Ionicons name="location-sharp" size={20} color="#fff" />
            <View>
              <Text style={styles.locationText}>Current location</Text>
              <Text style={styles.cityText}>
                {getLocationText()}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#fff" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
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
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchInputSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIconContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <BannerCarousel />


      {/* Premium Cuts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Premium Cuts</Text>
          <Text style={styles.sectionSub}>Pre-Orders Only</Text>
        </View>

        {loadingPremium ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D13635" />
            <Text style={styles.loadingText}>Loading premium cuts...</Text>
          </View>
        ) : premiumProducts.length > 0 ? (
          <View style={styles.grid}>
            {premiumProducts.map((product, index) => (
              <TouchableOpacity 
                key={product._id || product.id || index} 
                style={styles.categoryBox}
                onPress={() => handlePremiumProductPress(product)}
              >
                <Image
                  source={
                    product.image || (product.images && product.images[0]?.url)
                      ? { uri: product.image || product.images?.[0]?.url }
                      : require("../../assets/images/categories-demo.png")
                  }
                  style={styles.categoryImg}
                />
                <Text style={styles.categoryText} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.categoryPrice}>
                  ₹{Math.round(product.discountedPrice || product.price)}/kg
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No premium cuts available</Text>
          </View>
        )}
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

          {loadingInstant ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D13635" />
              <Text style={styles.loadingText}>Loading instant products...</Text>
            </View>
          ) : instantProducts.length > 0 ? (
            <View style={styles.instantGrid}>
              {instantProducts.map((product, index) => (
                <View key={product._id || product.id || index} style={styles.instantCard}>
                  <TouchableOpacity onPress={() => handleInstantProductPress(product)}>
                    <ProductCard
                      name={product.name}
                      price={`₹${Math.round(product.discountedPrice || product.price)}/kg`}
                      rating={String(product.ratings?.average || product.rating || 4.5)}
                      time="30 min"
                      image={
                        product.image || (product.images && product.images[0]?.url)
                          ? { uri: product.image || product.images?.[0]?.url }
                          : require("../../assets/images/instant-pic.png")
                      }
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No instant products available</Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Exclusive Collection */}
      <BannerSection />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
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
    textAlign: "center",
    marginBottom: 4,
  },
  categoryPrice: {
    fontSize: 12,
    color: "#D13635",
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  gradientBackground: {
    padding: 12,
  },
  instantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    gap: 8, // Modern way to add spacing between flex items
  },
  instantCard: {
    width: "47%", // Slightly smaller to account for gap spacing
    marginBottom: 15,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingLeft: 38,
    paddingRight: 50,
    color: "#222",
    height: 56,
    fontSize: 16,
  },
  searchIconContainer: {
    position: "absolute",
    right: 22,
    top: 18,
    zIndex: 1,
    marginTop: 10,
    padding: 8,
  },
  searchIcon: {
    // Icon styling handled by parent container
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
