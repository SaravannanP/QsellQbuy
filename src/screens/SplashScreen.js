import React, { Component, useEffect } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import Color from "../utils/Colors";
import Images from "../const/Images";
import Constants from "../const/Constants";

// SPLASHSCREEN FUNCTION
function SplashScreen({ navigation }) {
  // NAVIGATES TO REGISTER SCREEN
  useEffect(() => {
    setTimeout(function () {
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    }, 1000);
  }, [navigation]);

  // SPLASHCREEN LOGO
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={Images.logo}></Image>
    </SafeAreaView>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    margin: 0.04 * Constants.screenHeight,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.MasterBlue,
  },
});
