import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Import the logo - adjust path as needed
const sejaLogo = require('../assets/images/sejas-logo.png');

const RED_COLOR = '#D13635';

const RegistrationSuccessScreen: React.FC = () => {
  const router = useRouter();
  
  const handleExploreNow = () => {
    // Navigate to the main app homepage (tabs)
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Image source={sejaLogo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Success Title */}
      <View style={styles.titleSection}>
        <Text style={styles.successTitle}>Welcome!</Text>
      </View>

      {/* Subtext */}
      <View style={styles.subtextSection}>
        <Text style={styles.subtextMessage}>
          Success! You&apos;re all set. Welcome aboard! 🎉
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.exploreButton} onPress={handleExploreNow}>
          <Text style={styles.exploreButtonText}>Explore Now !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 40,
    justifyContent: 'center',
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: 60,
  },

  logo: {
    width: 300,
    height: 150,
  },

  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },

  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    letterSpacing: 1,
  },

  subtextSection: {
    alignItems: 'center',
    marginBottom: 80,
    paddingHorizontal: 20,
  },

  subtextMessage: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },

  buttonSection: {
    alignItems: 'center',
    marginTop: 40,
  },

  exploreButton: {
    backgroundColor: RED_COLOR,
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    shadowColor: RED_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  exploreButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default RegistrationSuccessScreen;