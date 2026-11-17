import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';

export default function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Pressable onPress={signOut} style={styles.wrap} accessibilityRole="button" accessibilityLabel="Выйти из каталога">
      <Ionicons name="log-out-outline" size={22} color="#71867a" />
    </Pressable>
  );
}

const styles = StyleSheet.create({ wrap: { padding: 10 } });
