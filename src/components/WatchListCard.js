import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Card, Button, Icon } from "react-native-elements";
//import { Item } from "react-native-paper/lib/typescript/src/components/List/List";
import firebase, { firestore } from "../firebase/Firebase";
function WatchListCard({ item, onPress, navigation }) {
  const uri = item.productImageUrl;

  function DeleteProductFromWatchList() {
    const db = firestore;
    // let watchListArray = [];
    // let dict;
    // const promises = [];
    //const userID = firebase.auth().currentUser.uid;
    //const query =
    db.collection("watchlist2")
      .doc(item.watchListId)
      .delete()
      .then(function () {
        // Alert.alert("Product deleted Successfully", "", [
        //   { text: "Proceed", onPress: () => navigation.navigate("WatchListScreen") },
        // ]);
      })
      .catch(function (error) {
        Alert.alert("Error removing document: ", error);
      });
  }

  function CreateGroupBuy(){
    const db = firestore;

    const groupBuyRef = db.collection("groupBuys2").doc();
    groupBuyRef
    .set({
      // start date
      // end date
      currentGroupBuySize : 1,
      groupBuyStatus : "ongoingGroupBuy",
      productDiscountedPrice: item.productDiscountedPrice,
      productId: item.productId,
      productImageUrl: item.productImageUrl,
      productMinimumGroupSize: item.productMinimumGroupSize,
      productName: item.productName,
    })
    .then(function ()
    {
      console.log("Collection added with ID:", groupBuyRef.id);
      var promises = [];
      promises.push(firebase.firestore()
      .collection("groupBuys2")
      .doc(groupBuyRef.id)
      .collection("user JoinGroupBuy")
      .doc(item.consumerId)
      .set({ 
        balanceHold: item.productDiscountedPrice,
        // consumerAddress: item.address,
        // consumerContactNumber: item.contactNumber,
        consumerId: item.consumerId,
      }))

        // AFTER ALL PROMISES
        Promise.all(promises).then(function() {
          console.log("All subcollections were added!");
        })
    })
    .catch(function (error) {
      //Alert.alert(error.message);
      console.log(error.message);
      setIsLoading(false);
      console.error("error adding document: ", error);
    });


    // need to update products table 

    
  }

  function addUserToGroup(groupBuyId){
    const db = firestore;

    const userJoinRef = db.collection("groupBuys2").doc(groupBuyId);

    userJoinRef.collection("user JoinGroupBuy").doc(item.consumerId)
    .add({
      balnceHold:item.productDiscountedPrice,
      consumerAddress:item.address,
      consumerContactNumber: item.contactNumber,
      consumerId:item.consumerId
    })
    .then(function (docRef)
    {
      console.log("Sub collection written");
      Alert.alert("Group created  Successfully", "", [
        { text: "Proceed", onPress: () => navigation.navigate("HomeScreen") },
      ]);
     
    })
    .catch(function (error) {
      //Alert.alert(error.message);
      console.log(error.message);
      setIsLoading(false);
      console.error("error adding document: ", error);
    });
  }



  return (
    <Card
      title={item.prductName}
      image={{
        uri: uri,
      }}
      imageStyle={{
        resizeMode: "contain",
      }}
    >
      <Text style={{ marginBottom: 10 }}>$ {item.productDiscountedPrice}</Text>
      <Text style={{ marginBottom: 10 }}>
        Orignal Price $ {item.productOriginalPrice}
      </Text>
      <Text style={{ marginBottom: 10 }}>title</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.buttonStyle}>
          <Button title={"Create Group"} onPress={CreateGroupBuy} />
        </View>
        <View style={styles.buttonStyle}>
          <Button title={"View GroupBuy"} onPress={() => {}} />
        </View>
        <View style={styles.buttonStyle}>
          <Button title={"Delete"} onPress={DeleteProductFromWatchList} />
        </View>
      </View>
    </Card>
  );
}
export default WatchListCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyleContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 5,
  },
  buttonStyle: {
    marginHorizontal: 10,
    marginTop: 5,
  },
});
