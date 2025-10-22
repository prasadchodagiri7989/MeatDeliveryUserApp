
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { cartService } from '../services/cartService';
import { Product, productService } from '../services/productService';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.7; // 80% of screen width
const BANNER_HEIGHT = (BANNER_WIDTH * 9) / 21; // 21:9 aspect ratio


export default function BannerSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { incrementCartCount } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPremiumProducts = async () => {
      try {
        setLoading(true);
        const premium = await productService.getProductsByCategory('premium');
        setProducts(premium.slice(0, 3));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPremiumProducts();
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Exclusive Collection</Text>
      </View>
      {loading ? (
        <View style={{ alignItems: 'center', paddingVertical: 30 }}>
          <ActivityIndicator size="large" color="#D13635" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading exclusive products...</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {products.map((product, index) => (
            <View key={product._id || product.id || index} style={styles.bannerContainer}>
              <Image
                source={
                  product.image || (product.images && product.images[0]?.url)
                    ? { uri: product.image || product.images?.[0]?.url }
                    : require('../assets/images/last-banner.jpg')
                }
                style={styles.bannerImage}
              />
              <View style={styles.overlay}>
                <Text style={styles.bannerTitle}>{product.name}</Text>
                <Text style={styles.bannerRating}>₹{parseInt((product.discountedPrice || product.price).toString(), 10)}/kg</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  disabled={addingId === (product._id || product.id)}
                  onPress={async () => {
                    setAddingId(product._id || product.id);
                    try {
                      await cartService.addToCart(product._id || product.id, 1);
                      incrementCartCount();
                    } catch {
                      // Optionally show error feedback
                    } finally {
                      setAddingId(null);
                    }
                  }}
                >
                  <Text style={styles.addButtonText}>
                    {addingId === (product._id || product.id) ? 'Adding...' : 'Add to Cart'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10,
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerRating: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: '#D13635',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
