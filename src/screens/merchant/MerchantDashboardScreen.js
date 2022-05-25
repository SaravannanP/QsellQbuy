import React, { Component, useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
//import ButtonWithBackground from "../components/ButtonWithBackground";
//import Images from "../const/Images";
//import GroupItem from "../components/GroupsItems";
import firebase, { firestore } from "../../firebase/Firebase";
import Octicons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProductsCreatedScreen from "./ProductsCreatedScreen";
import CompletedProductsScreen from "./CompletedProductsScreen";

// TOPTAB
const Tab = createMaterialTopTabNavigator();

function MerchantDashboardScreen({ navigation }) {
  // Top Bar
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 7 }}>
          <MaterialIcons.Button
            name="add-circle-outline"
            size={30}
            backgroundColor="#0d56d9"
            onPress={() => {
              navigation.navigate("CreateProductScreen");
            }}
          />
        </View>
      ),
      headerLeft: () => (
        <View style={{ marginLeft: 10 }}>
          <SimpleLineIcons.Button
            name="logout"
            size={23}
            backgroundColor="#0d56d9"
            onPress={() => {
              signOutUser();
            }}
          />
        </View>
      ),
    });
  });

  const signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (e) {
      console.log(e);
    }
  };

  return <TopTabScreen />;
}

const TopTabScreen = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="ProductsCreatedScreen"
      tabBarOptions={{
        activeTintColor: "#fff",
        labelStyle: { fontSize: 14 },
        style: { backgroundColor: "#0d56d9" },
      }}
    >
      <Tab.Screen
        name="ProductsCreatedScreen"
        component={ProductsCreatedScreen}
        options={{
          tabBarLabel: "Products Created",
        }}
      />
      <Tab.Screen
        name="CompletedProductsScreen"
        component={CompletedProductsScreen}
        options={{
          tabBarLabel: "Completed Products",
        }}
      />
    </Tab.Navigator>
  );
};

export default MerchantDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24, //padding from the top
  },
  cardsWrapper: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
});
