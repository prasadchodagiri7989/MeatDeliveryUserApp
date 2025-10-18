import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Cart, CartItem, cartService } from '../services/cartService';
import { Product, productService } from '../services/productService';

const RED_COLOR = '#D13635';
const LIGHT_GRAY = '#f5f5f5';
const GREEN_COLOR = '#4CAF50';

// Header Component
const CartHeader: React.FC = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Cart</Text>
  </View>
);

// Delivery Location Component
const DeliveryLocation: React.FC = () => {
  const handleChangeLocation = () => {
    Alert.alert('Change Location', 'Location change functionality');
  };

  return (
    <View style={styles.locationContainer}>
      <View style={styles.locationLeft}>
        <Ionicons name="location" size={20} color={RED_COLOR} />
        <View style={styles.locationText}>
          <Text style={styles.locationTitle}>Home</Text>
          <Text style={styles.locationAddress}>Elamkulam, Kerala</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleChangeLocation}>
        <Text style={styles.changeButton}>Change</Text>
      </TouchableOpacity>
    </View>
  );
};

// Cart Item Card Component
const CartItemCard: React.FC<{ 
  item: CartItem; 
  onUpdateQuantity: (itemId: string, quantity: number) => void; 
  onRemove: (itemId: string) => void 
}> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const increaseQuantity = () => {
    onUpdateQuantity(item._id, item.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item._id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item._id);
  };

  // Get image source - use backend image URL or fallback to local
  const getImageSource = () => {
    if (item.product.image && item.product.image.startsWith('http')) {
      return { uri: item.product.image };
    }
    return require('../assets/images/instant-pic.png'); // fallback image
  };

  return (
    <View style={styles.cartItemCard}>
      <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
        <AntDesign name="close" size={16} color="#999" />
      </TouchableOpacity>
      
      <View style={styles.cartItemContent}>
        <Image source={getImageSource()} style={styles.cartItemImage} />
        
        <View style={styles.cartItemInfo}>
          <View style={styles.cartItemHeader}>
            <Text style={styles.cartItemName}>{item.product.name}</Text>
            {item.product.deliveryTime === '30 min' && (
              <View style={styles.instantBadge}>
                <Text style={styles.instantText}>Instant order</Text>
              </View>
            )}
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>₹{item.priceAtTime}/kg</Text>
            {item.product.discountedPrice && item.product.discountedPrice < item.product.price && (
              <Text style={styles.originalPrice}>₹{item.product.price}/kg</Text>
            )}
          </View>
          
          <Text style={styles.deliveryInfo}>
            Will be delivered in {item.product.deliveryTime}
          </Text>
          
          <View style={styles.quantityController}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={decreaseQuantity}
            >
              <AntDesign name="minus" size={16} color="#333" />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={increaseQuantity}
            >
              <AntDesign name="plus" size={16} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Product Card Component for Suggestions
const ProductCard: React.FC<{ 
  item: Product;
  onAddToCart: (productId: string) => void;
}> = ({ item, onAddToCart }) => {
  const handleAddProduct = () => {
    onAddToCart(item._id);
  };

  // Get image source - use backend image URL or fallback to local
  const getImageSource = () => {
    if (item.image && item.image.startsWith('http')) {
      return { uri: item.image };
    }
    return require('../assets/images/instant-pic.png'); // fallback image
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={getImageSource()} style={styles.productImage} />
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <AntDesign name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>
          ₹{item.discountedPrice || item.price}/kg
        </Text>
        
        <View style={styles.productDetails}>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          
          <View style={styles.deliveryContainer}>
            <Ionicons name="time-outline" size={12} color={GREEN_COLOR} />
            <Text style={styles.deliveryText}>{item.deliveryTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Coupon and Summary Component
const CouponAndSummary: React.FC<{ cartItems: CartItem[] }> = ({ cartItems }) => {
  const [couponCode, setCouponCode] = useState('');
  
  const subTotal = cartItems.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
  const total = subTotal; // Add delivery charges, taxes etc here if needed
  
  const handleCheckCoupon = () => {
    Alert.alert('Coupon', couponCode ? `Checking coupon: ${couponCode}` : 'Please enter a coupon code');
  };

  return (
    <View style={styles.summaryContainer}>
      {/* Coupon Section */}
      <View style={styles.couponSection}>
        <TextInput
          style={styles.couponInput}
          placeholder="Enter coupon code"
          placeholderTextColor="#999"
          value={couponCode}
          onChangeText={setCouponCode}
        />
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckCoupon}>
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>
      </View>
      
      {/* Price Breakdown */}
      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Sub Total</Text>
          <Text style={styles.priceValue}>₹{subTotal}</Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
      </View>
    </View>
  );
};

// Main Cart Page Component
const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load cart data on component mount
  useEffect(() => {
    loadCartData();
    loadSuggestedProducts();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      Alert.alert('Error', 'Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedProducts = async () => {
    try {
      const products = await productService.getSuggestedProducts(4);
      setSuggestedProducts(products);
    } catch (error) {
      console.error('Error loading suggested products:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setUpdating(true);
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(true);
      const updatedCart = await cartService.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      setUpdating(true);
      const updatedCart = await cartService.addToCart(productId, 1);
      setCart(updatedCart);
      Alert.alert('Success', 'Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleProceed = () => {
    if (cart && cart.totalAmount > 0) {
      Alert.alert('Proceed', `Proceeding to checkout with total: ₹${cart.totalAmount}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={RED_COLOR} />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CartHeader />
      
      {/* Delivery Location */}
      <DeliveryLocation />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cart Items */}
        <View style={styles.cartItemsSection}>
          {cart?.items.map(item => (
            <CartItemCard
              key={item._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
          
          {(!cart || cart.items.length === 0) && (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
            </View>
          )}
        </View>
        
        {/* Suggested Products */}
        <View style={styles.suggestedSection}>
          <Text style={styles.sectionTitle}>You might also like</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedContainer}
          >
            {suggestedProducts.map(product => (
              <ProductCard 
                key={product._id} 
                item={product} 
                onAddToCart={addToCart}
              />
            ))}
          </ScrollView>
        </View>
        
        {/* Coupon and Summary */}
        {cart && cart.items.length > 0 && (
          <CouponAndSummary cartItems={cart.items} />
        )}
        
        {/* Proceed Button */}
        {cart && cart.items.length > 0 && (
          <TouchableOpacity 
            style={styles.proceedButton} 
            onPress={handleProceed}
            disabled={updating}
          >
            <Text style={styles.proceedButtonText}>
              {updating ? 'Updating...' : 'Proceed'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  // Delivery Location Styles
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: LIGHT_GRAY,
  },

  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    marginLeft: 10,
  },

  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  changeButton: {
    fontSize: 14,
    color: RED_COLOR,
    fontWeight: '500',
  },

  // Content Styles
  content: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // Cart Items Styles
  cartItemsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  cartItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },

  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },

  cartItemContent: {
    flexDirection: 'row',
  },

  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },

  cartItemInfo: {
    flex: 1,
  },

  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },

  instantBadge: {
    backgroundColor: RED_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },

  instantText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: RED_COLOR,
    marginRight: 10,
  },

  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  deliveryInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },

  quantityController: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  quantityButton: {
    backgroundColor: LIGHT_GRAY,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: 'center',
  },

  // Suggested Products Styles
  suggestedSection: {
    paddingTop: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  suggestedContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },

  productCard: {
    width: 140,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  productImageContainer: {
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },

  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: RED_COLOR,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productInfo: {
    padding: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: RED_COLOR,
    marginBottom: 8,
  },

  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },

  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deliveryText: {
    fontSize: 12,
    color: GREEN_COLOR,
    marginLeft: 4,
    fontWeight: '500',
  },

  // Summary Styles
  summaryContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  couponSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  couponInput: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },

  checkButton: {
    backgroundColor: RED_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },

  checkButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  priceBreakdown: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginBottom: 0,
  },

  priceLabel: {
    fontSize: 16,
    color: '#333',
  },

  priceValue: {
    fontSize: 16,
    color: '#333',
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RED_COLOR,
  },

  // Proceed Button Styles
  proceedButton: {
    backgroundColor: RED_COLOR,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },

  proceedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Loading Styles
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },

  // Empty Cart Styles
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyCartText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CartPage;