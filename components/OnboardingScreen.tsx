import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Import the local asset directly
// Adjust the path based on where your onboarding.tsx file is located.
// This assumes the file is in 'app/' and the image is in 'assets/image/'
const deliveryImage = require('../assets/image/bike-delivery.jpg'); 

const RED_COLOR = '#D13635';
const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

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
    }
  };


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.circleContainer}>
          <Image source={deliveryImage} style={styles.deliveryImage} resizeMode="contain" />
        </View>
        <View style={styles.paginationDots}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentStep ? RED_COLOR : '#ccc' },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.contentTitle}>Your Fresh Beef Journey</Text>

        {features.map((feature, index) => (
          <Animated.View
            key={feature.id}
            style={[
              styles.featureItem,
              { opacity: index === currentStep ? 1 : 0.4 },
            ]}
          >
            <AntDesign name="check-square" size={24} color={RED_COLOR} style={styles.checkIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </Animated.View>
        ))}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={currentStep === features.length - 1}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    flex: 0.5,
    backgroundColor: RED_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  circleContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  deliveryImage: {
    width: '100%',
    height: '100%',
  },
  paginationDots: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
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
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  checkIcon: {
    marginRight: 15,
    marginTop: 3,
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