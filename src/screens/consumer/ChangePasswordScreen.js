import React, { useState } from "react";
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
  SafeAreaView,
} from "react-native";
//import LinearGradient from 'react-native-linear-gradient';
import Utility from "../../utils/Utility";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { TouchableRipple } from "react-native-paper";

import Strings from "../../const/Strings"

import firebase, { firestore } from "../../firebase/Firebase";

function ChangePasswordScreen({ navigation }) {
  // -PASSWORD
  const [currentPassword, setCurrentPassword] = useState("");
  // -NEW PASSWORD
  const [newPassword, setNewPassword] = useState("");
  // confirm new password
  const [confirmNewPassword, setconfirmNewPassword] = useState("");

  // ERRORS
  // -PASSWORD
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  // -PASSWORD ERROR
  const [newPasswordError, setNewPasswordError] = useState("");

  // -CONFIRM PASSWORD ERROR
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const VerifyCurrentPassword = () => {
    if((Utility.isEmpty(currentPassword)))
    {
      setCurrentPasswordError(Strings.PasswordFieldEmpty);
      return false;
    }
    else if(!(Utility.isValidPassword(currentPassword)))
    {
      setCurrentPasswordError("Password is Invalid");
      return false;
    }
    else 
    {
      setCurrentPasswordError("");
      return true;
    }
  
  }

  const VerifyNewPassword = () => {
    if((Utility.isEmpty(newPassword)))
    {
      setNewPasswordError(Strings.PasswordFieldEmpty);
      return false;
    }
    else if(!(Utility.isValidPassword(newPassword)))
    {
      setNewPasswordError("Password is Invalid");
      return false;
    }
    else 
    {
      setNewPasswordError("");
      return true;
    }
  
  }


  const VerifyConfirmPassword = () => {
    if((Utility.isEmpty(confirmNewPassword)))
    {
      setConfirmPasswordError(Strings.PasswordFieldEmpty);
      return false;
    }
    else if(!(Utility.isValidPassword(confirmNewPassword)))
    {
      setConfirmPasswordError("Confirm Password is Invalid");
      return false;
    }
    else 
    {
      setConfirmPasswordError("");
      return true;
    }
  
  }




  const PerformChangePassword = () => {
    if (
      VerifyCurrentPassword &&
      VerifyNewPassword &&
      VerifyConfirmPassword
    ) {
      if (currentPassword != newPassword)
        ChangePassword(currentPassword, newPassword);
      else {
        alert("New password is similiar to old password");
      }
    }
  };

  const reauthenticate = (currentPassword) => {
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };

  const ChangePassword = (currentPassword, newPassword) => {
    reauthenticate(currentPassword)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            console.log("Password updated!");
            console.log("Please Relogin with new password")
            signOutUser();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };


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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.footer}>
        <Text style={styles.textSign}>Change Password</Text>
        <Text>Please Enter a new Password</Text>

        {/* Current Password */}
        <Text style={[styles.text_footer, { marginTop: 35 }]}>
          Current Password
        </Text>
        <View style={styles.action}>
          <FontAwesome name="lock" color="#05375a" size={20} />
          <TextInput
            placeholder="Your Current Password"
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry
            value={currentPassword}
            onChangeText={(newPassword) => {
              setCurrentPassword(newPassword);
            }}
            onEndEditing={VerifyCurrentPassword}
          />
          
        </View>
        <Text style={styles.ErrorText}> {currentPasswordError}</Text>

        {/*  New password portion    */}
        <Text style={[styles.text_footer, { marginTop: 35 }]}>
          New Password
        </Text>
        <View style={styles.action}>
          <FontAwesome name="lock" color="#05375a" size={20} />
          <TextInput
            placeholder=" Your new Password"
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry
            value={newPassword}
            onChangeText={(newPassword) => {
              setNewPassword(newPassword);
            }}
            onEndEditing={VerifyNewPassword}
          />
         
        </View>
        <Text style={styles.ErrorText}>{newPasswordError}</Text>

        {/*  Confirm New password portion    */}
        <Text style={[styles.text_footer, { marginTop: 35 }]}>
          Retype Password
        </Text>
        <View style={styles.action}>
          <FontAwesome name="lock" color="#05375a" size={20} />
          <TextInput
            placeholder="Confirm new Password"
            style={styles.textInput}
            autoCapitalize="none"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={(newPassword) => {
              setconfirmNewPassword(newPassword);
            }}
            onEndEditing={VerifyConfirmPassword}
          />
          
        </View>
        <Text style={styles.ErrorText}>{confirmPasswordError}</Text>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={PerformChangePassword}
          >
            <LinearGradient
              colors={["#0d56d9", "#0d56d9"]}
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
                Save
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfilePageScreen")} // navigation.goBack() navigation.navigate("SignInScreen")
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
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ChangePasswordScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: "#fff",
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
    color: '#FF0000',
    marginBottom: -5,
    marginHorizontal: 20,
  },
});
