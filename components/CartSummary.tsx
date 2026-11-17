import { StyleSheet, Text, View } from 'react-native';
import { selectCartCount, useCartLines, useCartStore } from '../stores/cartStore';

export default function CartSummary() {
  const count = useCartStore(selectCartCount);
  const lines = useCartLines();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>Наименований</Text>
        <Text style={styles.value}>{lines.length}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.total}>Всего, шт.</Text>
        <Text style={styles.total}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: 14, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 14, color: '#71867a' },
  value: { fontSize: 14, fontWeight: '600', color: '#183d30' },
  total: { fontSize: 18, fontWeight: '700', color: '#183d30' },
});
