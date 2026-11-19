import { useState } from 'react';
import {
  KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useAuth } from '../auth/AuthContext';

function ScreenCaptureProtection() {
  usePreventScreenCapture('pharmacy-login');
  return null;
}

type DeviceLogin = { deviceCode: string; userCode: string; expiresAt: number };

export default function AuthScreen() {
  const { signIn } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [hidden, setHidden] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [device, setDevice] = useState<DeviceLogin | null>(null);

  async function enter() {
    if (busy) return;
    if (login.trim() !== 'admin' || password !== 'password') {
      setError('Неверный логин или пароль.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await signIn('demo-admin');
    } catch {
      setError('Не удалось сохранить вход. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  }

  async function github() {
    if (busy) return;
    if (device && Date.now() >= device.expiresAt) {
      setDevice(null);
      setError('Код истёк. Начните вход ещё раз.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/github', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device ? { action: 'check', deviceCode: device.deviceCode } : { action: 'start' }),
      });
      const data = await response.json();
      if (response.ok && !device && data.deviceCode && data.userCode) {
        setPassword('');
        setHidden(true);
        setDevice({ deviceCode: data.deviceCode, userCode: data.userCode, expiresAt: Date.now() + data.expiresIn * 1000 });
      } else if (response.ok && device && Number.isSafeInteger(data.userId)) {
        await signIn('github:' + data.userId);
      } else if (data.error === 'authorization_pending' || data.error === 'slow_down') {
        setError('Подтвердите вход на GitHub и повторите проверку через несколько секунд.');
      } else {
        setDevice(null);
        const messages: Record<string, string> = {
          access_denied: 'Вы отменили вход на GitHub.',
          expired_token: 'Код истёк. Начните вход ещё раз.',
        };
        setError(messages[data.error] ?? 'Не удалось войти через GitHub. Попробуйте ещё раз.');
      }
    } catch {
      setError('Не удалось завершить вход. Проверьте подключение и попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {Platform.OS !== 'web' && <ScreenCaptureProtection />}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Ionicons name="medical-outline" size={44} color="#16765d" />
          <Text style={styles.title}>Моя аптека</Text>
          {device ? (
            <>
              <Text style={styles.hint}>Введите этот код на GitHub и вернитесь в аптеку.</Text>
              <Text selectable style={styles.code}>{device.userCode}</Text>
              <Pressable accessibilityRole="link" onPress={() => Linking.openURL('https://github.com/login/device').catch(() => setError('Откройте github.com/login/device в браузере.'))}>
                <Text style={styles.link}>Открыть GitHub</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.hint}>Войдите, чтобы открыть каталог</Text>
              <TextInput style={styles.field} placeholder="Логин" accessibilityLabel="Логин"
                value={login} onChangeText={setLogin} autoCapitalize="none" autoCorrect={false} autoComplete="username" />
              <View style={[styles.field, styles.passwordRow]}>
                <TextInput style={styles.password} placeholder="Пароль" accessibilityLabel="Пароль"
                  value={password} onChangeText={setPassword} secureTextEntry={hidden} autoComplete="current-password"
                  autoCapitalize="none" autoCorrect={false} returnKeyType="go" onSubmitEditing={enter} />
                {Platform.OS !== 'web' && <Pressable accessibilityRole="button" accessibilityLabel={hidden ? 'Показать пароль' : 'Скрыть пароль'}
                  onPress={() => setHidden(!hidden)} hitSlop={8}>
                  <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} color="#416c5a" size={23} />
                </Pressable>}
              </View>
              <Pressable accessibilityRole="button" disabled={busy} style={styles.button} onPress={enter}>
                <Text style={styles.buttonText}>Войти</Text>
              </Pressable>
            </>
          )}
          <Pressable accessibilityRole="button" disabled={busy} style={[styles.button, styles.githubButton]} onPress={github}>
            <Text style={styles.buttonText}>{device ? 'Проверить подтверждение' : 'Войти через GitHub'}</Text>
          </Pressable>
          {device && <Pressable accessibilityRole="button" disabled={busy} onPress={() => { setDevice(null); setError(''); }}>
            <Text style={styles.link}>Отмена</Text>
          </Pressable>}
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f2f7f4' },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  form: { width: '100%', maxWidth: 360, gap: 12 },
  title: { fontSize: 34, fontWeight: '700', color: '#183d30' },
  hint: { color: '#416c5a', fontSize: 16, marginBottom: 8 },
  field: { minHeight: 48, borderWidth: 1, borderColor: '#a9c5b5', borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 14, color: '#183d30', fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  password: { flex: 1, minHeight: 46, color: '#183d30', fontSize: 16 },
  button: { borderRadius: 12, backgroundColor: '#16765d', padding: 14, alignItems: 'center' },
  githubButton: { backgroundColor: '#24292f' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: '#14684f', paddingVertical: 8, textDecorationLine: 'underline' },
  code: { color: '#183d30', fontSize: 28, fontWeight: '700', letterSpacing: 3 },
  error: { color: '#9d3532', fontSize: 14 },
});
