import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Order } from '../services/orderService';

// Color constants
const PRIMARY_RED = '#D32F2F';
const GREEN_COLOR = '#2E7D32';
const YELLOW_COLOR = '#F9A825';
const LIGHT_GRAY = '#F5F5F5';
const DARK_GRAY = '#333';
const LIGHT_PINK = '#FFF1F1';

const OrderDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { orderData } = useLocalSearchParams();

  // Parse the order data from params
  const order: Order = orderData ? JSON.parse(orderData as string) : null;

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return GREEN_COLOR;
      case 'cancelled':
        return PRIMARY_RED;
      case 'pending':
        return YELLOW_COLOR;
      default:
        return DARK_GRAY;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string): keyof typeof MaterialIcons.glyphMap => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'check-circle';
      case 'cancelled':
        return 'cancel';
      case 'pending':
        return 'schedule';
      default:
        return 'info';
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toFixed(2)}`;
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render order item
  const renderOrderItem = ({ item }: { item: Order['items'][0] }) => (
    <View style={styles.orderItemCard}>
      <Image 
        source={
          item.product.images.length > 0 
            ? { uri: item.product.images[0].url }
            : require('../assets/images/instant-pic.png')
        } 
        style={styles.itemImage} 
        resizeMode="cover" 
      />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.product.description}
        </Text>
        <Text style={styles.itemWeight}>
          Weight: {item.product.weight.value}{item.product.weight.unit}
        </Text>
        <View style={styles.itemPricing}>
          <Text style={styles.itemPrice}>{formatCurrency(item.priceAtTime)}</Text>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
        </View>
        <Text style={styles.itemSubtotal}>
          Subtotal: {formatCurrency(item.subtotal)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.backButtonNav} onPress={handleBack}>
          <AntDesign name="left" size={20} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.navigationTitle}>Order Details</Text>
        
        {/* Empty view for centering the title */}
        <View style={styles.backButtonNav} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialIcons 
              name={getStatusIcon(order.status)} 
              size={24} 
              color={getStatusColor(order.status)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
          
          <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          <Text style={styles.orderDate}>
            Placed on {formatDate(order.createdAt)}
          </Text>
          <Text style={styles.orderTotal}>
            Total: {order.formattedTotal || formatCurrency(order.pricing.total)}
          </Text>
        </View>

        {/* Customer Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.customerName}>{order.customer.fullName}</Text>
          <Text style={styles.customerDetail}>{order.customer.email}</Text>
          <Text style={styles.customerDetail}>{order.customer.phone}</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.addressText}>
            {order.deliveryAddress.street}
            {order.deliveryAddress.landmark && `, ${order.deliveryAddress.landmark}`}
          </Text>
          <Text style={styles.addressText}>
            {order.deliveryAddress.city}, {order.deliveryAddress.state}
          </Text>
          <Text style={styles.addressText}>
            {order.deliveryAddress.zipCode}, {order.deliveryAddress.country || 'India'}
          </Text>
        </View>

        {/* Order Items */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Items ({order.items.length})</Text>
          <FlatList
            data={order.items}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        </View>

        {/* Payment Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Method:</Text>
            <Text style={styles.paymentValue}>
              {order.paymentInfo.method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Status:</Text>
            <Text style={[styles.paymentValue, { color: getStatusColor(order.paymentInfo.status) }]}>
              {order.paymentInfo.status.charAt(0).toUpperCase() + order.paymentInfo.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal:</Text>
            <Text style={styles.priceValue}>{formatCurrency(order.pricing.subtotal)}</Text>
          </View>
          
          {order.pricing.discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount:</Text>
              <Text style={[styles.priceValue, { color: GREEN_COLOR }]}>
                -{formatCurrency(order.pricing.discount)}
              </Text>
            </View>
          )}
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee:</Text>
            <Text style={styles.priceValue}>
              {order.pricing.deliveryFee > 0 ? formatCurrency(order.pricing.deliveryFee) : 'FREE'}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax:</Text>
            <Text style={styles.priceValue}>{formatCurrency(order.pricing.tax)}</Text>
          </View>
          
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.pricing.total)}</Text>
          </View>
        </View>

        {/* Order Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Order Timeline</Text>
            {order.statusHistory.map((history, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStatus}>
                    {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                  </Text>
                  <Text style={styles.timelineDate}>
                    {formatDate(history.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Navigation Bar Styles
  navigationBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  backButtonNav: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
  },

  navigationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },

  scrollView: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },

  // Status Card Styles
  statusCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 4,
  },

  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_RED,
  },

  // Section Card Styles
  sectionCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 12,
  },

  // Customer Information Styles
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 4,
  },

  customerDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },

  // Address Styles
  addressText: {
    fontSize: 14,
    color: DARK_GRAY,
    lineHeight: 20,
    marginBottom: 2,
  },

  // Order Item Styles
  orderItemCard: {
    flexDirection: 'row',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },

  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },

  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 4,
  },

  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  itemWeight: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  itemPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_RED,
  },

  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },

  itemSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_GRAY,
  },

  // Payment Information Styles
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },

  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK_GRAY,
  },

  // Price Breakdown Styles
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  priceLabel: {
    fontSize: 14,
    color: '#666',
  },

  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK_GRAY,
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },

  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_RED,
  },

  // Timeline Styles
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_RED,
    marginRight: 12,
  },

  timelineContent: {
    flex: 1,
  },

  timelineStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_GRAY,
  },

  timelineDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Error State Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    fontSize: 16,
    color: PRIMARY_RED,
    marginBottom: 20,
    textAlign: 'center',
  },

  backButton: {
    backgroundColor: PRIMARY_RED,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  bottomSpacing: {
    height: 20,
  },
});

export default OrderDetailsScreen;