// src/screens/LogoutScreen.tsx

import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";

type LogoutScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

export default function LogoutScreen() {

  const LogoutSuccessToast = () => {
    ToastAndroid.show('Logged Out', ToastAndroid.SHORT);
  };
  
  const navigation = useNavigation<LogoutScreenNavigationProp>();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        const response = await fetch("http://10.0.2.2:8000/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
          throw new Error("Logout failed");
        }

        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");

        LogoutSuccessToast();

        navigation.navigate("SignIn");
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to log out");
        navigation.navigate("HomeDrawer");
      }
    };

    handleLogout();
  }, [navigation]);

  return (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
