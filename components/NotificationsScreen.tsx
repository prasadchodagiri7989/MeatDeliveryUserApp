import { AntDesign, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const RED_COLOR = '#D13635';
const LIGHT_GRAY = '#f5f5f5';

// Mock notifications data
const notificationsData = [
  {
    id: '1',
    title: 'Your order has been confirmed',
    message: 'Beef Tenderloin and 2 other items are being prepared',
    timestamp: '2 minutes ago',
    type: 'order',
    isRead: false,
  },
  {
    id: '2',
    title: 'Special offer on Chicken',
    message: 'Get 20% off on all chicken products. Limited time offer!',
    timestamp: '15 minutes ago',
    type: 'offer',
    isRead: false,
  },
  {
    id: '3',
    title: 'Order delivered successfully',
    message: 'Your order #1234 has been delivered to Elamkulam, Kerala',
    timestamp: '1 hour ago',
    type: 'delivery',
    isRead: true,
  },
  {
    id: '4',
    title: 'New products available',
    message: 'Fresh seafood collection is now available in your area',
    timestamp: '3 hours ago',
    type: 'product',
    isRead: true,
  },
  {
    id: '5',
    title: 'Payment successful',
    message: 'Payment of ₹1,250 has been processed successfully',
    timestamp: '5 hours ago',
    type: 'payment',
    isRead: true,
  },
  {
    id: '6',
    title: 'Welcome to Seja\'s!',
    message: 'Thank you for joining us. Explore fresh meat delivery at your doorstep',
    timestamp: '1 day ago',
    type: 'welcome',
    isRead: true,
  },
  {
    id: '7',
    title: 'Order out for delivery',
    message: 'Your order #1233 is out for delivery. Expected delivery in 15 minutes',
    timestamp: '1 day ago',
    type: 'delivery',
    isRead: true,
  },
  {
    id: '8',
    title: 'Flash sale alert',
    message: 'Flash sale on premium cuts starting in 1 hour. Don\'t miss out!',
    timestamp: '2 days ago',
    type: 'offer',
    isRead: true,
  },
];

// NotificationsHeader Component
const NotificationsHeader: React.FC = () => {
  const handleBack = () => {
    Alert.alert('Back', 'Going back to previous screen');
  };

  const handleMarkAllRead = () => {
    Alert.alert('Mark All Read', 'All notifications marked as read');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <AntDesign name="left" size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Notifications</Text>
      
      <TouchableOpacity onPress={handleMarkAllRead}>
        <Text style={styles.markAllReadText}>Mark all read</Text>
      </TouchableOpacity>
    </View>
  );
};

// NotificationItemCard Component
const NotificationItemCard: React.FC<{ item: any }> = ({ item }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Ionicons name="receipt-outline" size={20} color={RED_COLOR} />;
      case 'offer':
        return <Ionicons name="pricetag-outline" size={20} color="#FF9500" />;
      case 'delivery':
        return <Ionicons name="bicycle-outline" size={20} color="#4CAF50" />;
      case 'product':
        return <Ionicons name="storefront-outline" size={20} color="#2196F3" />;
      case 'payment':
        return <Ionicons name="card-outline" size={20} color="#9C27B0" />;
      case 'welcome':
        return <Ionicons name="heart-outline" size={20} color="#E91E63" />;
      default:
        return <Ionicons name="notifications-outline" size={20} color="#666" />;
    }
  };

  const handleNotificationPress = () => {
    Alert.alert('Notification', `You tapped: ${item.title}`);
  };

  return (
    <TouchableOpacity style={styles.notificationItem} onPress={handleNotificationPress}>
      {!item.isRead && <View style={styles.unreadIndicator} />}
      
      <View style={styles.iconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}>
          {item.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      <View style={styles.chevronContainer}>
        <AntDesign name="right" size={16} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
};

// Main NotificationsScreen Component
const NotificationsScreen: React.FC = () => {
  const renderNotificationItem = ({ item }: { item: any }) => (
    <NotificationItemCard item={item} />
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No notifications</Text>
      <Text style={styles.emptyStateMessage}>
        When you receive notifications, they will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <NotificationsHeader />
      
      {/* Notifications List */}
      <FlatList
        data={notificationsData}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={styles.flatList}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  markAllReadText: {
    fontSize: 14,
    color: RED_COLOR,
    fontWeight: '500',
  },

  // FlatList Styles
  flatList: {
    flex: 1,
  },

  listContainer: {
    paddingVertical: 10,
  },

  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 70,
  },

  // Notification Item Styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    position: 'relative',
  },

  unreadIndicator: {
    position: 'absolute',
    left: 10,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RED_COLOR,
    transform: [{ translateY: -4 }],
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  contentContainer: {
    flex: 1,
    paddingRight: 10,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },

  unreadTitle: {
    fontWeight: 'bold',
    color: '#000',
  },

  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 6,
  },

  timestamp: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },

  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },

  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },

  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationsScreen;