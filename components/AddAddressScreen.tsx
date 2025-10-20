import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddAddressRequest, addressService } from '../services/addressService';

const RED_COLOR = '#D13635';
const LIGHT_GRAY = '#f5f5f5';
const DARK_GRAY = '#666';

interface AddAddressScreenProps {
  onAddressAdded?: () => void;
}

const AddAddressScreen: React.FC<AddAddressScreenProps> = ({ onAddressAdded }) => {
  const [formData, setFormData] = useState<AddAddressRequest>({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    isDefault: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Address label is required';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AddAddressRequest, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      const addressData: AddAddressRequest = {
        ...formData,
        landmark: formData.landmark?.trim() || undefined,
      };

      await addressService.addAddress(addressData);
      

    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Address</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Address Label */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address Label *</Text>
            <TextInput
              style={[styles.input, errors.label && styles.inputError]}
              placeholder="e.g., Home, Work, Office"
              value={formData.label}
              onChangeText={(value) => handleInputChange('label', value)}
              maxLength={50}
            />
            {errors.label && <Text style={styles.errorText}>{errors.label}</Text>}
          </View>

          {/* Street Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput, errors.street && styles.inputError]}
              placeholder="House/Flat number, Street name, Area"
              value={formData.street}
              onChangeText={(value) => handleInputChange('street', value)}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}
          </View>

          {/* Landmark */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Near City Mall, Opposite Bank"
              value={formData.landmark}
              onChangeText={(value) => handleInputChange('landmark', value)}
              maxLength={100}
            />
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="Enter city"
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              maxLength={50}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          {/* State and ZIP Code Row */}
          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                style={[styles.input, errors.state && styles.inputError]}
                placeholder="Enter state"
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                maxLength={50}
              />
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>ZIP Code *</Text>
              <TextInput
                style={[styles.input, errors.zipCode && styles.inputError]}
                placeholder="6-digit code"
                value={formData.zipCode}
                onChangeText={(value) => handleInputChange('zipCode', value)}
                keyboardType="numeric"
                maxLength={6}
              />
              {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode}</Text>}
            </View>
          </View>

          {/* Set as Default */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('isDefault', !formData.isDefault)}
          >
            <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
              {formData.isDefault && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Set as default address</Text>
          </TouchableOpacity>

          {/* Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              * Required fields. This address will be saved to your account for future orders.
            </Text>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.disabledButton]} 
            onPress={handleSaveAddress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Save Address</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  keyboardContainer: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },

  backButton: {
    padding: 5,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },

  headerRight: {
    width: 34,
  },

  // Content Styles
  content: {
    flex: 1,
    padding: 20,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
  },

  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },

  inputError: {
    borderColor: RED_COLOR,
  },

  errorText: {
    fontSize: 14,
    color: RED_COLOR,
    marginTop: 5,
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  halfWidth: {
    flex: 0.48,
  },

  // Checkbox Styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: RED_COLOR,
    borderColor: RED_COLOR,
  },

  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },

  // Note Styles
  noteContainer: {
    backgroundColor: LIGHT_GRAY,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },

  noteText: {
    fontSize: 14,
    color: DARK_GRAY,
    lineHeight: 20,
  },

  // Bottom Section
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: 'white',
  },

  saveButton: {
    backgroundColor: RED_COLOR,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  disabledButton: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },

  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddAddressScreen;