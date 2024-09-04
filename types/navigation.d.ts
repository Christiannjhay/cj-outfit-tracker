// src/types/navigation.ts

import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  HomeDrawer: undefined;
  Logout: undefined;
  SignUp: undefined;
  ViewProfile: undefined;
  Outfit: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;
