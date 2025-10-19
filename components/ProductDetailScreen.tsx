import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { cartService } from '../services/cartService';
import { Product, productService } from '../services/productService';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

// Color constants
const PRIMARY_RED = '#D32F2F';
const LIGHT_GRAY = '#F5F5F5';
const DARK_GRAY = '#333';
const LIGHT_PINK = '#FFF1F1';
const GREEN_COLOR = '#2E7D32';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ProductDetailScreenProps {
  // Empty interface for future props
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = () => {
  const router = useRouter();
  const { id: productId } = useLocalSearchParams<{ id: string }>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleBack = () => {
    router.back();
  };

  // Load product details
  const loadProduct = useCallback(async () => {
    if (!productId) {
      setError('Product ID not provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const productData = await productService.getProductById(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Handle quantity changes
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.availability?.quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      
      // Add to cart using cart service
      const cartResponse = await cartService.addToCart(product._id || product.id, quantity);
      
      // Cart service returns the cart object directly
      if (cartResponse) {
        Alert.alert(
          'Added to Cart',
          `${quantity}x ${product.name} has been added to your cart.`,
          [
            {
              text: 'Continue Shopping',
              style: 'default',
            },
            {
              text: 'View Cart',
              style: 'default',
              onPress: () => router.push('/(tabs)/cart'),
            },
          ]
        );
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Alert.alert(
        'Error', 
        error.message || 'Failed to add item to cart. Please try again.'
      );
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId, loadProduct]);

  // Format price
  const formatPrice = (price: number, discountedPrice?: number) => {
    if (discountedPrice && discountedPrice < price) {
      return (
        <View style={styles.priceContainer}>
          <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
          <Text style={styles.originalPrice}>₹{price}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((price - discountedPrice) / price) * 100)}% OFF
            </Text>
          </View>
        </View>
      );
    }
    return <Text style={styles.price}>₹{price}</Text>;
  };

  // Get product images
  const getProductImages = (product: Product): string[] => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => img.url);
    }
    if (product.image) {
      return [product.image];
    }
    return []; // Will use fallback image
  };

  // Render image gallery
  const renderImageGallery = () => {
    const images = getProductImages(product!);
    
    if (images.length === 0) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/instant-pic.png')}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const imageIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setSelectedImageIndex(imageIndex);
          }}
        >
          {images.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {images.length > 1 && (
          <View style={styles.imageIndicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  selectedImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <AntDesign name="left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.backButton} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_RED} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <AntDesign name="left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.backButton} />
        </View>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={80} color={PRIMARY_RED} />
          <Text style={styles.errorTitle}>Failed to Load Product</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProduct}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AntDesign name="left" size={20} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Product Details</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        {renderImageGallery()}

        {/* Product Information */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>
                {product.ratings?.average?.toFixed(1) || product.rating?.toFixed(1) || '4.5'}
              </Text>
              <Text style={styles.reviewCount}>
                ({product.ratings?.count || 0} reviews)
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            {formatPrice(product.price, product.discountedPrice)}
          </View>

          {/* Availability */}
          <View style={styles.availabilitySection}>
            <View style={[
              styles.availabilityBadge,
              product.availability?.inStock ? styles.inStockBadge : styles.outOfStockBadge
            ]}>
              <Ionicons 
                name={product.availability?.inStock ? "checkmark-circle" : "close-circle"} 
                size={16} 
                color={product.availability?.inStock ? GREEN_COLOR : PRIMARY_RED} 
              />
              <Text style={[
                styles.availabilityText,
                product.availability?.inStock ? styles.inStockText : styles.outOfStockText
              ]}>
                {product.availability?.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            
            {product.availability?.inStock && product.availability.quantity && (
              <Text style={styles.stockCount}>
                {product.availability.quantity} units available
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Product Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
            
            {product.subcategory && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Subcategory:</Text>
                <Text style={styles.detailValue}>{product.subcategory}</Text>
              </View>
            )}
            
            {product.weight && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Weight:</Text>
                <Text style={styles.detailValue}>
                  {product.weight.value} {product.weight.unit}
                </Text>
              </View>
            )}
            
            {product.deliveryTime && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Delivery Time:</Text>
                <Text style={styles.detailValue}>{product.deliveryTime}</Text>
              </View>
            )}
          </View>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action Bar */}
      {product.availability?.inStock && (
        <View style={styles.bottomBar}>
          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Qty:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <MaterialIcons 
                  name="remove" 
                  size={20} 
                  color={quantity <= 1 ? '#ccc' : '#333'} 
                />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= (product.availability?.quantity || 10)}
              >
                <MaterialIcons 
                  name="add" 
                  size={20} 
                  color={quantity >= (product.availability?.quantity || 10) ? '#ccc' : '#333'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[styles.addToCartButton, addingToCart && styles.addToCartButtonDisabled]}
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="cart-outline" size={20} color="white" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  // Header Styles
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content Styles
  content: {
    flex: 1,
  },

  // Image Gallery
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: LIGHT_GRAY,
  },

  productImage: {
    width: screenWidth,
    height: 300,
  },

  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  activeIndicator: {
    backgroundColor: 'white',
  },

  // Product Info
  productInfo: {
    padding: 20,
  },

  productHeader: {
    marginBottom: 16,
  },

  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 8,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginLeft: 4,
    marginRight: 8,
  },

  reviewCount: {
    fontSize: 14,
    color: '#666',
  },

  // Price Section
  priceSection: {
    marginBottom: 16,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_RED,
  },

  discountedPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_RED,
    marginRight: 8,
  },

  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },

  discountBadge: {
    backgroundColor: GREEN_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Availability Section
  availabilitySection: {
    marginBottom: 24,
  },

  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },

  inStockBadge: {
    backgroundColor: `${GREEN_COLOR}20`,
  },

  outOfStockBadge: {
    backgroundColor: `${PRIMARY_RED}20`,
  },

  availabilityText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },

  inStockText: {
    color: GREEN_COLOR,
  },

  outOfStockText: {
    color: PRIMARY_RED,
  },

  stockCount: {
    fontSize: 12,
    color: '#666',
  },

  // Sections
  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  detailValue: {
    fontSize: 16,
    color: DARK_GRAY,
    fontWeight: '600',
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    backgroundColor: LIGHT_PINK,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  tagText: {
    fontSize: 14,
    color: PRIMARY_RED,
    fontWeight: '500',
  },

  // Bottom Bar
  bottomBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 16,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
  },

  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    padding: 4,
  },

  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'white',
  },

  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginHorizontal: 16,
  },

  addToCartButton: {
    flex: 1,
    backgroundColor: PRIMARY_RED,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },

  addToCartButtonDisabled: {
    opacity: 0.6,
  },

  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Loading/Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },

  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  retryButton: {
    backgroundColor: PRIMARY_RED,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default ProductDetailScreen;