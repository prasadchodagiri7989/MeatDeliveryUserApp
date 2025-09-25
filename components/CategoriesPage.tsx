import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const RED_COLOR = '#D13635';
const LIGHT_GRAY = '#f5f5f5';

// Sample categories data with products
const categories = [
  {
    id: '1',
    name: 'Beef',
    description: 'Fresh premium beef cuts',
    image: require('../assets/images/instant-pic.png'),
    itemCount: '12 items',
    products: [
      { id: '1-1', name: 'Beef Tenderloin', price: '₹600/kg', image: require('../assets/images/instant-pic.png'), rating: 4.8 },
      { id: '1-2', name: 'Beef Ribeye', price: '₹550/kg', image: require('../assets/images/instant-pic.png'), rating: 4.7 },
      { id: '1-3', name: 'Beef Sirloin', price: '₹500/kg', image: require('../assets/images/instant-pic.png'), rating: 4.6 },
      { id: '1-4', name: 'Ground Beef', price: '₹400/kg', image: require('../assets/images/instant-pic.png'), rating: 4.5 },
    ]
  },
  {
    id: '2',
    name: 'Chicken',
    description: 'Farm fresh chicken',
    image: require('../assets/images/instant-pic.png'),
    itemCount: '8 items',
    products: [
      { id: '2-1', name: 'Chicken Breast', price: '₹300/kg', image: require('../assets/images/instant-pic.png'), rating: 4.7 },
      { id: '2-2', name: 'Chicken Wings', price: '₹280/kg', image: require('../assets/images/instant-pic.png'), rating: 4.6 },
      { id: '2-3', name: 'Chicken Thighs', price: '₹250/kg', image: require('../assets/images/instant-pic.png'), rating: 4.5 },
      { id: '2-4', name: 'Whole Chicken', price: '₹200/kg', image: require('../assets/images/instant-pic.png'), rating: 4.8 },
    ]
  },
  {
    id: '3',
    name: 'Mutton',
    description: 'Premium mutton cuts',
    image: require('../assets/images/instant-pic.png'),
    itemCount: '10 items',
    products: [
      { id: '3-1', name: 'Mutton Leg', price: '₹700/kg', image: require('../assets/images/instant-pic.png'), rating: 4.9 },
      { id: '3-2', name: 'Mutton Chops', price: '₹650/kg', image: require('../assets/images/instant-pic.png'), rating: 4.8 },
      { id: '3-3', name: 'Mutton Curry Cut', price: '₹600/kg', image: require('../assets/images/instant-pic.png'), rating: 4.7 },
      { id: '3-4', name: 'Mutton Biryani Cut', price: '₹580/kg', image: require('../assets/images/instant-pic.png'), rating: 4.6 },
    ]
  },
  {
    id: '4',
    name: 'Pork',
    description: 'Fresh pork selections',
    image: require('../assets/images/instant-pic.png'),
    itemCount: '6 items',
    products: [
      { id: '4-1', name: 'Pork Ribs', price: '₹450/kg', image: require('../assets/images/instant-pic.png'), rating: 4.7 },
      { id: '4-2', name: 'Pork Belly', price: '₹400/kg', image: require('../assets/images/instant-pic.png'), rating: 4.6 },
      { id: '4-3', name: 'Pork Chops', price: '₹500/kg', image: require('../assets/images/instant-pic.png'), rating: 4.8 },
      { id: '4-4', name: 'Pork Shoulder', price: '₹380/kg', image: require('../assets/images/instant-pic.png'), rating: 4.5 },
    ]
  },
  {
    id: '5',
    name: 'Fish',
    description: 'Ocean fresh fish',
    image: require('../assets/images/instant-pic.png'),
    itemCount: '15 items',
    products: [
      { id: '5-1', name: 'Salmon Fillet', price: '₹800/kg', image: require('../assets/images/instant-pic.png'), rating: 4.9 },
      { id: '5-2', name: 'Tuna Steak', price: '₹750/kg', image: require('../assets/images/instant-pic.png'), rating: 4.8 },
      { id: '5-3', name: 'Sea Bass', price: '₹600/kg', image: require('../assets/images/instant-pic.png'), rating: 4.7 },
      { id: '5-4', name: 'Pomfret', price: '₹500/kg', image: require('../assets/images/instant-pic.png'), rating: 4.6 },
    ]
  },
  {
    id: '6',
    name: 'Seafood',
    description: 'Premium seafood',
    image: require('../assets/images/instant-pic.png'),
    itemCount: '9 items',
    products: [
      { id: '6-1', name: 'King Prawns', price: '₹900/kg', image: require('../assets/images/instant-pic.png'), rating: 4.9 },
      { id: '6-2', name: 'Crab Meat', price: '₹850/kg', image: require('../assets/images/instant-pic.png'), rating: 4.8 },
      { id: '6-3', name: 'Lobster Tail', price: '₹1200/kg', image: require('../assets/images/instant-pic.png'), rating: 5.0 },
      { id: '6-4', name: 'Mussels', price: '₹400/kg', image: require('../assets/images/instant-pic.png'), rating: 4.5 },
    ]
  },
];

