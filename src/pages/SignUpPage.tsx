import { Pressable, Text, TextInput, View, Alert, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../types/navigation";
import SignUpHeader from "../components/SignUpPage/SignUpHeader";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const SuccessToast = () => {
    ToastAndroid.show('Successfully registered', ToastAndroid.SHORT);
  };
  
  const handleSignUpPress = () => {
    navigation.navigate("SignIn");
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify({
          username: username,
          password: password,
          email: "no email"
        }),
      });

      if (!response.ok) {
        throw new Error("SignUp failed");
      }else{
        
        setUsername("");
        setPassword("");

        SuccessToast();
        navigation.navigate("SignIn");
      }

    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to register");
    }
  };

  return (
    <View className="flex-1 items-center bg-white px-4">
      <SignUpHeader/>
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
        onPress={handleSignUp}
      >
        <Text className="text-white text-center font-bold">Sign Up</Text>
      </Pressable>
      <View className="flex-1 flex-row gap-2">
        <Text className="text-black text-sm font-light mb-4 mt-2">
        Already have an account?
        </Text>
        <TouchableOpacity onPress={handleSignUpPress}>
          <Text className="text-[#081F5C] text-sm font-light mb-4 mt-2"
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
