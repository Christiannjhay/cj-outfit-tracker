import { View, Text } from "react-native";
import "../../global.css";
import { useAuth } from "../contexts/AuthContext";
import UserCircle from "../components/icons/UserCircle";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <View>
      <View className="flex flex-row items-center">
        <UserCircle width={30} height={30} />
        <Text className="font-medium text-[17px] mt-1"> {user?.username}</Text>
      </View>
    </View>
  );
}
