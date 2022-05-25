import React from "react";
import { TextInput, Text, StyleSheet, View } from "react-native";
import Color from "../utils/Colors";
import Constants from "../const/Constants";
import Feather from "react-native-vector-icons/Feather";
const TextInputField = ({
  term,
  placeHolder,
  onTermChange,
  onValidateEmailAddress,
  error,
}) => {
  return (
    <View>
      <Text style={styles.text_footer}>Email</Text>
      <View style={styles.action}>
        <Feather name="mail" color="#05375a" size={20} />
        <TextInput
          autoCorrect={false}
          style={styles.textInput}
          placeholder={placeHolder}
          value={term}
          onChangeText={onTermChange}
          onEndEditing={onValidateEmailAddress}
          autoCapitalize="none"
        />
      </View>
      <Text style={styles.ErrorText}> {error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  ErrorText: {
    fontSize: 12,
    color: Color.red,
    marginBottom: -5,
    marginHorizontal: 20,
  },
});

export default TextInputField;
