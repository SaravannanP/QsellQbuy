import React, { useState, useEffect, useLayoutEffect} from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import firebase, { firestore } from "../../firebase/Firebase";
import  Utility from "../../utils/Utility"
function EditProfileScreen({ navigation }) {
  // STATE HOOKS
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userID = firebase.auth().currentUser.uid;
  const [firstNameError,setFirstNameError] = useState("");
  const [lastNameError ,setLastNameError] = useState("");
  const [contactNumberError,setContactNumberError] = useState("");
  const [addressError, setAddressError] = useState("");


  useEffect(() => {
    getUserData();
  }, []);

  // -VALIDATES AND CHECKS FIRST NAME TEXT INPUT
const VerifyFirstName = () => {
  if(!(Utility.isAlphabet(firstName)))
  {
    setFirstNameError("FirstName is Invalid (no numbers)");
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
  if(!(Utility.isAlphabet(lastName)))
  {
    setLastNameError("LastName is Invalid (no numbers)");
    return false;
  }
  else 
  {
    setLastNameError("");
    return true;
  }
}

const VerifyContactNumber = () => {
   if(!(Utility.isValidContactNumber(contactNumber)))
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



  async function getUserData(){
    const docRef = firestore.collection("users").doc(userID);
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      setFirstName(doc.data().firstName);
      setLastName(doc.data().lastName);
      setContactNumber(doc.data().contactNumber)
      setAddress(doc.data().address)
    }
  }

  // UPDATES USER DOCUMENT IN FIRESTORE
  function updateProfileData() {
    setIsLoading(true);
    const usersRef = firestore.collection("users").doc(userID);
    usersRef
      .update({
        firstName: firstName,
        lastName: lastName,
        contactNumber: contactNumber,
        address : address,
      })
      .then(function (docRef) {
        setIsLoading(false);
        console.log("Document updated with ID:", usersRef.id);
        Alert.alert("Profile Updated Successfully", "", [
          { text: "Proceed", onPress: () => navigation.navigate("ProfilePageScreen") },
        ]);
      })
      .catch(function (error) {
        //Alert.alert(error.message);
        setIsLoading(false);
        console.error("error updating document: ", error);
      });
  }

  const performProfileUpdate = () => {
    // isValidFieldProductName = validateFieldProductName();

    // if (isValidFieldProductName) {
    
    // }

    if(VerifyFirstName && VerifyLastName && VerifyContactNumber)
    {
      updateProfileData();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.text_footer, { marginTop: 35 }]}>First Name</Text>
      <View style={styles.action}>
        <FontAwesome name="user-o" size={20} />
        <TextInput
          placeholder="Enter First Name"
          placeholderTextColor="#666666"
          autoCorrect={false}
          style={styles.textInput}
          value={firstName}
          onChangeText={(newFirstName) => {
            setFirstName(newFirstName);
          }}
          onEndEditing={VerifyFirstName}
        />
         <Text style={styles.ErrorText}> {firstNameError}</Text>
      </View>

      <Text style={[styles.text_footer, { marginTop: 35 }]}>Last name</Text>
      <View style={styles.action}>
        <FontAwesome name="user-o" size={20} />
        <TextInput
          placeholder="Enter Last Name"
          placeholderTextColor="#666666"
          autoCorrect={false}
          style={styles.textInput}
          value={lastName}
          onChangeText={(newLastName) => {
            setLastName(newLastName);
          }}
          onEndEditing={VerifyLastName}
        />
         <Text style={styles.ErrorText}> {lastNameError}</Text>
      </View>

      <Text style={[styles.text_footer, { marginTop: 35 }]}>
        Contact Number
      </Text>
      <View style={styles.action}>
        <Feather name="phone" size={20} />
        <TextInput
          placeholder="Your Contact Number"
          placeholderTextColor="#666666"
          keyboardType="number-pad"
          autoCorrect={false}
          style={styles.textInput}
          value={contactNumber}
          onChangeText={(newContactNumber) => {
            setContactNumber(newContactNumber);
          }}
          onEndEditing={VerifyContactNumber}
        />
         <Text style={styles.ErrorText}> {contactNumberError}</Text>
      </View>

      <Text style={[styles.text_footer, { marginTop: 35 }]}>
        Address
      </Text>
      <View style={styles.action}>
        <FontAwesome name="address-book" size={20} />
        <TextInput
          placeholder="Your Address"
          placeholderTextColor="#666666"
          //keyboardType="number-pad"
          autoCorrect={false}
          style={styles.textInput}
          value={address}
          onChangeText={(newAddress) => {
            setAddress(newAddress);
          }}
          
        />

      </View>

      <TouchableOpacity
        style={styles.commandButton}
        onPress={performProfileUpdate}
      >
        <Text style={styles.panelButtonTitle}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
export default EditProfileScreen;
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    // backgroundColor: "#fff",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#0d56d9",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#0d56d9",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
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
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  ErrorText: {
    fontSize: 12,
    color: "#FF0000",
    marginBottom: -5,
    marginHorizontal: 20,
  },
});
