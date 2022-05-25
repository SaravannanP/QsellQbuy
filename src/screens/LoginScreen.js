import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

import Strings from "../const/Strings";
import Color from "../utils/Colors";
import Utility from "../utils/Utility";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import firebase, { firestore } from "../firebase/Firebase";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

const VerifyPassword = () => {
  if((Utility.isEmpty(password)))
  {
    setPasswordError(Strings.PasswordFieldEmpty);
    return false;
  }
  else if(!(Utility.isValidPassword(password)))
  {
    setPasswordError("Password is Invalid");
    return false;
  }
  else 
  {
    setPasswordError("");
    return true;
  }

}

  // const validatePasswordField = () => {
  //   const isValidField = Utility.isValidField(password);
  //   isValidField
  //     ? setPasswordError("")
  //     : setPasswordError(Strings.PasswordFieldEmpty);
  //   return isValidField;
  // };

  const performLogin = () => {
    const isVerifyEmail     = VerifyEmail();
    const isVerifyPassword = VerifyPassword();
    
    if (isVerifyPassword && isVerifyEmail) {
     
      setEmailError("");
      setPasswordError("");
      Login(email, password);
    }
  };

  const Login = (email, password) => {
    try {
      setIsLoading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          setIsLoading(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "LoadingScreen" }],
          });
        })
        //.catch(error => console.log(error));
        .catch(error => {
          Alert.alert('Error:', error.message)
        });
    } catch (error) {
      Alert.alert(error.message);
      console.error( "error " + error);
    
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>

        
        <Text style={styles.text_footer}>Email</Text>
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

        <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
        <View style={styles.action}>
          <FontAwesome name="lock" color="#05375a" size={20} />
          <TextInput
            placeholder="Your Password"
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={(newPassword) => {
              setPassword(newPassword);
            }}
            onEndEditing={VerifyPassword}
          />
          <Text style={styles.ErrorText}> {passwordError}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={{ color: "#0d56d9", marginTop: 15 }}>
            Forgot Password
          </Text>
        </TouchableOpacity>

        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn} onPress={performLogin}>
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
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
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
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
}
export default LoginScreen;

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
  ErrorText: {
    fontSize: 12,
    color: Color.red,
    marginBottom: -5,
    marginHorizontal: 20,
  },
});
