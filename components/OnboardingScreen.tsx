import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import the local asset directly
// Adjust the path based on where your onboarding.tsx file is located.
// This assumes the file is in 'app/' and the image is in 'assets/image/'
const deliveryImage = require('../assets/images/bike-delivery.png'); 

const RED_COLOR = '#D13635';
const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const router = useRouter();

  const features = [
    {
      id: 0,
      title: 'Freshness First',
      description: 'At Sejá\'s, we deliver only the freshest, premium buffalo meat',
    },
    {
      id: 1,
      title: 'Precision Cuts',
      description: 'Sejá\'s offers a variety of buffalo meat cuts to suit every recipe',
    },
    {
      id: 2,
      title: 'Speedy Delivery',
      description: 'With Sejá\'s, your buffalo meat arrives quickly',
    },
  ];

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to login page when on the last step
      router.push('/auth/login');
    }
  };


  return (
    <View style={styles.container}>
      {/* Header Section */}
<View style={styles.header}>
  <Image source={deliveryImage} style={styles.topImage} resizeMode="contain" />
</View>

  {/* Pagination Dots below image */}
  <View style={styles.paginationDots}>
    {features.map((_, index) => (
      <View
        key={index}
        style={[styles.dot, { backgroundColor: index === currentStep ? RED_COLOR : '#ccc' }]}
      />
    ))}
  </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.contentTitle}>Your Fresh Beef Journey</Text>

        {features.map((feature, index) => (
          <View key={feature.id} style={styles.featureContainer}>
            <Animated.View
              style={[
                styles.featureItem,
                { opacity: index <= currentStep ? 1 : 0.4 },
              ]}
            >
              <View style={styles.iconContainer}>
                <AntDesign 
                  name="check-square" 
                  size={24} 
                  color={index <= currentStep ? RED_COLOR : '#ccc'} 
                  style={styles.checkIcon} 
                />
                {index < features.length - 1 && (
                  <View 
                    style={[
                      styles.connectingLine,
                      { backgroundColor: index < currentStep ? RED_COLOR : '#ccc' }
                    ]} 
                  />
                )}
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </Animated.View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === features.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  header: {
    flex: 0.4,
    backgroundColor: RED_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  // Wrap image and dots
  imageWrapper: {
    width: '100%',
    position: 'relative', // allows dots to be positioned over image
    alignItems: 'center',
  },

  topImage: {
    width: '100%',
  },

paginationDots: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 15, // space between image and dots
},


  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ccc', // default color
  },

  content: {
    flex: 0.5,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
  },

  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  featureContainer: {
    marginBottom: 25,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconContainer: {
    alignItems: 'center',
    marginRight: 15,
  },

  checkIcon: {
    marginTop: 3,
  },

  connectingLine: {
    width: 2,
    height: 25,
    marginTop: 5,
  },

  featureTextContainer: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  featureDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },

  nextButton: {
    backgroundColor: RED_COLOR,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },

  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;