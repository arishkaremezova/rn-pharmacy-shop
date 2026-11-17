import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchDrugById } from '../api/mockDrugsAPI';
import { Drug } from '../types/drug';
import DrugDetailsCard from '../components/DrugDetailsCard';
import EmptyState from '../components/EmptyState';
import { useCartStore } from '../stores/cartStore';

export default function DrugDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const add = useCartStore((state) => state.add);
  const quantity = useCartStore((state) => state.lines[id]?.quantity ?? 0);
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    fetchDrugById(id)
      .then((data) => {
        if (active) setDrug(data ?? null);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#16765d" /></View>;
  }

  if (error) return <EmptyState title="Не удалось загрузить препарат" />;
  if (!drug) return <EmptyState title="Препарат не найден" />;

  const available = quantity < drug.stock;

  return (
    <View style={styles.container}>
      <DrugDetailsCard drug={drug} />
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={[styles.button, !available && styles.disabled]}
          disabled={!available}
          accessibilityRole="button"
          onPress={() => {
            add(drug);
            router.push('/cart');
          }}
        >
          <Text style={styles.buttonText}>{available ? 'Добавить в корзину' : 'Нет доступного остатка'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f7f4' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e1ebe5' },
  button: { width: '100%', maxWidth: 680, alignSelf: 'center', backgroundColor: '#16765d', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.4 },
});
