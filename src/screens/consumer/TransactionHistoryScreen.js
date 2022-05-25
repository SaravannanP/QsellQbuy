
import React, { useEffect, useState,useRef} from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import firebase, { firestore } from "../../firebase/Firebase";
import Card from "../../components/Card"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CompletedGroupsScreen from "./CompletedGroupsScreen";
import DismissedGroupsScreen from "./DismissedGroupsScreen";

// TOPTAB
const Tab = createMaterialTopTabNavigator();

function TransactionHistoryScreen({ navigation }) {

return <TopTabScreen/>

}


const TopTabScreen = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="CompletedGroupsScreen"
      tabBarOptions={{
        activeTintColor: "#fff",
        labelStyle: { fontSize: 14 },
        style: { backgroundColor: "#0d56d9" },
      }}
    >
      <Tab.Screen
        name="CompletedGroupsScreen"
        component={CompletedGroupsScreen}
        options={{
          tabBarLabel: "Completed",
        }}
      />
      <Tab.Screen
        name="DismissedGroupsScreen"
        component={DismissedGroupsScreen}
        options={{
          tabBarLabel: "Dismissed",
        }}
      />
    </Tab.Navigator>
  );
};


export default TransactionHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 32,
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 18,
    fontStyle: "italic",
  },
});
