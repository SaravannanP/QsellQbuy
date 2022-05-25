import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import MerchantDashboardScreen from "./MerchantDashboardScreen";
import MerchantProductDetailsScreen from "./MerchantProductDetailsScreen"
import CreateProductScreen from "./CreateProductScreen";
import ProfilePageScreen from "./ProfilePageScreen";
import EditProfileScreen from "./EditProfileScreen";
import ChangePasswordScreen from "./ChangePasswordScreen";
import CompletedGroupsScreen from "./CompletedGroupsScreen"
import ChatScreen from "../../components/ChatScreen"
// BOTTOMTAB
const Tab = createMaterialBottomTabNavigator();

// MERCHANT DASHBOARD STACK
const MerchantDashboardStack = createStackNavigator();

// MERCHANT PROFILE STACK
const MerchantProfileStack = createStackNavigator();

const MMainTabScreen = ({ navigation }) => {
  return (
    <Tab.Navigator initialRouteName="MerchantDashboard" activeColor="#fff">
      <Tab.Screen
        name="MerchantDashboard"
        component={MerchantDashboard}
        options={{
          tabBarLabel: "Home",
          tabBarColor: "#0d56d9",
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="MerchantProfile"
        component={MerchantProfile}
        options={{
          tabBarLabel: "Profile",
          tabBarColor: "#0d56d9",
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MerchantDashboard = ({ navigation }) => {
  return (
    <MerchantDashboardStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0d56d9",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <MerchantDashboardStack.Screen
        name="MerchantDashboardScreen"
        component={MerchantDashboardScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Merchant Dashboard",
        }}
      />
      <MerchantDashboardStack.Screen
        name="CreateProductScreen"
        component={CreateProductScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Create Product          ",
        }}
      />
      <MerchantDashboardStack.Screen
        name="MerchantProductDetailsScreen"
        component={MerchantProductDetailsScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Product Details          ",
        }}
      />
      <MerchantDashboardStack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{
                headerTitleStyle: { alignSelf: "center" },
                title: "Q&A            ",
              }}
            />
       <MerchantDashboardStack.Screen
        name="CompletedGroupsScreen"
        component={CompletedGroupsScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Completed Groups          ",
        }}
      />
    </MerchantDashboardStack.Navigator>
  );
};

const MerchantProfile = ({ navigation }) => {
  return (
    <MerchantProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0d56d9",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <MerchantProfileStack.Screen
        name="ProfilePageScreen"
        component={ProfilePageScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "        Profile",
        }}
      />
      <MerchantProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Edit  Profile             ",
        }}
      />
      <MerchantProfileStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Change Password",
        }}
      />
    </MerchantProfileStack.Navigator>
  );
};

export default MMainTabScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
