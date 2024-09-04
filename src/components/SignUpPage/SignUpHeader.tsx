import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../../global.css";
import React from "react";

export default function SignUpHeader() {
  return (
    <View className="flex items-center">
      <Text className="text-black text-[2.5rem] font-bold mt-48">Sign Up</Text>
      <Text className="text-black font-light mb-4">
        Enter your details to proceed further
      </Text>
    </View>
  );
}
