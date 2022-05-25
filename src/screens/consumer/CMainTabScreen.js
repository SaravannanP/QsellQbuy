import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import HomeScreen from "./HomeScreen";
import ProfilePageScreen from "./ProfilePageScreen";
import EditProfileScreen from "./EditProfileScreen";
import ChangePasswordScreen from "./ChangePasswordScreen";
import ProductDetailsScreen from "./ProductDetailsScreen";
import WatchListScreen from "./WatchListScreen";
import WatchListDetailsScreen from "./WatchListDetailsScreen";
import GroupBuyListScreen from "./GroupBuyListScreen";
import GroupBuyDetailsScreen from "./GroupBuyDetailsScreen";
import TransactionHistoryScreen from "./TransactionHistoryScreen";
import CardListScreen from "./CardListScreen";
import TopUpPageScreen from "./TopUpPageScreen";
import NotificationsScreen from "./NotificationScreen";
import RatingReviewScreen from "./RatingReviewScreen";
import MerchantProfileView from "../../components/MerchantProfileView";
import ChatScreenTwo from "../../components/ChatScreenTwo";
// BOTTOMTAB
const Tab = createMaterialBottomTabNavigator();

// CONSUMER HOME STACK
const ConsumerHomeStack = createStackNavigator();

// CONSUMER PROFILE STACK
const ConsumerProfileStack = createStackNavigator();

// CONSUMER GROUP BUY
const ConsumerGroupBuyStack = createStackNavigator();

// CONSUMER TRANSACTION HISTORY 
const ConsumerTransactionHistoryStack = createStackNavigator();

// CONSUMER NOTIFICATION STACK 
const ConsumerNotificationStack = createStackNavigator();

const CMainTabScreen = ({ navigation }) => {
  return (
    <Tab.Navigator initialRouteName="ConsumerHome" activeColor="#fff">
      <Tab.Screen
        name="ConsumerHome"
        component={ConsumerHome}
        options={{
          tabBarLabel: "Home",
          tabBarColor: "#0d56d9",
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ConsumerNotification"
        component={ConsumerNotification}
        options={{
          tabBarLabel: "Notifications",
          tabBarColor: "#0d56d9",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ConsumerProfile"
        component={ConsumerProfile}
        options={{
          tabBarLabel: "Profile",
          tabBarColor: "#0d56d9",
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ConsumerGroupBuy"
        component={ConsumerGroupBuy}
        options={{
          tabBarLabel: "GroupBuy",
          tabBarColor: "#0d56d9",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ConsumerTransactionHistory"
        component={ConsumerTransactionHistory}
        options={{
          tabBarLabel: "History",
          tabBarColor: "#0d56d9",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ConsumerHome = ({ navigation }) => {
  return (
    <ConsumerHomeStack.Navigator
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
      <ConsumerHomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Home",
        }}
      />
      <ConsumerHomeStack.Screen
        name="CardListScreen"
        component={CardListScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "",
        }}
      />
      <ConsumerHomeStack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Product Details          ",
        }}
      />
       <ConsumerHomeStack.Screen
        name="MerchantProfileView"
        component={MerchantProfileView}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Merchant  Profile       ",
        }}
      />
      <ConsumerHomeStack.Screen
        name="WatchListScreen"
        component={WatchListScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Watch List          ",
        }}
      />
      <ConsumerHomeStack.Screen
        name="WatchListDetailsScreen"
        component={WatchListDetailsScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Watch List Details",
        }}
      />

      <ConsumerHomeStack.Screen
      name="GroupBuyListScreen"
      component={GroupBuyListScreen}
      options={{
        headerTitleStyle: { alignSelf: "center" },
        title: "GroupBuy List",
      }}
      />

      <ConsumerHomeStack.Screen
      name="ChatScreenTwo"
      component={ChatScreenTwo}
      options={{
        headerTitleStyle: { alignSelf: "center" },
        title: "Q & A",
      }}
      />

    </ConsumerHomeStack.Navigator>
  );
};

const ConsumerProfile = ({ navigation }) => {
  return (
    <ConsumerProfileStack.Navigator
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
      <ConsumerProfileStack.Screen
        name="ProfilePageScreen"
        component={ProfilePageScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "       Profile",
        }}
      />
      <ConsumerProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Edit  Profile           ",
        }}
      />
      <ConsumerProfileStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Change  Password",
        }}
      />
      <ConsumerProfileStack.Screen
        name="TopUpPageScreen"
        component={TopUpPageScreen}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Top-Up           ",
        }}
      />
    </ConsumerProfileStack.Navigator>
  );
};

const ConsumerGroupBuy = ({navigation}) => {
  return (
    <ConsumerGroupBuyStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#0d56d9",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}>
      
    <ConsumerGroupBuyStack.Screen
      name="GroupBuyListScreen"
      component={GroupBuyListScreen}
      options={{
        headerTitleStyle: { alignSelf: "center" },
        title: "GroupBuy List",
      }}
      />

    <ConsumerGroupBuyStack.Screen
      name="GroupBuyDetailsScreen"
      component={GroupBuyDetailsScreen}
      options={{
        headerTitleStyle: { alignSelf: "center" },
        title: "GroupBuy  Details          ",
      }}
      />

    </ConsumerGroupBuyStack.Navigator>
  )
}

const ConsumerTransactionHistory = ({navigation}) => {
  return(
    <ConsumerTransactionHistoryStack.Navigator
      screenOptions={{
      headerStyle: {
        backgroundColor: "#0d56d9",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}>

    <ConsumerTransactionHistoryStack.Screen 
      name="TransactionHistoryScreen"
      component={TransactionHistoryScreen}
      options={{
        headerTitleStyle: { alignSelf: "center" },
        title: "Transaction  History",
      }}
      
      />
      
      <ConsumerTransactionHistoryStack.Screen 
      name="RatingReviewScreen"
      component={RatingReviewScreen}
      options={{
        headerTitleStyle: { alignSelf: "center" },
        title: "Rating And Review",
      }}
      
      />
       
    </ConsumerTransactionHistoryStack.Navigator>

  )
}

const ConsumerNotification = ({navigation}) => {
  return(
    <ConsumerNotificationStack.Navigator
      screenOptions={{
      headerStyle: {
        backgroundColor: "#0d56d9",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}>

    <ConsumerNotificationStack.Screen 
      name="NotificationsScreen"
      component={NotificationsScreen}
      options={{
        headerTitleStyle: { alignSelf: "center" },
        title: "Notification",
      }}
      
      /> 
    </ConsumerNotificationStack.Navigator>
  )
}


export default CMainTabScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
