
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
import Card from "../../components/Card"
import GroupBuyCard from "../../components/GroupBuyCard"


function GroupBuyListScreen({ navigation }) {
  const [groupBuyList, setGroupBuylist] = useState([]);
  const [arraylength, setArrayLength] = useState(0);

useEffect(() => {
  
  getGroupsJoined();
    },[]);


function getGroupsJoined (){
        // const promises = [];
        // let groupBuys = [];
        // const userID = firebase.auth().currentUser.uid;
        
        // firestore.collection("groupBuys").where("groupBuyStatus","==","ongoing")
        // .onSnapshot(querySnapshot => {
        //   querySnapshot.docChanges().forEach(change => {
        //   let groupBuyInfo = {};
        //   let promise =  firestore.collection("groupBuys").doc(change.doc.id).collection("userJoinGroupBuy")
        //                       .where("consumerId","==",userID)
        //                       .get()
        //                       .then((userJoinGroupBuyData) => {
        //                         userJoinGroupBuyData.forEach((userJoinGroupBuyDataDoc) =>{ 
        //                         groupBuyInfo = {
        //                           ...change.doc.data(),
        //                           groupBuyId: change.doc.id
        //                         }
        //                         groupBuys.push({...groupBuyInfo})
        //                       })
        //                       })
        //                       .catch((error) => {
        //                         Alert.alert(error)
        //                       })
        //                       promises.push(promise);
        //                       })
        //                       Promise.all(promises).then (() => {
        //                         setGroupBuylist(groupBuys)
        //                         groupBuys = [];
        //                         groupBuyInfo = "";
        //                       })
        // })

        const promises = [];
        let groupBuys = [];
        const userID = firebase.auth().currentUser.uid;
        
        firestore.collection("groupBuys").where("groupBuyStatus","==","ongoing")
        .onSnapshot(querySnapshot => {
          querySnapshot.docs.map(change => {
          let groupBuyInfo = {};
          let promise =  firestore.collection("groupBuys").doc(change.id).collection("userJoinGroupBuy")
                              .where("consumerId","==",userID)
                              .get()
                              .then((userJoinGroupBuyData) => {
                                userJoinGroupBuyData.forEach((userJoinGroupBuyDataDoc) =>{ 
                                groupBuyInfo = {
                                  ...change.data(),
                                  groupBuyId: change.id
                                }
                                groupBuys.push({...groupBuyInfo})
                              })
                              })
                              .catch((error) => {
                                Alert.alert(error)
                              })
                              promises.push(promise);
                              })
                              Promise.all(promises).then (() => {
                                setGroupBuylist(groupBuys)
                                groupBuys = [];
                                groupBuyInfo = "";
                              })
        })


    
}

// NEED TO LINK TO GROUPBUYDETAILSLIST
  return groupBuyList.length > 0 ? (
    <SafeAreaView style={StyleSheet.container}>
    <ScrollView>
    <View style={styles.cardsWrapper}> 
      <FlatList
        data={groupBuyList}
        keyExtractor={(item, index) => {
          return item.groupBuyId;
        }}
        distance
        renderItem={({ item, index }) => {
          return <GroupBuyCard item={item} onPress={() => {
            navigation.navigate("GroupBuyDetailsScreen", {
              item,
            });
          }} />;
        }}
      />
    </View>
    </ScrollView>
    </SafeAreaView>
  ) : (
    <View style={styles.textContainer}>
      <Text style={styles.emptyTitle}>You're not in any groups</Text>
      <Text style={styles.emptySubtitle}>Join a group!!!</Text>
    </View>
  );
}

export default GroupBuyListScreen;

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
  },
  cardsWrapper: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
});
