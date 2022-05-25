import React, { Component,useEffect,useState } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    TouchableOpacity
} from "react-native";
import firebase, { firestore } from "../firebase/Firebase";

function ChatScreenTwo ({ route, navigation }) {
  const { Link } = route.params;
    const userID = firebase.auth().currentUser.uid;
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const [question,setQuestion] = useState("");

    const convertUTCDateToLocalDate = (date) => {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
        return newDate;   
    }


async function postQuestion()
  {
    var date = new Date();
    var Created = convertUTCDateToLocalDate(date);
    const postQuestionRef = firestore.collection('questions').doc();
    
    const res = await postQuestionRef.set({
      consumerId : userID,
      createdAt :  (Created.toISOString()) ,
      productId : Link,
      question : question,
    });
    console.log("posted")
    setQuestion("");

  

          Alert.alert("Question Posted Successfully", "", [
            { text: "Proceed", onPress: () =>  navigation.navigate("HomeScreen") },
          ]);
}

        return (
            <View style={styles.container}>
              <Text style={styles.emptyTitle}>Product Enquiries </Text>
            <TextInput
              style={styles.textInput}
              autoCorrect={false}
              placeholder="Post a Question"
              maxLength={50}
              value = {question}
              onChangeText= {(newQuestion) => setQuestion(newQuestion)}
              //onEndEditing={onValidateTextField}
            />
                <TouchableOpacity
                  style={styles.saveButton} onPress={postQuestion}
                >
                  <Text style={styles.saveButtonText}>Post Question</Text>
                </TouchableOpacity>
            </View>
        );
    
}
export default ChatScreenTwo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyTitle: {
      fontSize: 32,
      marginBottom: 16,
    },
    emptySubtitle: {
      fontSize: 18,
      fontStyle: "italic",
      color: "red",
    },
});