import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Color constants
const DARK_GRAY = '#333';
const MEDIUM_GRAY = '#666';
const LIGHT_GRAY = '#F5F5F5';
const SEPARATOR_COLOR = '#E8E8E8';

// Privacy setting interface
interface PrivacySetting {
  id: string;
  leftIcon: string;
  iconType: 'feather' | 'antdesign';
  label: string;
  action: () => void;
}

const PrivacySecurityScreen: React.FC = () => {
  const router = useRouter();

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Handle view login activity
  const handleViewLoginActivity = () => {
    Alert.alert(
      'View Login Activity',
      'This feature will show your recent login sessions and devices.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to login activity page
            Alert.alert('Navigation', 'Navigating to Login Activity page...');
          },
        },
      ]
    );
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deletion',
              'Your account deletion request has been initiated. You will receive a confirmation email shortly.'
            );
          },
        },
      ]
    );
  };

  // Privacy settings data
  const privacySettings: PrivacySetting[] = [
    {
      id: '1',
      leftIcon: 'arrow-right',
      iconType: 'feather',
      label: 'View Login Activity',
      action: handleViewLoginActivity,
    },
    {
      id: '2',
      leftIcon: 'trash-2',
      iconType: 'feather',
      label: 'Delete Account',
      action: handleDeleteAccount,
    },
  ];

  // Render icon based on type
  const renderIcon = (iconName: string, iconType: string, color: string) => {
    const iconProps = {
      name: iconName as any,
      size: 20,
      color: color,
    };

    switch (iconType) {
      case 'feather':
        return <Feather {...iconProps} />;
      case 'antdesign':
        return <AntDesign {...iconProps} />;
      default:
        return <Feather {...iconProps} />;
    }
  };

  // Render privacy setting item
  const renderPrivacyItem = (item: PrivacySetting, index: number) => {
    const isLastItem = index === privacySettings.length - 1;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, isLastItem && styles.lastSettingItem]}
        onPress={item.action}
        activeOpacity={0.7}
      >
        {/* Left Icon */}
        <View style={styles.leftIconContainer}>
          {renderIcon(item.leftIcon, item.iconType, MEDIUM_GRAY)}
        </View>

        {/* Text Label */}
        <Text style={styles.settingLabel}>{item.label}</Text>

        {/* Right Arrow Icon */}
        <View style={styles.rightIconContainer}>
          <AntDesign name="right" size={16} color={MEDIUM_GRAY} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AntDesign name="left" size={24} color={DARK_GRAY} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        
        {/* Empty view for centering the title */}
        <View style={styles.backButton} />
      </View>

      {/* Settings List */}
      <View style={styles.settingsList}>
        {privacySettings.map((item, index) => renderPrivacyItem(item, index))}
      </View>

      {/* Information Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Privacy Information</Text>
        <Text style={styles.infoText}>
          Your privacy and security are important to us. These settings help you control your account security and manage your personal data.
        </Text>
        <Text style={styles.infoText}>
          • View Login Activity shows your recent login sessions and devices
        </Text>
        <Text style={styles.infoText}>
          • Delete Account permanently removes all your data and cannot be undone
        </Text>
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

  // Settings List Styles
  settingsList: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: SEPARATOR_COLOR,
  },

  lastSettingItem: {
    borderBottomWidth: 0,
  },

  leftIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: DARK_GRAY,
    lineHeight: 20,
  },

  rightIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // Information Section Styles
  infoSection: {
    backgroundColor: LIGHT_GRAY,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: MEDIUM_GRAY,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default PrivacySecurityScreen;