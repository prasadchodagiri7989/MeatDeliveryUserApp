import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.7; // 80% of screen width
const BANNER_HEIGHT = (BANNER_WIDTH * 9) / 21; // 21:9 aspect ratio

const banners = [
  { title: "Exclusive Rump Roast", rating: 5.0, image: require('../assets/images/last-banner.jpg') },
  { title: "Premium Rump Rib", rating: 4.9, image: require('../assets/images/last-banner.jpg') },
  { title: "Chef's Special Cut", rating: 5.0, image: require('../assets/images/last-banner.jpg') },
];

export default function BannerSection() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Exclusive Collection</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
        {banners.map((banner, index) => (
          <View key={index} style={styles.bannerContainer}>
            <Image source={banner.image} style={styles.bannerImage} />
            <View style={styles.overlay}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerRating}>⭐ {banner.rating}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10,
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerRating: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: '#D13635',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
