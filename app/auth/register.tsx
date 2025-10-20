// app/auth/register.tsx
import RegisterScreen from '@/components/RegisterScreen';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterPage() {
  return (
    <SafeAreaView style={styles.container}>
      <RegisterScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