// Header Component
const Header: React.FC = () => {
  const handleBack = () => {
    Alert.alert('Back', 'Going back to previous screen');
  };

  const handleMenu = () => {
    Alert.alert('Menu', 'Opening menu');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
        <AntDesign name="left" size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Categories</Text>
      
      <TouchableOpacity onPress={handleMenu} style={styles.headerButton}>
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

// SearchBar Component
const SearchBar: React.FC<{ searchText: string; setSearchText: (text: string) => void }> = ({ searchText, setSearchText }) => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchInputWrapper}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories or products..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="options" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

// Product Card Component
const ProductCard: React.FC<{ item: any }> = ({ item }) => {
  const handleAddToCart = () => {
    Alert.alert('Added to Cart', `${item.name} added to cart`);
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={item.image} style={styles.productImage} />
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <AntDesign name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </View>
  );
};

// Category Section Component
const CategorySection: React.FC<{ category: any }> = ({ category }) => {
  const renderProduct = ({ item }: { item: any }) => <ProductCard item={item} />;

  return (
    <View style={styles.categorySection}>
      <View style={styles.categorySectionHeader}>
        <Text style={styles.categorySectionTitle}>{category.name}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={category.products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      />
    </View>
  );
};

// Category Card Component
const CategoryCard: React.FC<{ item: typeof categories[0] }> = ({ item }) => {
  const handleCategoryPress = () => {
    Alert.alert('Category Selected', `You selected ${item.name}`);
  };

  return (
    <TouchableOpacity style={styles.categoryCard} onPress={handleCategoryPress}>
      <Image source={item.image} style={styles.categoryImage} />
      
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <Text style={styles.categoryItemCount}>{item.itemCount}</Text>
      </View>
      
      <View style={styles.categoryArrow}>
        <AntDesign name="right" size={16} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

// Main CategoriesPage Component
const CategoriesPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  // Filter categories and products based on search
  const filteredData = searchText 
    ? categories.filter(category => 
        category.name.toLowerCase().includes(searchText.toLowerCase()) ||
        category.description.toLowerCase().includes(searchText.toLowerCase()) ||
        category.products.some(product => 
          product.name.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : categories;

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <CategoryCard item={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />
      
      {/* SearchBar */}
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        {searchText ? (
          /* Search Results */
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsTitle}>
              Search Results for &quot;{searchText}&quot; ({filteredData.length} found)
            </Text>
            
            {filteredData.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </View>
        ) : (
          <>
            {/* Categories Section */}
            <View style={styles.categoriesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Categories</Text>
                <Text style={styles.sectionSubtitle}>Choose your favorite meat</Text>
              </View>
              
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
                columnWrapperStyle={styles.categoryRow}
              />
            </View>
            
            {/* Product Sections */}
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
            
            {/* Popular Categories Section */}
            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>Popular This Week</Text>
              
              <FlatList
                data={categories.slice(0, 4)}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
                columnWrapperStyle={styles.categoryRow}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  // Content Styles
  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
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

  headerButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  // SearchBar Styles
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },

  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginRight: 10,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  filterButton: {
    backgroundColor: LIGHT_GRAY,
    padding: 12,
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoriesSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sectionHeader: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
  },

  categoriesContainer: {
    paddingBottom: 10,
  },

  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  // Category Card Styles
  categoryCard: {
    flex: 0.48,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  categoryImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: 'cover',
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },

  categoryItemCount: {
    fontSize: 12,
    color: RED_COLOR,
    fontWeight: '500',
  },

  categoryArrow: {
    position: 'absolute',
    top: 15,
    right: 15,
  },

  // Popular Section
  popularSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },

  // Search Results
  searchResults: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },

  // Product Card Styles
  productCard: {
    width: 140,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  productImageContainer: {
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },

  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: RED_COLOR,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productInfo: {
    padding: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: RED_COLOR,
    marginBottom: 6,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },

  // Category Section Styles
  categorySection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },

  categorySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  categorySectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  seeAllText: {
    fontSize: 14,
    color: RED_COLOR,
    fontWeight: '500',
  },

  productsContainer: {
    paddingRight: 20,
  },
});

export default CategoriesPage;