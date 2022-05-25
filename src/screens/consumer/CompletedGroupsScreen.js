import React, { useEffect, useState,useRef} from "react";
import { 
    StyleSheet,
  Text,
  Button,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";

import firebase, { firestore } from "../../firebase/Firebase";
import CompletedCard from "../../components/CompletedCard"

function  CompletedGroupsScreen ({ navigation }) {

const [transactionHistoryList, setTransactionHistoryList] = useState([]);

const [arraylength, setArrayLength] = useState(0);
const userID = firebase.auth().currentUser.uid;
useEffect(() => {
  getConsumerCompletedGroups();
    },[]);


function getConsumerCompletedGroups(){
  
const promises = [];
let groupBuys = [];
let groupBuyInfo;
firestore.collection("groupBuys") /* get all the questions of the item */
  .where("groupBuyStatus","==","completed") /* for these questions that have the same product id */
  .get() /* get all the completeded groups */
  .then((Data) => {
    if (Data.docs[0] != null) {
      Data.forEach((Doc) => {
        let promise = Doc.ref
          .collection("userJoinGroupBuy")
          .where("consumerId","==",userID)
          .get()
          .then((res) => {
            if (res.docs[0] != null) {
              res.forEach((resDoc) => {
                console.log(resDoc.data());
                groupBuyInfo = {
                      ...Doc.data(),
                      groupBuyId : Doc.id,
                      // ...resDoc.data()
                        }

              });
              groupBuys.push({ ...groupBuyInfo });
            } 
          })
          .catch((error) => {
            console.log(error.message)
          });

        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        console.log(groupBuys)
        setTransactionHistoryList(groupBuys)
      });
    } else {
      /* if document not found, return error */
      console.log("document not found")
    }
  })
  .catch((error) => {
    console.log(error.message)
  });
  
}


    return transactionHistoryList.length > 0 ? (
    <SafeAreaView style={StyleSheet.container}>
    <ScrollView>

    <View style={styles.cardsWrapper}> 
      <FlatList
        data={transactionHistoryList}
        keyExtractor={(item, index) => {
          return item.groupBuyId;
        }}
        // ON PRESS METHOD TO RATING AND REVIEW SCREEN
        distance
        renderItem={({ item, index }) => {
          return <CompletedCard item={item} onPress={() => {
            navigation.navigate("RatingReviewScreen", {
            item,
            });
            }}/>;
        }}
      />
    </View>
    
    </ScrollView>
    </SafeAreaView>
  ) : (
    <View style={styles.textContainer}>
      <Text style={styles.emptyTitle}>No recent purchases</Text>
      <Text style={styles.emptySubtitle}>Do purchase something</Text>
    </View>
  );
    
}
export default CompletedGroupsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
      textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      emptyTitle: {
        fontSize: 32,
        marginBottom: 16,
      },
      emptySubtitle: {
        fontSize: 18,
        fontStyle: "italic",
      },cardsWrapper: {
        marginTop: 20,
        width: "90%",
        alignSelf: "center",
      },
});