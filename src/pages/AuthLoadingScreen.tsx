import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../contexts/AuthContext";
import { NavigationProp } from "../../types/navigation";

const AuthLoadingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUser, setIsAuthenticated } = useAuth();

  const checkAuthentication = async () => {
    try {
      // Retrieve the refresh token from AsyncStorage
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token found, navigate to SignIn
        navigation.navigate("SignIn");
        return;
      }

      // Make a request to refresh the token
      const response = await fetch("http://10.0.2.2:8000/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the new tokens in AsyncStorage
        await AsyncStorage.setItem('accessToken', data.access);
        await AsyncStorage.setItem('refreshToken', data.refresh);

        // Update context with user information
        setUser({ id: null, username: data.username, email: null });

        // Set authentication status
        setIsAuthenticated(true);

        // Navigate to HomeDrawer
        navigation.navigate("HomeDrawer");
      } else {
        // Refresh token invalid or other error, navigate to SignIn
        navigation.navigate("SignIn");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      navigation.navigate("SignIn");
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#081F5C" />
      <Text>Loading...</Text>
    </View>
  );
};

export default AuthLoadingScreen;
