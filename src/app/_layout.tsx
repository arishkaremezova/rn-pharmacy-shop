import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../../auth/AuthContext';
import AuthScreen from '../../screens/AuthScreen';
import HeaderCartButton from '../../components/HeaderCartButton';
import LogoutButton from '../../components/LogoutButton';

function HeaderActions() {
  return (
    <View style={styles.actions}>
      <LogoutButton />
      <HeaderCartButton />
    </View>
  );
}

function Navigation() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#16765d" />
      </View>
    );
  }

  if (!token) return <AuthScreen />;

  return (
    <Stack screenOptions={{
      headerTintColor: '#185844',
      headerStyle: { backgroundColor: '#fff' },
      contentStyle: { backgroundColor: '#f2f7f4' },
      headerShadowVisible: false,
      headerBackTitle: 'Назад',
    }}>
      <Stack.Screen name="index" options={{ title: 'Моя аптека', headerRight: HeaderActions }} />
      <Stack.Screen name="drugs/[id]" options={{ title: 'О препарате', headerRight: HeaderActions }} />
      <Stack.Screen name="cart" options={{ title: 'Корзина' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
