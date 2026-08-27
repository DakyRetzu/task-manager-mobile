import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { setUserName } = useApp();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = name.trim().length > 0;

  function handleSignIn() {
    if (!canSubmit) return;
    setUserName(name.trim());
    navigation.replace('Projects');
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
      <Text style={styles.desc}>Sign in to pick up where your team left off.</Text>

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

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••••"
          placeholderTextColor={colors.textFaint}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.ghostText}>
        No account yet? <Text style={{ color: colors.platinum }}>Create one</Text>
      </Text>
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
    marginBottom: 36,
    maxWidth: 250,
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