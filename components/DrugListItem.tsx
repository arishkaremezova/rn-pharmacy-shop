import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Drug } from '../types/drug';
import { useCartStore } from '../stores/cartStore';

interface Props {
  drug: Drug;
  onPress: () => void;
}

export default function DrugListItem({ drug, onPress }: Props) {
  const add = useCartStore((state) => state.add);
  const quantity = useCartStore((state) => state.lines[drug.id]?.quantity ?? 0);
  const available = quantity < drug.stock;

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button" accessibilityLabel={`О препарате ${drug.name}`}>
      <View style={styles.icon}>
        <Ionicons name="medical-outline" size={28} color="#16765d" />
      </View>
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={2}>{drug.category}</Text>
        <Text style={styles.name}>{drug.name}</Text>
        <Text style={styles.details}>{drug.form} · {drug.dosage}</Text>
        <Text style={styles.manufacturer}>{drug.manufacturer}</Text>
        <View style={styles.meta}>
          <Text style={[styles.badge, drug.prescription_required && styles.prescription]}>
            {drug.prescription_required ? 'По рецепту' : 'Без рецепта'}
          </Text>
          <Text style={styles.stock}>В наличии: {drug.stock}</Text>
        </View>
      </View>
      <Pressable
        style={[styles.add, !available && styles.disabled]}
        disabled={!available}
        accessibilityRole="button"
        accessibilityLabel={`Добавить ${drug.name} в корзину`}
        onPress={(event) => {
          event.stopPropagation();
          add(drug);
        }}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#e1ebe5' },
  icon: { width: 48, height: 56, borderRadius: 14, backgroundColor: '#e9f5ef', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  category: { fontSize: 11, color: '#71867a', marginBottom: 5 },
  name: { fontSize: 17, fontWeight: '700', color: '#183d30', marginBottom: 4 },
  details: { fontSize: 13, color: '#476254', marginBottom: 4 },
  manufacturer: { fontSize: 12, color: '#71867a' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 10 },
  badge: { fontSize: 10, fontWeight: '600', color: '#27664f', backgroundColor: '#eaf5ed', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6 },
  prescription: { color: '#8a6224', backgroundColor: '#fff3dc' },
  stock: { fontSize: 10, color: '#71867a' },
  add: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#16765d' },
  disabled: { opacity: 0.35 },
});
