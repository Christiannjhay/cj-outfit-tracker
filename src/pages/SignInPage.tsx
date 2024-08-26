import { Pressable, Text, TextInput, View, Alert } from 'react-native';
import React, { useState } from 'react';
import SignInHeader from '../components/SignInPage/SignInHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const getCSRFToken = async () => {
    try {
      const response = await fetch('http://192.168.1.41:8000/csrf-token/', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
  
      const data = await response.json();
      return data.csrfToken; // Adjust based on how your server sends the CSRF token
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    }
  };

  const handleSignIn = async () => {
    try {
      const csrfToken = await getCSRFToken(); 
  
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }
  
      const response = await fetch('http://192.168.1.41:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      console.log('Login successful:', data);
  
      await AsyncStorage.setItem('authToken', data.token);
  
      Alert.alert('Success', 'Logged in successfully');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to log in');
    }
  };

  return (
    <View className="flex-1 items-center bg-white px-4">
      <SignInHeader />
      <TextInput
        className="m-2 w-11/12 rounded-3xl border-2 border-[#081F5C] p-2 px-6 mt-24"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="m-2 w-11/12 rounded-3xl border-2 border-[#081F5C] p-2 px-6 mt-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable 
        className="mt-4 w-11/12 rounded-3xl bg-[#081F5C] p-4"
        onPress={handleSignIn}
      >
        <Text className="text-white text-center font-bold">Sign In</Text>
      </Pressable>
      <Text className="text-black text-sm font-light mb-4 mt-2">
        Don't have an account?
        <Pressable>
          <Text className="text-sm mt-2 ml-2 text-[#081F5C]">
            Sign up
          </Text>
        </Pressable>
      </Text>
    </View>
  );
}
