import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Drug } from '../types/drug';

export default function DrugDetailsCard({ drug }: { drug: Drug }) {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <View style={styles.hero}>
        <Ionicons name="medical-outline" size={56} color="#16765d" />
        <Text style={styles.form}>{drug.form} · {drug.dosage}</Text>
      </View>
      <Text style={styles.category}>{drug.category}</Text>
      <Text style={styles.name}>{drug.name}</Text>
      <Text style={styles.latin}>{drug.latin_name}</Text>
      <Text style={[styles.badge, drug.prescription_required && styles.prescription]}>
        {drug.prescription_required ? 'Отпускается по рецепту' : 'Отпускается без рецепта'}
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>Действующее вещество</Text>
        <Text style={styles.value}>{drug.active_substance}</Text>
        <Text style={styles.label}>Форма выпуска</Text>
        <Text style={styles.value}>{drug.form}</Text>
        <Text style={styles.label}>Дозировка</Text>
        <Text style={styles.value}>{drug.dosage}</Text>
        <Text style={styles.label}>Производитель</Text>
        <Text style={styles.value}>{drug.manufacturer}</Text>
        <Text style={styles.label}>Остаток</Text>
        <Text style={styles.value}>{drug.stock} шт.</Text>
      </View>
      <Text style={styles.heading}>Описание</Text>
      <Text style={styles.description}>{drug.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 20, paddingBottom: 32 },
  hero: { height: 160, backgroundColor: '#e1f1e8', borderRadius: 22, alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 },
  form: { color: '#386b54', fontSize: 14 },
  category: { fontSize: 12, color: '#71867a', marginBottom: 8 },
  name: { fontSize: 28, fontWeight: '700', color: '#183d30' },
  latin: { fontSize: 15, color: '#71867a', marginTop: 5 },
  badge: { alignSelf: 'flex-start', fontSize: 12, color: '#27664f', backgroundColor: '#e1f1e8', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, marginVertical: 18 },
  prescription: { color: '#8a6224', backgroundColor: '#fff3dc' },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 18, marginBottom: 24 },
  label: { fontSize: 12, color: '#71867a', marginBottom: 4 },
  value: { fontSize: 15, color: '#183d30', marginBottom: 14 },
  heading: { fontSize: 18, fontWeight: '700', color: '#183d30', marginBottom: 10 },
  description: { fontSize: 15, lineHeight: 23, color: '#476254' },
});
