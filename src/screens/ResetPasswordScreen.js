import React, { Component, useState, useEffect} from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import Utility from "../utils/Utility";

// COMPONENT
import EmailTextInputField from "../components/EmailTextInputField";
import Strings from "../const/Strings";

// FIREBASE
import firebase from "../firebase/Firebase";

// RESETPASSWORD FUNCTION
function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState("");

  // const validateEmailAddress = () => {
  //   const isValidEmail = Utility.isEmailValid(email);
  //   isValidEmail
  //     ? setEmailError("")
  //     : setEmailError(Strings.InvalidEmailAddress);
  //   return isValidEmail;
  // };


  // -VALIDATES AND CHECKS EMAIL TEXT INPUT
const VerifyEmail = () =>  {
  if((Utility.isEmpty(email)))
  {
    setEmailError("Field Empty");
    return false;
  }
  else if(!(Utility.isEmailValid(email)))
  {
    setEmailError("Email is Invalid");
    return false;
  }
  else
  {
    setEmailError("");
    return true;
  }
}

  // CHECKS IF ENTERED EMAIL IS VALID
  const performReset = () => {
    const isValidEmail = VerifyEmail();

    if (isValidEmail) {
      setEmailError("");
      forgotPassword(email);
    }
  };

  // RESETPASSWORD FUCNTION BY FIREBASE
  const forgotPassword = (email) => {
    try {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function (user) {
          alert("Please check your email");
        })
        .catch(error => {
          Alert.alert('Error:', error.message)
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Reset Password</Text>
        <Text style={{ color: "#fff" }}>Please enter your email address</Text>
        <Text style={{ color: "#fff" }}>
          Email will be sent to the address to reset Password
        </Text>
      </View>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>

         {/* -EMAIL- */}
        <Text style={[styles.text_footer, { marginTop: 35 }]}>Email</Text>
          <View style={styles.action}>
            <Feather name="mail" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Email"
              style={styles.textInput}
              autoCapitalize="none"
              value={email}
              onChangeText={(newEmail) => {
                setEmail(newEmail);
              }}
              onEndEditing={VerifyEmail}
            />
            <Text style={styles.ErrorText}> {emailError}</Text>
          </View>

        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn} onPress={performReset}>
            <LinearGradient
              colors={["#0d56d9", "#0d56a1"]}
              style={styles.signIn}
            >
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#fff",
                  },
                ]}
              >
                Reset Password
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("LoginScreen")}
            style={[
              styles.signIn,
              {
                borderColor: "#0d56d9",
                borderWidth: 1,
                marginTop: 15,
              },
            ]}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: "#0d56d9",
                },
              ]}
            >
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
}

export default ResetPasswordScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d56d9",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
