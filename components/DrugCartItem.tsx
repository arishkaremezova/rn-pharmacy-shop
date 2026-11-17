import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CartLine } from '../types/drug';
import { useCartStore } from '../stores/cartStore';

export default function DrugCartItem({ line }: { line: CartLine }) {
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const remove = useCartStore((state) => state.remove);
  const { drug, quantity } = line;
  const atLimit = quantity >= drug.stock;

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{drug.name}</Text>
      <Text style={styles.details}>{drug.form} · {drug.dosage}</Text>
      <Text style={styles.details}>{drug.manufacturer}</Text>
      <Text style={styles.prescription}>{drug.prescription_required ? 'По рецепту' : 'Без рецепта'}</Text>
      <View style={styles.controls}>
        <Pressable style={styles.quantityButton} onPress={() => decrement(drug.id)} accessibilityRole="button" accessibilityLabel={`Уменьшить количество ${drug.name}`}>
          <Text style={styles.quantityText}>−</Text>
        </Pressable>
        <Text style={styles.quantity}>{quantity}</Text>
        <Pressable style={[styles.quantityButton, atLimit && styles.disabled]} disabled={atLimit} onPress={() => increment(drug.id)} accessibilityRole="button" accessibilityLabel={`Увеличить количество ${drug.name}`}>
          <Text style={styles.quantityText}>+</Text>
        </Pressable>
        <Pressable style={styles.remove} onPress={() => remove(drug.id)} accessibilityRole="button" accessibilityLabel={`Удалить ${drug.name}`}>
          <Text style={styles.removeText}>Удалить</Text>
        </Pressable>
      </View>
      {atLimit && <Text style={styles.limit}>Достигнут остаток на складе</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, marginBottom: 12, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#e1ebe5' },
  name: { fontSize: 17, fontWeight: '700', color: '#183d30', marginBottom: 6 },
  details: { fontSize: 13, color: '#71867a', marginBottom: 4 },
  prescription: { fontSize: 12, color: '#8a6224', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  quantityButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#e9f5ef', alignItems: 'center', justifyContent: 'center' },
  quantityText: { fontSize: 22, color: '#16765d', fontWeight: '600' },
  quantity: { minWidth: 28, textAlign: 'center', color: '#183d30', fontSize: 17, fontWeight: '700' },
  remove: { marginLeft: 'auto', padding: 8 },
  removeText: { color: '#ad4c42', fontSize: 13 },
  disabled: { opacity: 0.35 },
  limit: { color: '#8a6224', fontSize: 12, marginTop: 10 },
});
