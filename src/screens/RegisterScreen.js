import React, { Component, useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  //Dimensions,
  //KeyboardAvoidingView,
  SafeAreaView,
  //Image,
  //FlatList,
  //ActivityIndicator,
} from "react-native";
import Strings from "../const/Strings";
import Color from "../utils/Colors";
import Utility from "../utils/Utility";

// extras
//import { TouchableRipple } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { ScrollView } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";

// FIRESTORE
import firebase, { firestore } from "../firebase/Firebase";

// REGISTRATION FUNCTION
function RegisterScreen({ navigation }) {

  // STATE HOOKS
  // -FIRST NAME
  const [firstName, setFirstName] = useState("");

  // -LAST NAME
  const [lastName, setLastName] = useState("");

  // -EMAIL
  const [email, setEmail] = useState("");

  // -PASSWORD
  const [password, setPassword] = useState("");

  // -CONFIRM PASSWORD
  const [confirmPassword, setConfirmPassword] = useState("");

  // -CONTACT NUMBER
  const [contactNumber, setContactNumber] = useState("");

  // -ADDRESS
  const [address, setAddress] = useState("");

//--------------------------------------------------------------------------------
// -FIRSTNAME
const [firstNameError, setFirstNameError] = useState("");

  // -LAST NAME
  const [lastNameError, setLastNameError] = useState("");

  // -EMAIL ERROR
  const [emailError, setEmailError] = useState("");

  // -PASSWORD ERROR
  const [passwordError, setPasswordError] = useState("");

  // -CONFIRM PASSWORD ERROR
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // -CONTACT NUMBER
  const [contactNumberError, setContactNumberError] = useState("");

  // -ADDRESS
  const [addressError, setAddressError] = useState("");

  // -LOADER
  const [isLoading, setIsLoading] = useState("");

  // -ACCOUNT TYPE
  const [accountType, setAccountType] = useState("Consumer");

  // -ACCOUNT STATUS
  const [accountStatus, setAccountStatus] = useState("unban");


 // -ACCOUNT BALANCE
 const [accountBalance, setAccountBalance] = useState(0);

// -ACCOUNT BALANCE ON HOLD
const [accountBalanceOnHold, setAccountBalanceOnHold] = useState(0);

// DATE
const [createdDate,setCreatedDate] = useState("");

// if (isEmpty(data.firstName)) {
//   /* if the field is empty */
//   errors.firstName = "Must not be empty";
// } else if (!isAlphabet(data.firstName)) {
//   /* if is not a valid name */
//   errors.firstName = "Name must only be in alphabets, please re-enter.";
// }


// -VALIDATES AND CHECKS FIRST NAME TEXT INPUT
const VerifyFirstName = () => {
  if(!(Utility.isValidField(firstName)))
  {
    setFirstNameError("Field Empty");
    return false;
  }
  else if(!(Utility.isAlphabet(firstName)))
  {
    setFirstNameError("FirstName is Invalid");
    return false;
  }
  else 
  {
    setFirstNameError("");
    return true;
  }
}


// -VALIDATES AND CHECKS LAST NAME TEXT INPUT
const VerifyLastName = () =>{
  if(!(Utility.isValidField(lastName)))
  {
    setLastNameError("Field Empty");
    return false;
  }
  else if(!(Utility.isAlphabet(lastName)))
  {
    setLastNameError("LastName is Invalid");
    return false;
  }
  else 
  {
    setLastNameError("");
    return true;
  }
}


// -VALIDATES AND CHECKS EMAIL TEXT INPUT
const VerifyEmail = () =>  {
console.log(email)
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

const VerifyContactNumber = () => {
  if((Utility.isEmpty(contactNumber)))
  {
    setContactNumberError("Field Empty");
    return false;
  }
  else if(!(Utility.isValidContactNumber(contactNumber)))
  {
    setContactNumberError("Number is Invalid");
    return false;
  }
  else 
  {
    setContactNumberError("");
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

const VerifyConfirmPassword = () => {
  if((Utility.isEmpty(confirmPassword)))
  {
    setConfirmPasswordError(Strings.PasswordFieldEmpty);
    return false;
  }
  else if(!(Utility.isValidPassword(confirmPassword)))
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

// -VALIDATES AND CHECKS LAST NAME TEXT INPUT
const VerifyAddress = () =>{
  if(!(Utility.isValidField(address)))
  {
    setAddressError("Field Empty");
    return false;
  }
  // else if(!(Utility.isAlphabet(lastName)))
  // {
  //   setLastNameError("LastName is Invalid");
  //   return true;
  // }
  else 
  {
    setAddressError("");
    return true;
  }
}


  // -CHECKS IF THE TEXTINPUT IS VALID AND CALLS REGISTRATION FUNCTION
  const performRegistration = () => {

    const verifyEmail     = VerifyEmail();
    const verifyFirstName = VerifyFirstName();
    const verifyLastName = VerifyLastName();
    const verifyContactNumber = VerifyContactNumber();
    const verifyPassword = VerifyPassword();
    const verifyConfirmPassword = VerifyConfirmPassword();
    const verifyAddress = VerifyAddress();

    


      if (VerifyPassword && VerifyConfirmPassword && VerifyFirstName && VerifyLastName 
        && VerifyEmail && VerifyContactNumber && VerifyAddress) {

          setEmailError("");
          setPasswordError("");
          setConfirmPasswordError("");
          setFirstNameError("");
          setLastNameError("");
          setContactNumberError("");
          setAddressError("");
          setAccountStatus("unban");

          // CHECK IF PASSWORD AND CONFIRMPASSWORD MATCHES
          if (password == confirmPassword) {
            registration(email, password);
          } 
          else {
            console.log("Passwords dont match");
            Alert.alert('Passwords dont match')
          }
      }


    
  };


  const convertUTCDateToLocalDate = (date) => {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    return newDate;   
}



  // -PERFORM REGISTRATION AND COMMUNICATED WITH FIREBASE DATABASE
  // -CREATES A NEW USER DOCUMENT IN FIRESTORE WITH UNIQUE USER ID
  const registration = (email, password) => {
    try {
      setIsLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          setIsLoading(false);
          const userID = firebase.auth().currentUser.uid;
          const usersRef = firestore.collection("users").doc(userID);
          
          var date = new Date();
          var Created = convertUTCDateToLocalDate(date);
          if(accountType == "merchant" ){
          usersRef.set({
            accoutStatus: accountStatus,
            accountType: accountType,
            address: address,
            contactNumber: contactNumber,
            createdAt: (Created.toISOString()),
            email: email,
            firstName: firstName,
            lastName: lastName,
            userId: userID,
            
          });
        }
        else { // CONSUMER
          usersRef.set({
            accoutStatus: accountStatus,
            accountType: accountType,
            address: address,
            contactNumber: contactNumber,
            createdAt: (Created.toISOString()),
            email: email,
            firstName: firstName,
            lastName: lastName,
            userId: userID,
            accountBalance: accountBalance,
            accountBalanceOnHold: accountBalanceOnHold,
            
          });
        }
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        })
        .catch(error => {
          Alert.alert('Error:', error.message)
        });
    } catch (error) {
      setIsLoading(false);
      Alert.alert(error);
      console.log(error);
    }
  };

  // -RETURNS-
  return (
    <SafeAreaView style={styles.container}>
      {/* -HEADER- */}
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>

      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* -FIRST NAME-*/}
          <Text style={styles.text_footer}>First Name</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="First Name"
              style={styles.textInput}
              autoCapitalize="none"
              value={firstName}
              onChangeText={(newFirstName) => {
                setFirstName(newFirstName);
              }}
              onEndEditing={VerifyFirstName}
            />
            <Text style={styles.ErrorText}> {firstNameError}</Text>
          </View>

          {/* -LAST NAME-*/}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>Last Name</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Last Name"
              style={styles.textInput}
              autoCapitalize="none"
              value={lastName}
              onChangeText={(newLastName) => {
                setLastName(newLastName);
              }}
              onEndEditing={VerifyLastName}
            />
             <Text style={styles.ErrorText}> {lastNameError}</Text>
          </View>

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

          {/* -CONTACT NUMBER- */}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>
            Contact Number
          </Text>
          <View style={styles.action}>
            <FontAwesome name="phone" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Contact Number"
              style={styles.textInput}
              keyboardType="number-pad"
              autoCapitalize="none"
              value={contactNumber}
              onChangeText={(newContactNumber) => {
                setContactNumber(newContactNumber);
              }}
              onEndEditing={VerifyContactNumber}
            />
            <Text style={styles.ErrorText}> {contactNumberError}</Text>
          </View>

          {/* -PASSWORD-*/}
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

          {/*-CONFIRM PASSWORD-*/}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>
            Confirm Password
          </Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Confirm Your Password"
              style={styles.textInput}
              autoCapitalize="none"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(newConfirmPassword) => {
                setConfirmPassword(newConfirmPassword);
              }}
              onEndEditing={VerifyConfirmPassword}
            />
            <Text style={styles.ErrorText}> {confirmPasswordError}</Text>
          </View>

          {/* -ADDRESS-*/}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>Address</Text>
          <View style={styles.action}>
            <FontAwesome name="address-book" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter Address"
              style={styles.textInput}
              autoCapitalize="none"
              value={address}
              onChangeText={(newAddress) => {
                setAddress(newAddress);
              }}
              onEndEditing={VerifyAddress}
            />
            <Text style={styles.ErrorText}> {addressError}</Text>
          </View>

          {/* -ACCOUNT TYPE -*/}
          <View style={styles.radiogroup}>
            <View>
              <Text style={styles.radioText}>Account Type:</Text>
            </View>
            {/* -RADIO BUTTONS- */}
            <View style={{ flex: 1 }}>
              <Text style={styles.radioText}>Consumer</Text>
              <RadioButton
                value="consumer"
                status={accountType === "consumer" ? "checked" : "unchecked"}
                onPress={() => setAccountType("consumer")}
              ></RadioButton>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.radioText}>Merchant</Text>
              <RadioButton
                value="merchant"
                status={accountType === "merchant" ? "checked" : "unchecked"}
                onPress={() => setAccountType("merchant")}
              ></RadioButton>
            </View>
          </View>
          {/* -BUTTONS- */}
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={performRegistration}
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
                  Sign Up
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
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </SafeAreaView>
  );
}
export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#0d56d9",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
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
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
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
  radiobtn: {
    flexDirection: "row",
    width: "100%",
  },
  radioText: {
    marginRight: 35,
    fontSize: 15,
    //fontWeight: "700",
    color: "#05375a",
  },
  radiogroup: {
    marginTop: 20,
    marginBottom: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ErrorText: {
    fontSize: 12,
    color: Color.red,
    marginBottom: -5,
    marginHorizontal: 20,
  },
});
