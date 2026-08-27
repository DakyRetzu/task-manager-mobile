import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { signIn, signUp } = useApp();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit =
    email.trim().length > 3 &&
    password.length >= 6 &&
    (mode === 'signin' || name.trim().length > 0);

  async function handleSubmit() {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password, name.trim());
      } else {
        await signIn(email.trim(), password);
      }
      // navigation happens automatically once App.js sees the session change
    } catch (e) {
      Alert.alert('Something went wrong', e.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.mark}>
        <View style={{ transform: [{ rotate: '-45deg' }] }}>
          <Text style={{ color: colors.platinum, fontSize: 16 }}>✓</Text>
        </View>
      </View>

      <Text style={styles.eyebrow}>PRIVATE ACCESS</Text>
      <Text style={styles.title}>
        Where the{'\n'}
        <Text style={{ fontStyle: 'italic', color: colors.platinum }}>week</Text> comes{'\n'}
        together.
      </Text>
      <Text style={styles.desc}>
        {mode === 'signin' ? 'Sign in to pick up where your team left off.' : 'Create an account to get started.'}
      </Text>

      {mode === 'signup' && (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>YOUR NAME</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Danijel"
            placeholderTextColor={colors.textFaint}
          />
        </View>
      )}

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@studio.com"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor={colors.textFaint}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, (!canSubmit || loading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.bg} />
        ) : (
          <Text style={styles.buttonText}>{mode === 'signin' ? 'Sign in' : 'Create account'}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
        <Text style={styles.ghostText}>
          {mode === 'signin' ? (
            <>No account yet? <Text style={{ color: colors.platinum }}>Create one</Text></>
          ) : (
            <>Already have an account? <Text style={{ color: colors.platinum }}>Sign in</Text></>
          )}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  mark: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: colors.platinumLine,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    transform: [{ rotate: '45deg' }],
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.platinum,
    letterSpacing: 2,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 40,
    color: colors.text,
    marginBottom: 14,
  },
  desc: {
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 30,
    maxWidth: 260,
  },
  field: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textFaint,
    letterSpacing: 1,
    marginBottom: 9,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    fontSize: 14.5,
    color: colors.text,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.platinum,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonText: {
    color: colors.bg,
    fontWeight: '600',
    fontSize: 13.5,
    letterSpacing: 0.5,
  },
  ghostText: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 12,
    color: colors.textFaint,
  },
});