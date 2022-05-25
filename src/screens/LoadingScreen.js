import React, { Component, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator ,SafeAreaView} from "react-native";
import firebase, { firestore } from "../firebase/Firebase";

function LoadingScreen({ navigation }) {
  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = () => {
    var profileArray = [];

    const userID = firebase.auth().currentUser.uid;
    const docRef = firestore.collection("users").doc(userID);

    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          //   profileArray.push(doc.data());
          if (doc.data().accountType == "consumer") {
            navigation.reset({
              index: 0,
              routes: [{ name: "CMainTabScreen" }],
            });
          } else if (doc.data().accountType == "merchant") {
            navigation.reset({
              index: 0,
              routes: [{ name: "MMainTabScreen" }],
            });
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such User!");
        }
        // setProfile(profileArray);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </SafeAreaView>
  );
}
export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0d56d9",
  },
});
