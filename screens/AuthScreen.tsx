import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';

export default function AuthScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const openCatalog = async () => {
    setLoading(true);
    setError(false);
    try {
      await signIn('guest');
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.icon}><Ionicons name="medical-outline" size={56} color="#16765d" /></View>
        <Text style={styles.title}>Моя аптека</Text>
        <Text style={styles.subtitle}>Каталог лекарств</Text>
        <Text style={styles.description}>Состав, дозировки и наличие препаратов в одном месте.</Text>
        <Pressable style={styles.button} onPress={openCatalog} disabled={loading} accessibilityRole="button">
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Открыть каталог</Text>}
        </Pressable>
        {error && <Text style={styles.error}>Не удалось открыть каталог. Попробуйте ещё раз.</Text>}
        <Text style={styles.note}>Учебное приложение на локальных данных</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f7f4', alignItems: 'center', justifyContent: 'center', padding: 28 },
  content: { width: '100%', maxWidth: 360, alignItems: 'center' },
  icon: { width: 112, height: 112, borderRadius: 32, backgroundColor: '#e1f1e8', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  title: { fontSize: 34, fontWeight: '700', color: '#183d30', textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#16765d', marginTop: 8 },
  description: { fontSize: 15, lineHeight: 23, color: '#71867a', textAlign: 'center', marginTop: 18, marginBottom: 32 },
  button: { width: '100%', backgroundColor: '#16765d', padding: 17, borderRadius: 14, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  note: { fontSize: 12, color: '#71867a', marginTop: 22, textAlign: 'center' },
  error: { fontSize: 13, color: '#ad4c42', marginTop: 16, textAlign: 'center' },
});
