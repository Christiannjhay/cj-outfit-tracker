import { Pressable, Text, TextInput, View, Alert, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState } from "react";
import SignInHeader from "../components/SignInPage/SignInHeader";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const LoginSuccessToast = () => {
    ToastAndroid.show('Logged In', ToastAndroid.SHORT);
  };
  
  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
    
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
          
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      if (data.access && data.refresh) {

        setUsername("");
        setPassword("");
        
        await AsyncStorage.setItem("accessToken", data.access);
        await AsyncStorage.setItem("refreshToken", data.refresh);

        LoginSuccessToast();
        navigation.navigate("HomeDrawer");
      } else {
        throw new Error(
          "Access token or refresh token is missing from response"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to log in");
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
      <View className="flex-1 flex-row gap-2">
        <Text className="text-black text-sm font-light mb-4 mt-2">
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={handleSignUpPress}>
          <Text className="text-[#081F5C] text-sm font-light mb-4 mt-2"
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
