import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { Title, Caption, Text, TouchableRipple } from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import firebase, { firestore } from "../../firebase/Firebase";

const ProfilePageScreen = ({ navigation }) => {
  //   const [profile, setProfile] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 7 }}>
          <FontAwesome5.Button
            name="user-edit"
            size={20}
            backgroundColor="#0d56d9"
            onPress={() => {
              navigation.navigate("EditProfileScreen");
            }}
          />
        </View>
      ),
    });
  });

  useEffect(() => {
    console.log("getting details");
    const db = firestore;

    const userID = firebase.auth().currentUser.uid;
    const docRef = db.collection("users").doc(userID);

    const observer = docRef.onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot:`, docSnapshot.data());
        setFirstName(docSnapshot.data().firstName);
        setLastName(docSnapshot.data().lastName);
        setContactNumber(docSnapshot.data().contactNumber);
        setEmail(docSnapshot.data().email);
        setAddress(docSnapshot.data().address);
        console.log("update reached");
      },
      (err) => {
        console.log(`Encountered error:`, err);
      }
    );

    // Stop listening for updates when no longer required
    return () => observer();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}></View>

      <View style={styles.userInfoSection}>
        {/* first name */}
        <View style={styles.row}>
          <FontAwesome name="user-o" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{firstName}</Text>
        </View>
        {/* Last name */}
        <View style={styles.row}>
          <FontAwesome name="user-o" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{lastName}</Text>
        </View>
        {/* Email */}
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{email}</Text>
        </View>
        {/* contact number */}
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {contactNumber}
          </Text>
        </View>
        {/* Address */}
        <View style={styles.row}>
          <FontAwesome name="address-book" color="#05375a" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>{address}</Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple
          onPress={() => navigation.navigate("ChangePasswordScreen")}
        >
          <View style={styles.menuItem}>
            <FontAwesome name="lock" color="#0d56d9" size={25} />
            <Text style={styles.menuItemText}> Change Password</Text>
          </View>
        </TouchableRipple>
        {/* <TouchableRipple onPress={() => navigation.navigate("TopUpPageScreen")}>
          <View style={styles.menuItem}>
            <FontAwesome name="credit-card" color="#0d56d9" size={25} />
            <Text style={styles.menuItemText}>Payment Options</Text>
          </View>
        </TouchableRipple> */}
      </View>
    </SafeAreaView>
  );
};

export default ProfilePageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 10,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    width: "33.3%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
