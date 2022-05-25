import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Picker,
  ScrollView,
} from "react-native";

//import StripeCheckout from "../../components/StripeCheckout"
import Constants from "../../const/Constants";
import firebase, { firestore } from "../../firebase/Firebase";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
function TopUpPageScreen({ navigation }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [spinner, setSpinner] = useState(false);
  //  PRODUCT CATEGORY
  const [selectedValue, setSelectedValue] = useState(50);
  const [accountBalance, setAccountBalance] = useState(0);
  const [temp, setTemp] = useState(0);

  async function onProcessPayment() {
    const userID = firebase.auth().currentUser.uid;
    const UserRef = firestore.collection("users").doc(userID);

    const doc = await UserRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      console.log("Selected value:", selectedValue);
      console.log("Document data:", doc.data());
      await UserRef.update({
        accountBalance: doc.data().accountBalance + selectedValue,
      });
    }

    Alert.alert("Top-Up Successful", "", [
      {
        text: "Proceed",
        onPress: () => navigation.navigate("ProfilePageScreen"),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
    
      <Text style={[styles.text_footer, { marginTop: 35 }]}>Card Name</Text>
      <View style={styles.action}>
        <TextInput
          placeholder="Card Name"
          placeholderTextColor="#666666"
          autoCorrect={false}
          maxLength={25}
          keyboardType="default"
          style={styles.textInput}
          multiline={false}
          value={name}
          onChangeText={(newName) => setName(newName)}
        />
      </View>

      <Text style={[styles.text_footer, { marginTop: 35 }]}>Card Number</Text>
      <View style={styles.action}>
        <TextInput
          maxLength={16}
          keyboardType="number-pad"
          multiline={false}
          placeholder="Card Number"
          value={cardNumber}
          style={styles.textInput}
          onChangeText={(newCardNumber) => setCardNumber(newCardNumber)}
        />
      </View>

      <Text style={[styles.text_footer, { marginTop: 35 }]}>CVC</Text>
      <View style={styles.action}>
        <TextInput
          maxLength={3}
          keyboardType="number-pad"
          multiline={false}
          placeholder="CVC"
          value={cvc}
          // style={[styles.input, styles.cvcInput]}
          onChangeText={(newCvc) => setCvc(newCvc)}
        />
      </View>

      <Text style={[styles.text_footer, { marginTop: 35 }]}>Month/Year</Text>
      <View style={styles.action}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            maxLength={2}
            keyboardType="number-pad"
            multiline={false}
            placeholder="MM"
            value={expMonth}
            //style={[styles.input, styles.expDateInput]}
            onChangeText={(newExpMonth) => setExpMonth(newExpMonth)}
          />
          <Text style={{ fontSize: 18 }}>/</Text>

          <TextInput
            maxLength={2}
            keyboardType="number-pad"
            multiline={false}
            placeholder="YY"
            value={expYear}
            //style={[styles.input, styles.expDateInput]}
            onChangeText={(newExpYear) => setExpYear(newExpYear)}
          />
        </View>
      </View>

      <Text style={[styles.text_footer, { marginTop: 35 }]}>
        Payment Amount
      </Text>
      {/* <Picker
        selectedValue={selectedValue}
        style={{ height:  Constants.screenHeight * 0.06, width: Constants.screenWidth * 0.35}}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
      >
        <Picker.Item label = "50"      value = {50}  />
        <Picker.Item label = "100"     value = {100} />
        <Picker.Item label = "200"     value = {200} />
      </Picker> */}

      <DropDownPicker
        items={[
          {
            label: "50",
            value: 50,
            icon: () => (
              <MaterialCommunityIcons name="cash" size={18} color="#900" />
            ),
            hidden: true,
          },
          {
            label: "100",
            value: 100,
            icon: () => (
              <MaterialCommunityIcons name="cash" size={18} color="#900" />
            ),
          },
          {
            label: "200",
            value: 200,
            icon: () => (
              <MaterialCommunityIcons name="cash" size={18} color="#900" />
            ),
          },
        ]}
        defaultValue={selectedValue}
        containerStyle={{ width: 150, height: 40 }}
        style={{ backgroundColor: "#fafafa" }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
        onChangeItem={(itemValue) => setSelectedValue(itemValue.value)}
      />
              <View paddingVertical={20} />
      <TouchableOpacity style={styles.commandButton} onPress={onProcessPayment}>
        <Text style={styles.panelButtonTitle}>Proceed</Text>
      </TouchableOpacity>

      <View paddingVertical={20} />
    </SafeAreaView>
  );
}
export default TopUpPageScreen;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    // backgroundColor: "#fff",
  },
  input: {
    fontSize: 18,
    borderColor: "gray",
  },
  cardNumber: {
    width: 150,
  },
  cvcInput: {
    width: 50,
  },
  nameInput: {
    width: undefined,
    alignSelf: "center",
  },
  expDateInput: {
    marginHorizontal: 4,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#0d56d9",
    alignItems: "center",
    marginTop: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
});
