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

function ChatScreen ({ route, navigation }) {
    const { item } = route.params;
    const uri = item.productImageUrl;
    const userID = firebase.auth().currentUser.uid;
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const [answer,setAnswer] = useState("");

    const convertUTCDateToLocalDate = (date) => {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
        return newDate;   
    }


// async function postAnswer()
// {
//       var date = new Date();
//       var Created = convertUTCDateToLocalDate(date);
//       const postQuestionRef = firestore.collection('questions')
//       .doc();
      
//       const res = await postQuestionRef.add({
//         consumerId : userID,
//         createdAt :  (Created.toISOString()) ,
//         productId : item.productId,
//         question : question,
//       });
// }



function postAnswerToQuestion() {

        var date = new Date();
        var Created = convertUTCDateToLocalDate(date);
        const messageRef = firestore
          .collection("questions")
          .doc(item.questionId)
          .collection("answers")
          .doc();
    
        messageRef
          .set({
            answer : answer,
            createdAt :  (Created.toISOString()) ,
            merchantId :userID,
            question : item.questionId ,
          })
          .then(function (docRef) {
            console.log("Document written with ID: ", messageRef.id);
            setAnswer("");
          })
          .catch(function (error) {
            Alert.alert(error.message);
            console.log("Error:", error);
          });

          Alert.alert("Answer Posted Successfully", "", [
            { text: "Proceed", onPress: () => navigation.navigate("MerchantDashboardScreen") },
          ]);
}

        return (
            <View style={styles.container}>
              <Text style={styles.emptyTitle}>{item.question}</Text>
            <TextInput
              style={styles.textInput}
              autoCorrect={false}
              placeholder="Post an Answer"
              maxLength={50}
              value = {answer}
              onChangeText= {(newAnswer) => setAnswer(newAnswer)}
              //onEndEditing={onValidateTextField}
            />
                <TouchableOpacity
                  style={styles.saveButton} onPress={postAnswerToQuestion}
                >
                  <Text style={styles.saveButtonText}>Post Answer</Text>
                </TouchableOpacity>
            </View>
        );
    
}
export default ChatScreen;

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