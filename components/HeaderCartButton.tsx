import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { selectCartCount, useCartStore } from '../stores/cartStore';

export default function HeaderCartButton() {
  const count = useCartStore(selectCartCount);

  return (
    <Pressable onPress={() => router.push('/cart')} style={styles.wrap} accessibilityRole="button" accessibilityLabel={`Корзина, количество: ${count}`}>
      <Ionicons name="bag-outline" size={24} color="#16765d" />
      {count > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 10 },
  badge: { position: 'absolute', right: 0, top: 0, backgroundColor: '#16765d', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
