import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Color constants
const PRIMARY_RED = '#D32F2F';
const GREEN_COLOR = '#2E7D32';
const DARK_GRAY = '#333';
const LIGHT_GRAY = '#F5F5F5';
const MEDIUM_GRAY = '#888';

// Item interface
interface OrderItem {
  id: string;
  name: string;
  weight: string;
  units: number;
  price: string;
  image: any;
}

// Mock order items data
const orderItems: OrderItem[] = [
  {
    id: '1',
    name: 'Long Loin',
    weight: '1 kg',
    units: 1,
    price: '$499',
    image: require('../assets/images/instant-pic.png'),
  },
  {
    id: '2',
    name: 'Long Loin',
    weight: '1 kg',
    units: 1,
    price: '$499',
    image: require('../assets/images/instant-pic.png'),
  },
  {
    id: '3',
    name: 'Long Loin',
    weight: '1 kg',
    units: 1,
    price: '$499',
    image: require('../assets/images/instant-pic.png'),
  },
];

// Order information interface
interface OrderInfo {
  shippingAddress: string;
  paymentMethod: string;
  deliveryMethod: string;
  discount: string;
  totalAmount: string;
}

// Mock order information
const orderInformation: OrderInfo = {
  shippingAddress: '24/356A, MG Road, Near South Railway Station, Ernakulam, Kerala – 682016',
  paymentMethod: 'Cash on Delivery',
  deliveryMethod: 'Premium Delivery',
  discount: 'Welcome Bonus – 20%',
  totalAmount: '$1497',
};

const OrderDetailsScreen: React.FC = () => {
  const router = useRouter();

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Handle reorder
  const handleReorder = () => {
    Alert.alert('Reorder', 'Reordering items from this order...');
  };

  // Handle leave feedback
  const handleLeaveFeedback = () => {
    Alert.alert('Leave Feedback', 'Opening feedback form...');
  };

  // Render order item card
  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemWeight}>Weight : {item.weight}</Text>
        <Text style={styles.itemUnits}>Units : {item.units}</Text>
      </View>
      
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
  );

  // Render order information row
  const renderInfoRow = (label: string, value: string, isTotal: boolean = false) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[
        styles.infoValue, 
        isTotal && styles.totalValue,
        label === 'Shipping Address' && styles.addressValue
      ]}>
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AntDesign name="left" size={24} color={DARK_GRAY} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Order Details</Text>
        
        {/* Empty view for centering the title */}
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary Section */}
        <View style={styles.orderSummary}>
          <View style={styles.summaryHeader}>
            <View style={styles.orderIdSection}>
              <Text style={styles.orderId}>Order ID = SAF-2025-001</Text>
              <Text style={styles.trackingNumber}>Tracking Number – SAF19982702</Text>
              <Text style={styles.itemCount}>3 Items</Text>
            </View>
            
            <View style={styles.statusSection}>
              <Text style={styles.orderDate}>05/12/2025</Text>
              <Text style={styles.orderStatus}>Delivered</Text>
            </View>
          </View>
        </View>

        {/* Item List Section */}
        <View style={styles.itemListSection}>
          {orderItems.map(renderOrderItem)}
        </View>

        {/* Order Information Section */}
        <View style={styles.orderInfoSection}>
          <Text style={styles.sectionTitle}>Order information</Text>
          
          <View style={styles.infoContainer}>
            {renderInfoRow('Shipping Address', orderInformation.shippingAddress)}
            {renderInfoRow('Payment method', orderInformation.paymentMethod)}
            {renderInfoRow('Delivery Method', orderInformation.deliveryMethod)}
            {renderInfoRow('Discount', orderInformation.discount)}
            {renderInfoRow('Total Amount', orderInformation.totalAmount, true)}
          </View>
        </View>

        {/* Spacer for bottom buttons */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
          <Text style={styles.reorderButtonText}>Reorder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.feedbackButton} onPress={handleLeaveFeedback}>
          <Text style={styles.feedbackButtonText}>Leave feedback</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header Styles
  header: {
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

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_GRAY,
    textAlign: 'center',
  },

  // Content Styles
  content: {
    flex: 1,
  },

  // Order Summary Styles
  orderSummary: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderIdSection: {
    flex: 1,
  },

  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 8,
  },

  trackingNumber: {
    fontSize: 16,
    color: DARK_GRAY,
    marginBottom: 4,
  },

  itemCount: {
    fontSize: 16,
    color: DARK_GRAY,
  },

  statusSection: {
    alignItems: 'flex-end',
  },

  orderDate: {
    fontSize: 16,
    color: GREEN_COLOR,
    fontWeight: '500',
    marginBottom: 4,
  },

  orderStatus: {
    fontSize: 16,
    color: GREEN_COLOR,
    fontWeight: 'bold',
  },

  // Item List Styles
  itemListSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: LIGHT_GRAY,
  },

  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },

  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 4,
  },

  itemWeight: {
    fontSize: 14,
    color: MEDIUM_GRAY,
    marginBottom: 2,
  },

  itemUnits: {
    fontSize: 14,
    color: MEDIUM_GRAY,
  },

  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },

  // Order Information Styles
  orderInfoSection: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 20,
  },

  infoContainer: {
    backgroundColor: 'white',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  infoLabel: {
    fontSize: 16,
    color: DARK_GRAY,
    fontWeight: '500',
    flex: 1,
    marginRight: 16,
  },

  infoValue: {
    fontSize: 16,
    color: DARK_GRAY,
    textAlign: 'right',
    flex: 1.5,
  },

  addressValue: {
    lineHeight: 22,
  },

  totalValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: DARK_GRAY,
  },

  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  reorderButton: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: PRIMARY_RED,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'white',
  },

  reorderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_RED,
  },

  feedbackButton: {
    flex: 1,
    height: 50,
    backgroundColor: PRIMARY_RED,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  feedbackButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  spacer: {
    height: 20,
  },
});

export default OrderDetailsScreen;