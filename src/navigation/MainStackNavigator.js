import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// MAIN STACK
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import LoadingScreen from "../screens/LoadingScreen";
import MMainTabScreen from "../screens/merchant/MMainTabScreen";
import CMainTabScreen from "../screens/consumer/CMainTabScreen";
import SplashScreen from "../screens/SplashScreen";
//import ProductsCreated from "../screens/ProductsCreated";
//import ProductsCompleted from "../screens/ProductsCompleted";
//import HomeScreen from "../screens/HomeScreen";
//import ProductDetailsScreen from "../screens/ProductDetailsScreen";
//import CreateProductScreen from "../screens/CreateProductScreen";
//import ChatScreen from "../screens/ChatScreen";
//import ProfilePageScreen from "../screens/ProfilePageScreen";
//import EditProfileScreen from "../screens/EditProfileScreen";

// MAIN STACK
const Stack = createStackNavigator();

function MainStackFlow() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0d56d9",
            shadowColor: "#fff",
            elevation: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{
            headerTitleStyle: { alignSelf: "center" },
            title: "",
          }}
        />
        <Stack.Screen
          name="MMainTabScreen"
          component={MMainTabScreen}
          options={{
            // headerTitleStyle: { alignSelf: "center" },
            // title: "",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CMainTabScreen"
          component={CMainTabScreen}
          options={{
            // headerTitleStyle: { alignSelf: "center" },
            // title: "",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

class MainStackNavigator extends Component {
  render() {
    return MainStackFlow();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MainStackNavigator;
