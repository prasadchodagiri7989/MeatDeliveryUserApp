import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Color constants
const PRIMARY_RED = '#D32F2F';
const DARK_GRAY = '#333';
const MEDIUM_GRAY = '#666';
const LIGHT_GRAY = '#F5F5F5';

// Address interface
interface Address {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}

// Mock addresses data
const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'Ajay Satya Murthy',
    address: '24/356A, MG Road, Near South Railway Station, Ernakulam, Kerala – 682016',
    phoneNumber: '9347868290',
    email: 'sambanaajaysatyamurthy@gmail.com',
  },
  {
    id: '2',
    name: 'Nithya Diwakar',
    address: '24/356A, MG Road, Near South Railway Station, Ernakulam, Kerala – 682016',
    phoneNumber: '9347868290',
    email: 'sambanaajaysatyamurthy@gmail.com',
  },
];

const AddressManagementScreen: React.FC = () => {
  const router = useRouter();

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Handle add new address
  const handleAddNew = () => {
   
  };

  // Handle edit address
  const handleEditAddress = (addressId: string, name: string) => {
  };

  // Handle delete address
  const handleDeleteAddress = (addressId: string, name: string) => {

  };

  // Render address card
  const renderAddressCard = (address: Address) => (
    <View key={address.id} style={styles.addressCard}>
      {/* Name */}
      <Text style={styles.addressName}>{address.name}</Text>
      
      {/* Address Details */}
      <Text style={styles.addressDetails}>{address.address}</Text>
      
      {/* Phone Number */}
      <Text style={styles.contactInfo}>Phone Number – {address.phoneNumber}</Text>
      
      {/* Email */}
      <Text style={styles.contactInfo}>Email – {address.email}</Text>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditAddress(address.id, address.name)}
        >
          <Feather name="edit-2" size={16} color={PRIMARY_RED} style={styles.buttonIcon} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAddress(address.id, address.name)}
        >
          <Feather name="trash-2" size={16} color="white" style={styles.buttonIcon} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AntDesign name="left" size={24} color={DARK_GRAY} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Address</Text>
        
        {/* Empty view for centering the title */}
        <View style={styles.backButton} />
      </View>

      {/* Add New Address Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addNewButton} onPress={handleAddNew}>
          <AntDesign name="plus" size={20} color="white" style={styles.addIcon} />
          <Text style={styles.addNewButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Address List */}
      <ScrollView 
        style={styles.addressList} 
        contentContainerStyle={styles.addressListContainer}
        showsVerticalScrollIndicator={false}
      >
        {mockAddresses.map(renderAddressCard)}
        
        {/* Empty state if no addresses */}
        {mockAddresses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No addresses added yet</Text>
            <Text style={styles.emptySubText}>Tap &quot;Add New&quot; to add your first address</Text>
          </View>
        )}
      </ScrollView>
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

  // Add Button Styles
  addButtonContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  addNewButton: {
    backgroundColor: PRIMARY_RED,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  addIcon: {
    marginRight: 8,
  },

  addNewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },

  // Address List Styles
  addressList: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
  },

  addressListContainer: {
    padding: 16,
  },

  // Address Card Styles
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 12,
  },

  addressDetails: {
    fontSize: 16,
    color: MEDIUM_GRAY,
    lineHeight: 22,
    marginBottom: 12,
  },

  contactInfo: {
    fontSize: 14,
    color: MEDIUM_GRAY,
    marginBottom: 8,
  },

  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: PRIMARY_RED,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: 'white',
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY_RED,
  },

  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: PRIMARY_RED,
    borderRadius: 6,
    marginLeft: 8,
  },

  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },

  buttonIcon: {
    marginRight: 6,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: MEDIUM_GRAY,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubText: {
    fontSize: 14,
    color: MEDIUM_GRAY,
    textAlign: 'center',
  },
});

export default AddressManagementScreen;