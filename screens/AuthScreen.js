// // // screens/AuthScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SHADOWS, SPACING } from '../utils/theme';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Switch between register and login
  const [error, setError] = useState(null); // State to handle errors
  const navigation = useNavigation();
  const { login, logout } = useAuth();

  useEffect(() => {
    // Clear inputs and errors on logout
    if (!auth.currentUser) {
      setEmail('');
      setPassword('');
      setName('');
      setError(null); // Clear error on logout
    }
  }, [auth.currentUser]);

  const saveUserData = async (user) => {
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Only set data if the document doesn't exist (new registration)
        await setDoc(userDocRef, {
          name: name, // Save the name provided during registration
          email: user.email,
        });
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleAuth = async () => {
    try {
      setError(null); // Clear previous errors before attempting auth
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save user data after successful registration
        await saveUserData(userCredential.user);
        login(email, password); // Update context with login info
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        login(email, password); // Update context with login info
      }

      // Navigate to the unique AppDrawer route
      navigation.navigate('AppDrawer');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'Email already in use.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      default:
        return 'An unknown error occurred.';
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Tola</Text>
          <Text style={styles.subtitle}>{isRegistering ? 'Create your account' : 'Welcome back!'}</Text>
        </View>

        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {isRegistering && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>{isRegistering ? 'Get Started' : 'Sign In'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={() => setIsRegistering(!isRegistering)}>
            <Text style={styles.switchText}>
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.l,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 48,
    fontFamily: FONTS.bubbles,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: SPACING.l,
    ...SHADOWS.medium,
  },
  errorBanner: {
    backgroundColor: '#FFE4E1',
    padding: SPACING.s,
    borderRadius: 10,
    marginBottom: SPACING.m,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    padding: 15,
    borderColor: COLORS.background,
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  authButton: {
    width: '100%',
    padding: 18,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginTop: SPACING.m,
    ...SHADOWS.light,
  },
  authButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bubbles,
  },
  switchButton: {
    marginTop: SPACING.l,
    alignItems: 'center',
  },
  switchText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
});

export default AuthScreen;
