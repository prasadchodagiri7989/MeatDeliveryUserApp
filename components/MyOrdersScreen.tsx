import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Color constants
const PRIMARY_RED = '#D32F2F';
const GREEN_COLOR = '#2E7D32';
const YELLOW_COLOR = '#F9A825';
const LIGHT_GRAY = '#F5F5F5';
const DARK_GRAY = '#333';
const LIGHT_PINK = '#FFF1F1';

// Order status type
type OrderStatus = 'delivered' | 'cancelled' | 'pending';

// Order interface
interface Order {
  id: string;
  orderId: string;
  date: string;
  title: string;
  quantity: number;
  status: OrderStatus;
  statusText: string;
  image: any;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'SAF-2025-001',
    date: '05/12/2025',
    title: 'Long Loin & More',
    quantity: 3,
    status: 'delivered',
    statusText: 'Delivered',
    image: require('../assets/images/instant-pic.png'),
  },
  {
    id: '2',
    orderId: 'SAF-2025-002',
    date: '03/12/2025',
    title: 'Premium Beef Cuts',
    quantity: 2,
    status: 'cancelled',
    statusText: 'Cancelled',
    image: require('../assets/images/categories-demo.png'),
  },
  {
    id: '3',
    orderId: 'SAF-2025-003',
    date: '01/12/2025',
    title: 'Fresh Buffalo Meat',
    quantity: 5,
    status: 'pending',
    statusText: 'Delivered by 15 Feb',
    image: require('../assets/images/instant-pic.png'),
  },
  {
    id: '4',
    orderId: 'SAF-2025-004',
    date: '28/11/2025',
    title: 'Organic Chicken',
    quantity: 1,
    status: 'delivered',
    statusText: 'Delivered',
    image: require('../assets/images/categories-demo.png'),
  },
  {
    id: '5',
    orderId: 'SAF-2025-005',
    date: '25/11/2025',
    title: 'Mutton Special Cut',
    quantity: 4,
    status: 'pending',
    statusText: 'Delivered by 20 Feb',
    image: require('../assets/images/instant-pic.png'),
  },
];

const MyOrdersScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = ['All', 'Instant Orders', 'Premium Cuts'];

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Handle order details
  const handleOrderDetails = (orderId: string) => {
    Alert.alert('Order Details', `Viewing details for ${orderId}`);
  };

  // Get status color
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
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

  // Filter orders based on active tab
  const getFilteredOrders = (): Order[] => {
    switch (activeTab) {
      case 'Instant Orders':
        return mockOrders.filter(order => order.title.toLowerCase().includes('fresh') || order.title.toLowerCase().includes('organic'));
      case 'Premium Cuts':
        return mockOrders.filter(order => order.title.toLowerCase().includes('premium') || order.title.toLowerCase().includes('loin'));
      default:
        return mockOrders;
    }
  };

  // Render order card
  const renderOrderCard = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      {/* Order ID and Date Row */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID = {item.orderId}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>

      {/* Product Details Row */}
      <View style={styles.orderContent}>
        {/* Product Image */}
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productQuantity}>Quantity - {item.quantity}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.statusText}
          </Text>
        </View>

        {/* Details Button */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => handleOrderDetails(item.orderId)}
        >
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AntDesign name="left" size={20} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.navigationTitle}>My Orders</Text>
        
        {/* Empty view for centering the title */}
        <View style={styles.backButton} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab ? styles.activeTab : styles.inactiveTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.activeTabText : styles.inactiveTabText
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <FlatList
        data={getFilteredOrders()}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        style={styles.ordersList}
        contentContainerStyle={styles.ordersListContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found for &quot;{activeTab}&quot;</Text>
          </View>
        }
      />
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

  backButton: {
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

  // Filter Tabs Styles
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  tabsContainer: {
    paddingHorizontal: 16,
  },

  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },

  activeTab: {
    backgroundColor: PRIMARY_RED,
    borderColor: PRIMARY_RED,
  },

  inactiveTab: {
    backgroundColor: 'white',
    borderColor: '#DDD',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },

  activeTabText: {
    color: 'white',
  },

  inactiveTabText: {
    color: 'black',
  },

  // Orders List Styles
  ordersList: {
    flex: 1,
  },

  ordersListContainer: {
    padding: 16,
  },

  // Order Card Styles
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },

  orderDate: {
    fontSize: 14,
    color: '#888',
  },

  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: LIGHT_GRAY,
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },

  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 4,
  },

  productQuantity: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
  },

  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },

  detailsButton: {
    backgroundColor: PRIMARY_RED,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default MyOrdersScreen;