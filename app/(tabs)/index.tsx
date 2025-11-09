
import BannerCarousel from "@/components/BannerCarousel";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
import SessionMonitor from "../../components/SessionMonitor";
import { getCurrentConfig } from "../../config/api";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from '../../contexts/CartContext';
import { Address, addressService } from "../../services/addressService";
import { Product, productService } from "../../services/productService";







export default function HomeScreen() {

    // Fetch all services on app reload/mount
  useEffect(() => {
    // Fetch non-critical services in parallel without blocking UI
    const fetchAllServices = async () => {
      try {
        const imports = await Promise.allSettled([
          import('../../services/addressService'),
          import('../../services/productService'),
          import('../../services/cartService'),
          import('../../services/orderService'),
          import('../../services/notificationService'),
          import('../../services/couponService'),
          import('../../services/authService'),
        ]);

        // Kick off available services but don't await each to avoid blocking
        imports.forEach((imp) => {
          if (imp.status === 'fulfilled') {
            const mod: any = (imp as any).value;
            try {
              // Call common exported methods if present
              if (mod.addressService?.getSavedAddresses) mod.addressService.getSavedAddresses();
              if (mod.productService?.getAllProducts) mod.productService.getAllProducts();
              if (mod.cartService?.getCart) mod.cartService.getCart();
              if (mod.orderService?.getUserOrders) mod.orderService.getUserOrders();
              if (mod.notificationService?.getNotifications) mod.notificationService.getNotifications();
              if (mod.couponService?.getActiveCoupons) mod.couponService.getActiveCoupons();
              if (mod.authService?.getMe) mod.authService.getMe();
            } catch (e) {
              // Individual module invocation failed; log and continue
              console.debug('Non-critical service invocation failed:', e);
            }
          }
        });
      } catch (error) {
        console.error('Error fetching all services on reload:', error);
      }
    };
    fetchAllServices();
  }, []);
  // Always fetch /api/addresses when homepage opens
  useEffect(() => {
    const fetchAllAddresses = async () => {
      try {
        const API_BASE_URL = getCurrentConfig().API_URL;
        const { authService } = await import('../../services/authService');
        const token = await authService.getToken();
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
        await fetch(`${API_BASE_URL}/addresses`, {
          method: 'GET',
          headers,
        });
        // You can use the response if needed
      } catch (error) {
        console.error('Error fetching all addresses:', error);
      }
    };
    fetchAllAddresses();
  }, []);
  const router = useRouter();
  const { user } = useAuth();
  const { incrementCartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [premiumProducts, setPremiumProducts] = useState<Product[]>([]);
  const [loadingPremium, setLoadingPremium] = useState(true);
  const [instantProducts, setInstantProducts] = useState<Product[]>([]);
  const [loadingInstant, setLoadingInstant] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Fetch premium products on component mount
  useEffect(() => {
    const fetchPremiumProducts = async () => {
      try {
        setLoadingPremium(true);
        const products = await productService.getProductsByCategory("premium");
        // Limit to 4 products for the grid
        setPremiumProducts(products);
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

  // Function to fetch user's default address
  const fetchDefaultAddress = useCallback(async () => {
    if (!user) {
      setCurrentAddress(null);
      return;
    }

    try {
      setLoadingAddress(true);
      let defaultAddress = await addressService.getDefaultAddress();
      // If no default address, try to fetch all and use the first one
      if (!defaultAddress) {
        const allAddresses = await addressService.getSavedAddresses();
        if (allAddresses && allAddresses.length > 0) {
          defaultAddress = allAddresses[0];
        }
      }
      setCurrentAddress(defaultAddress);
    } catch (error) {
      console.error("Error fetching default address:", error);
      setCurrentAddress(null);
    } finally {
      setLoadingAddress(false);
    }
  }, [user]);


  // Fetch user's default address once on initial mount
  useEffect(() => {
    fetchDefaultAddress();
  }, [fetchDefaultAddress]);

  const handleNotificationPress = () => {
    router.push('/other/notifications');
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


  // Add to cart handler for instant products
  const handleAddInstantProductToCart = async (product: Product) => {
    try {
      // Add 1 quantity by default
      await import('../../services/cartService').then(({ cartService }) => cartService.addToCart(product._id || product.id, 1));
      incrementCartCount();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Optionally show a toast or alert
    }
  };

  // Helper function to get address label with fallback
  const getAddressLabel = () => {
    if (currentAddress?.label) {
      return `${currentAddress.label} • `;
    }
    return '';
  };

  // Helper function to format user location
  const getLocationText = () => {
    // Show loading if address is being fetched
    if (loadingAddress) {
      return "Loading...";
    }

    // If we have a fetched default address from backend, use it
    if (currentAddress) {
      const { city, state, zipCode, street, label } = currentAddress;
      
      // Show a more complete address format for default address
      if (city && state) {
        return `${getAddressLabel()}${city}, ${state} ${zipCode || ''}`.trim();
      } else if (city && zipCode) {
        return `${getAddressLabel()}${city}, ${zipCode}`;
      } else if (city) {
        return `${getAddressLabel()}${city}`;
      } else if (street) {
        // If only street is available, show a truncated version
        const truncatedStreet = street.length > 25 ? `${street.substring(0, 25)}...` : street;
        return `${getAddressLabel()}${truncatedStreet}`;
      } else if (label) {
        return label;
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
        return user.address.length > 30 ? `${user.address.substring(0, 30)}...` : user.address;
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
    
    // Default fallback - encourage user to add address
    return "Add your address";
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <SessionMonitor />
      <ScrollView style={styles.container}>
        {/* Location + Notifications */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location-sharp" size={20} color="#fff" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.locationText}>
                {loadingAddress 
                  ? "Loading..." 
                  : currentAddress 
                    ? "Delivering to" 
                    : "Select delivery location"
                }
              </Text>
              <Text style={styles.cityText}>
                {currentAddress && (currentAddress.city || currentAddress.zipCode) 
                  ? `${currentAddress.city || ''}${currentAddress.city && currentAddress.zipCode ? ', ' : ''}${currentAddress.zipCode || ''}`.trim()
                  : getLocationText()
                }
              </Text>
            </View>
            {/* No chevron or click */}
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
                  ₹{parseInt((product.discountedPrice || product.price).toString(), 10)}/kg
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
                  <ProductCard
                    name={product.name}
                    price={`₹${parseInt((product.discountedPrice || product.price).toString(), 10)}/kg`}
                    rating={String(product.ratings?.average || product.rating || 4.5)}
                    time="30 min"
                    image={
                      product.image || (product.images && product.images[0]?.url)
                        ? { uri: product.image || product.images?.[0]?.url }
                        : require("../../assets/images/instant-pic.png")
                    }
                    onAdd={() => handleAddInstantProductToCart(product)}
                  />
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

      {/* Exclusive Collection: Only data from premium category */}
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
