import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const RED_COLOR = '#D13635';
const LIGHT_GRAY = '#f5f5f5';

// Mock data for profile menu items
const profileMenuData = [
  {
    id: '1',
    iconName: 'shopping-bag',
    title: 'My Orders',
    iconType: 'feather',
  },
  {
    id: '2',
    iconName: 'map-pin',
    title: 'Saved Addresses',
    iconType: 'feather',
  },
  {
    id: '3',
    iconName: 'heart',
    title: 'Favorites',
    iconType: 'feather',
  },
  {
    id: '4',
    iconName: 'credit-card',
    title: 'Payment Methods',
    iconType: 'feather',
  },
  {
    id: '5',
    iconName: 'bell',
    title: 'Notifications',
    iconType: 'feather',
  },
  {
    id: '6',
    iconName: 'headphones',
    title: 'Customer Support',
    iconType: 'feather',
  },
  {
    id: '7',
    iconName: 'settings',
    title: 'Settings',
    iconType: 'feather',
  },
  {
    id: '8',
    iconName: 'help-circle',
    title: 'Help & FAQ',
    iconType: 'feather',
  },
  {
    id: '9',
    iconName: 'info',
    title: 'About Us',
    iconType: 'feather',
  },
  {
    id: '10',
    iconName: 'log-out',
    title: 'Logout',
    iconType: 'feather',
  },
];

// ProfileHeader Component
const ProfileHeader: React.FC = () => {
  const handleBack = () => {
    Alert.alert('Back', 'Going back to previous screen');
  };

  const handleEdit = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <AntDesign name="left" size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Profile</Text>
      
      <TouchableOpacity onPress={handleEdit}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

// ProfileCard Component
const ProfileCard: React.FC = () => {
  const handleProfileImagePress = () => {
    Alert.alert('Profile Image', 'Change profile picture functionality');
  };

  return (
    <View style={styles.profileCard}>
      <TouchableOpacity onPress={handleProfileImagePress} style={styles.profileImageContainer}>
        <Image 
          source={require('../assets/images/sejas-logo.png')} 
          style={styles.profileImage} 
        />
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={16} color="white" />
        </View>
      </TouchableOpacity>
      
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>
        <Text style={styles.profilePhone}>+91 9876543210</Text>
        
        <View style={styles.membershipBadge}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.membershipText}>Premium Member</Text>
        </View>
      </View>
    </View>
  );
};

// ProfileMenuItem Component
const ProfileMenuItem: React.FC<{ 
  iconName: string; 
  title: string; 
  iconType: string;
  isLast?: boolean;
}> = ({ iconName, title, iconType, isLast }) => {
  const handleMenuItemPress = () => {
    Alert.alert('Menu Item', `You tapped: ${title}`);
  };

  const renderIcon = () => {
    const iconColor = title === 'Logout' ? RED_COLOR : '#666';

    switch (iconType) {
      case 'feather':
        return <Feather name={iconName as any} size={20} color={iconColor} />;
      case 'ionicons':
        return <Ionicons name={iconName as any} size={20} color={iconColor} />;
      case 'antdesign':
        return <AntDesign name={iconName as any} size={20} color={iconColor} />;
      default:
        return <Feather name={iconName as any} size={20} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && styles.lastMenuItem]} 
      onPress={handleMenuItemPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[
          styles.iconContainer, 
          title === 'Logout' && styles.logoutIconContainer
        ]}>
          {renderIcon()}
        </View>
        <Text style={[
          styles.menuItemTitle, 
          title === 'Logout' && styles.logoutTitle
        ]}>
          {title}
        </Text>
      </View>
      
      <View style={styles.menuItemRight}>
        <AntDesign name="right" size={16} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
};

// Stats Component
const ProfileStats: React.FC = () => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>24</Text>
        <Text style={styles.statLabel}>Orders</Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>3</Text>
        <Text style={styles.statLabel}>Addresses</Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>12</Text>
        <Text style={styles.statLabel}>Favorites</Text>
      </View>
    </View>
  );
};

// Main ProfileScreen Component
const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ProfileHeader />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <ProfileCard />
        
        {/* Profile Stats */}
        <ProfileStats />
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          
          <View style={styles.menuList}>
            {profileMenuData.map((item, index) => (
              <ProfileMenuItem
                key={item.id}
                iconName={item.iconName}
                title={item.title}
                iconType={item.iconType}
                isLast={index === profileMenuData.length - 1}
              />
            ))}
          </View>
        </View>
        
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Seja&apos;s Absolute Fresh</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
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

  editText: {
    fontSize: 16,
    color: RED_COLOR,
    fontWeight: '500',
  },

  // Content Styles
  content: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  // Profile Card Styles
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: LIGHT_GRAY,
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: RED_COLOR,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  profileInfo: {
    alignItems: 'center',
  },

  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },

  profilePhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },

  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  membershipText: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '500',
    marginLeft: 6,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: RED_COLOR,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },

  // Menu Styles
  menuContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  menuSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  menuList: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  lastMenuItem: {
    borderBottomWidth: 0,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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

  logoutIconContainer: {
    backgroundColor: '#FFEBEE',
  },

  menuItemTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  logoutTitle: {
    color: RED_COLOR,
  },

  menuItemRight: {
    paddingLeft: 10,
  },

  // App Info Styles
  appInfo: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },

  appInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  versionText: {
    fontSize: 14,
    color: '#999',
  },
});

export default ProfileScreen;