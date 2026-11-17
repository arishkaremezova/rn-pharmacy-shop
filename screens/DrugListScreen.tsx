import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { fetchDrugs } from '../api/mockDrugsAPI';
import { Drug } from '../types/drug';
import DrugListItem from '../components/DrugListItem';
import EmptyState from '../components/EmptyState';

export default function DrugListScreen() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchDrugs()
      .then((data) => {
        if (active) setDrugs(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16765d" />
        <Text style={styles.hint}>Загружаем лекарства…</Text>
      </View>
    );
  }

  if (error) return <EmptyState title="Не удалось загрузить лекарства" />;

  return (
    <FlatList
      style={styles.container}
      data={drugs}
      keyExtractor={(drug) => drug.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.heading}>
          <Text style={styles.title}>Каталог лекарств</Text>
          <Text style={styles.subtitle}>Препаратов в каталоге: {drugs.length}</Text>
        </View>
      }
      ListEmptyComponent={<EmptyState title="Каталог пуст" />}
      renderItem={({ item }) => (
        <DrugListItem
          drug={item}
          onPress={() => router.push({ pathname: '/drugs/[id]', params: { id: item.id } })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f7f4' },
  list: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 16 },
  heading: { paddingVertical: 12, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '700', color: '#183d30' },
  subtitle: { fontSize: 14, color: '#71867a', marginTop: 6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { marginTop: 12, color: '#71867a' },
});
