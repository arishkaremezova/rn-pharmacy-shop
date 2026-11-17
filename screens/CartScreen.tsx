import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectCartCount, useCartLines, useCartStore } from '../stores/cartStore';
import DrugCartItem from '../components/DrugCartItem';
import CartSummary from '../components/CartSummary';
import EmptyState from '../components/EmptyState';

export default function CartScreen() {
  const lines = useCartLines();
  const count = useCartStore(selectCartCount);
  const clear = useCartStore((state) => state.clear);
  const insets = useSafeAreaInsets();
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (lines.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState title="Корзина пуста" subtitle="Добавьте лекарства из каталога" />
        <Pressable style={styles.catalog} onPress={() => router.replace('/')} accessibilityRole="button">
          <Text style={styles.catalogText}>Перейти в каталог</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lines}
        keyExtractor={(line) => line.drug.id}
        renderItem={({ item }) => <DrugCartItem line={item} />}
        contentContainerStyle={styles.list}
      />
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.footerContent}>
          <CartSummary />
          <Pressable style={styles.button} onPress={() => setShowConfirmation(true)} accessibilityRole="button">
            <Text style={styles.buttonText}>Оформить заявку</Text>
          </Pressable>
          <Pressable style={styles.clear} onPress={clear} accessibilityRole="button">
            <Text style={styles.clearText}>Очистить корзину</Text>
          </Pressable>
        </View>
      </View>
      <Modal visible={showConfirmation} transparent animationType="fade" onRequestClose={() => setShowConfirmation(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Учебная заявка</Text>
            <Text style={styles.modalText}>Вы выбрали {count} шт. препаратов. Это демонстрация: данные никуда не отправляются.</Text>
            {lines.some((line) => line.drug.prescription_required) && (
              <Text style={styles.modalText}>В корзине есть препараты, для отпуска которых требуется рецепт.</Text>
            )}
            <Pressable style={styles.button} onPress={() => { setShowConfirmation(false); clear(); router.replace('/'); }} accessibilityRole="button">
              <Text style={styles.buttonText}>Готово</Text>
            </Pressable>
            <Pressable style={styles.clear} onPress={() => setShowConfirmation(false)} accessibilityRole="button">
              <Text style={styles.clearText}>Вернуться в корзину</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f7f4' },
  list: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 16 },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e1ebe5' },
  footerContent: { width: '100%', maxWidth: 680, alignSelf: 'center' },
  button: { backgroundColor: '#16765d', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  clear: { padding: 12, alignItems: 'center', marginTop: 4 },
  clearText: { color: '#71867a', fontSize: 14 },
  catalog: { alignSelf: 'center', padding: 20, marginBottom: 40 },
  catalogText: { color: '#16765d', fontSize: 16, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(17, 48, 35, 0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 22, padding: 24 },
  modalTitle: { fontSize: 22, color: '#183d30', fontWeight: '700', marginBottom: 12 },
  modalText: { fontSize: 15, lineHeight: 22, color: '#476254', marginBottom: 18 },
});
