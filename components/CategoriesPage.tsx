import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import { cartService } from '../services/cartService';
import { Product, productService } from '../services/productService';
import { useToast } from './ui/ToastProvider';

const RED_COLOR = '#D13635';
const LIGHT_GRAY = '#f5f5f5';

// Interface for category with products
interface CategoryWithProducts {
  id: string;
  name: string;
  description: string;
  image: any;
  itemCount: string;
  products: Product[];
}

// Categories configuration
const categoriesConfig = [
  {
    id: '1',
    name: 'Premium Cut',
    description: 'Premium quality meat cuts',
    image: require('../assets/images/instant-pic.png'),
    apiCategory: 'premium'
  },
  {
    id: '2', 
    name: 'Normal Cut',
    description: 'Regular quality meat cuts',
    image: require('../assets/images/instant-pic.png'),
    apiCategory: 'normal'
  }
];

// Header Component
const Header: React.FC = () => {
  const handleBack = () => {
    // TODO: Implement back navigation
  };

  const handleMenu = () => {
    // TODO: Implement menu functionality
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
        <AntDesign name="left" size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Categories</Text>
      
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
      

    </View>
  );
};

// Product Card Component
const ProductCard: React.FC<{ item: Product; onAddToCart: (product: Product) => void; onPress: (product: Product) => void }> = ({ item, onAddToCart, onPress }) => {
  const handleAddToCart = () => {
    onAddToCart(item);
  };

  const handlePress = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={handlePress}>
      <View style={styles.productImageContainer}>
        <Image 
          source={
            item.image || (item.images && item.images[0]?.url)
              ? { uri: item.image || item.images?.[0]?.url }
              : require('../assets/images/instant-pic.png')
          } 
          style={styles.productImage} 
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <AntDesign name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>
          ₹{Math.round(item.discountedPrice || item.price)}/kg
        </Text>
        
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.ratings?.average || item.rating || 4.5}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Category Section Component
const CategorySection: React.FC<{ 
  category: CategoryWithProducts; 
  onProductPress: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}> = ({ category, onProductPress, onAddToCart }) => {
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard item={item} onPress={onProductPress} onAddToCart={onAddToCart} />
  );

  return (
    <View style={styles.categorySection}>
      <View style={styles.categorySectionHeader}>
        <Text style={styles.categorySectionTitle}>{category.name}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {category.products.length > 0 ? (
        <FlatList
          data={category.products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id || item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products available in this category</Text>
        </View>
      )}
    </View>
  );
};

// Category Card Component
const CategoryCard: React.FC<{ item: CategoryWithProducts; onPress: (category: CategoryWithProducts) => void }> = ({ item, onPress }) => {
  const handleCategoryPress = () => {
    onPress(item);
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
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { refreshCartCount } = useCart();
  const { showSuccess, showError } = useToast();

  // Fetch categories and their products
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setLoading(true);
        
        const categoriesData: CategoryWithProducts[] = [];
        
        for (const config of categoriesConfig) {
          try {
            const products = await productService.getProductsByCategory(config.apiCategory);
            categoriesData.push({
              id: config.id,
              name: config.name,
              description: config.description,
              image: config.image,
              itemCount: `${products.length} items`,
              products: products
            });
          } catch (error) {
            console.error(`Error fetching products for ${config.name}:`, error);
            // Add empty category if fetch fails
            categoriesData.push({
              id: config.id,
              name: config.name,
              description: config.description,
              image: config.image,
              itemCount: '0 items',
              products: []
            });
          }
        }
        
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  // Handle product press
  const handleProductPress = (product: Product) => {
    router.push(`/product-detail?id=${product._id || product.id}` as any);
  };

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    try {
      await cartService.addToCart(product._id || product.id, 1);
      // Refresh cart count to update the badge
      await refreshCartCount();
      // Show success toast
      showSuccess(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add item to cart. Please try again.');
    }
  };

  // Handle category press
  const handleCategoryPress = (category: CategoryWithProducts) => {
    // TODO: Implement category selection logic
  };

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

  const renderCategoryItem = ({ item }: { item: CategoryWithProducts }) => (
    <CategoryCard item={item} onPress={handleCategoryPress} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={RED_COLOR} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              <CategorySection 
                key={category.id} 
                category={category} 
                onProductPress={handleProductPress}
                onAddToCart={handleAddToCart}
              />
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
              
              {categories.length > 0 ? (
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
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No categories available</Text>
                </View>
              )}
            </View>
            
            {/* Product Sections */}
            {categories.map((category) => (
              <CategorySection 
                key={category.id} 
                category={category} 
                onProductPress={handleProductPress}
                onAddToCart={handleAddToCart}
              />
            ))}
            
            {/* Popular Categories Section */}
            {categories.length > 0 && (
              <View style={styles.popularSection}>
                <Text style={styles.sectionTitle}>Popular This Week</Text>
                
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
            )}
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
    textAlign: 'center',
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

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default CategoriesPage;