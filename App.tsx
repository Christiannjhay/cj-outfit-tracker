import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignInPage from './src/pages/SignInPage';
import HomePage from './src/pages/HomePage';
import AuthLoadingScreen from './src/pages/AuthLoadingScreen';
import { AuthProvider } from './src/contexts/AuthContext';
import LogoutScreen from './src/pages/LogoutScreen';
import SignUpPage from './src/pages/SignUpPage';
import UserCircle from './src/components/icons/UserCircle';
import ClosetIcon from './src/components/icons/ClosetIcon';
import PlusIcon from './src/components/icons/PlusIcon';
import HangerIcon from './src/components/icons/HangerIcon';
import NewOutfit from './src/pages/NewOutfit';
import ViewProfile from './src/pages/ViewProfile';
import HomeIcon from './src/components/icons/HomeIcon';
import Wardrobe from './src/pages/Wardrobe';
import AddClothes from './src/pages/AddClothes';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#081F5C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShown: true,
          drawerLabel: 'Home',
          drawerIcon: () => (
            <HomeIcon width={30} height={30} />
            
          ),
        }}
      />
      
      <Drawer.Screen
        name="New Outfit"
        component={NewOutfit}
        options={{
          headerShown: true,
          drawerLabel: 'Create Outfit',
          drawerIcon: () => (
            <HangerIcon width={30} height={30} />
            
          ),
        }}
      />

      <Drawer.Screen
        name="Add New Clothes"
        component={AddClothes}
        options={{
          headerShown: true,
          drawerLabel: 'Add New Clothes',
          drawerIcon: () => (
            <PlusIcon width={30} height={30} />
            
          ),
        }}
      />

        <Drawer.Screen
        name="My Wardrobe"
        component={Wardrobe}
        options={{
          headerShown: true,
          drawerLabel: 'My Wardrobe',
          drawerIcon: () => (
            <ClosetIcon width={30} height={30} />
            
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ViewProfile}
        options={{
          headerShown: true,
          drawerLabel: 'View Profile',
          drawerIcon: () => (
            <UserCircle width={30} height={30} />
            
          ),
        }}
      />

      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen
        name="AuthLoading"
        component={AuthLoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeDrawer"
        component={HomeDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpPage}
        options={{ headerShown: false }}
      />
     
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
