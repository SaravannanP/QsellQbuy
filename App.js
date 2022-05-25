import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import MainStacknavigator from "./src/navigation/MainStackNavigator";
import MMainTabSceen from "./src/screens/merchant/MMainTabScreen";
import CreateProductScreen from "./src/screens/merchant/CreateProductScreen";
import WatchListCard from "./src/components/WatchListCard";
export default function App() {
  return <MainStacknavigator />;
  //return <CreateProductScreen />;
  //return <WatchListCard />;
}

console.disableYellowBox = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
