import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Button,
  StatusBar,
} from "react-native";
import firebase, { firestore } from "../firebase/Firebase";


const CustomProductDetailsCard = ({ route, navigation }) => {
  
  const { item } = route.params;
  const uri = item.productImageUrl;
  const userID = firebase.auth().currentUser.uid;
  // STATE HOOKS
  const [consumerId, setConsumerId] = useState("");
  const [productId, setProductId] = useState("");
  const [consumerAddress,setConsumerAddress] = useState("");
  const [consumerContactNumber,setConsumerContactNumber] = useState("");
  const [consumerName , setConsumerName] = useState("");
  const [count,setCount] = useState(0);
  
  useEffect(() => {
    console.log(item);
    // GET CURRENT USER ID
    setConsumerId(userID);
    // GET PRODUCT ID
    setProductId(item.productId);
    //FOR JOIN GROUP FIELDS
    getConsumerDetails();
    
  }, []);



  // FOR JOIN GROUP FIELDS
async function getConsumerDetails () {
  const db = firestore;
  const DetailsRef = db.collection('users').doc(userID);
  const doc = await DetailsRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
    setConsumerAddress(doc.data().address);
    setConsumerContactNumber(doc.data().contactNumber);
    setConsumerName(doc.data().firstName);
  }
  
}


// ADD TO WATCHLIST FUNCTION
  function addToWatchList() {

    const watchListRef = firestore.collection("watchlist").doc();
    watchListRef
      .set({
        consumerId: consumerId,
        productId: productId,
      })
      .then(function (docRef) {
        console.log("Document written with ID:", watchListRef.id);
        Alert.alert("Added to Watchlist Successfully", "", [
          { text: "Proceed", onPress: () => navigation.navigate("HomeScreen") },
        ]);
      })
      .catch(function (error) {
        Alert.alert(error.message);
        console.log(error.message);
        console.error("error adding document: ", error);
      });
  }

  // CREATE GROUP
  function CreateGroupBuy(){

    const db = firestore;
    const groupBuyRef = db.collection("groupBuys").doc();
    var date = new Date();
    var Created = convertUTCDateToLocalDate(date);
    date.setDate(date.getDate() + 1);
    var End = convertUTCDateToLocalDate(date);
    groupBuyRef
    .set({
      startDate : (Created.toISOString()),
      endDate :  (End.toISOString()),
      currentGroupBuySize : 1,
      groupBuyStatus : "ongoing",
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
        consumerAddress: consumerAddress,
        consumerContactNumber: consumerContactNumber,
        consumerName : consumerName,
        consumerId: item.consumerId,
      }))
        promises.push(firebase.firestore()
        .collection("products")
        .doc(item.productId)
        .update({ productStatus: "ongoingGroupBuy"}))
        // AFTER ALL PROMISES
        Promise.all(promises).then(function() {
          console.log("All subcollections were added!");
        })
    })
    .catch(function (error) {
      Alert.alert(error.message);
      //console.log(error.message);
      //setIsLoading(false);
      console.error("error adding document: ", error);
    });

    // need to update products table 
    
    // need update balance on hold and available balance
  }



// JOIN GROUP FUCNTION
  async function JoinGroup(){

    const joinGroupRef = firestore.collection("groupBuys")
    .where('productId','==',item.productId);
    const doc = await joinGroupRef.get();

    if(!doc.exists)
    {
      console.log('No such document!');
    }
    else
    {
      setCount(doc.data().currentGroupBuySize + 1);
      firestore.collection("groupBuys").doc(doc.id).update({currentGroupBuySize : count})
      firestore.collection("groupBuys").doc(doc.id).collection("user JoinGroupBuy").doc(consumerId)
      .set({ 
        balanceHold: item.productDiscountedPrice,
        consumerAddress: consumerAddress,
        consumerContactNumber: consumerContactNumber,
        consumername : consumerName,
        consumerId: consumerId,
      })
      .catch(error => {
        Alert.alert('Error:', error.message)
      });


  
    }

  //   const snapshot = await joinGroupRef.get();
  //   if (snapshot.empty) {
  //     console.log('No matching documents.');
  //     return;
  //   }  
    
  //   snapshot.forEach(doc => {
  //     console.log(doc.id, '=>', doc.data());
  //     // need update groupsize
  //     firestore.collection("groupBuys2").doc(doc.id)
  //     const ref =  firestore.collection("groupBuys2").doc(doc.id).collection("user JoinGroupBuy").doc(consumerId)
  //     .set({ 
  //       balanceHold: item.productDiscountedPrice,
  //       consumerAddress: consumerAddress,
  //       consumerContactNumber: consumerContactNumber,
  //       consumername : consumerName,
  //       consumerId: consumerId,
  //     })
  // });

  }

  var productStatus = item.productStatus;


// function ViewAddToWatchList()
// {



//   return(

//   )
// }



  var num = (((item.productOriginalPrice - item.productDiscountedPrice) / item.productOriginalPrice) * 100 );
  var n = num.toFixed(0)

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      <StatusBar barstyle="light-content" />
      
        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          <Image style={styles.productImg} source={{ uri: uri }} />
          <Text style={styles.name}>{item.productName}</Text>
          <Text style={styles.price}>${item.productDiscountedPrice}</Text>
          <Text
            style={{
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            }}
          >
            original price: ${item.productOriginalPrice}
          </Text>
          <Text> {n} % offer</Text>
          <Text>Product Description</Text>
          <Text style={styles.description}>{item.productDescription}</Text>
          {/* <Text style={styles.price}>{item.productStatus}</Text> */}
        </View>

        <View style={styles.separator}></View>
        <View style={styles.addToCarContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={addToWatchList}>
            <Text style={styles.shareButtonText}>Add To WatchList</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={DeleteProductFromWatchList}>
            <Text style={styles.shareButtonText}>Delete from WatchList</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.shareButton} onPress={CreateGroupBuy}>
            <Text style={styles.shareButtonText}>Create Group</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.shareButton} onPress={JoinGroup}>
            <Text style={styles.shareButtonText}>Join Group</Text>
          </TouchableOpacity>
        </View>

        <View paddingVertical={10} />
    </View>
    </ScrollView>
  );
};

export default CustomProductDetailsCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  productImg: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "bold",
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    marginTop: 10,
    color: "#696969",
  },
  star: {
    width: 40,
    height: 40,
  },
  btnColor: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginHorizontal: 3,
  },
  btnSize: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderColor: "#778899",
    borderWidth: 1,
    marginHorizontal: 3,
    backgroundColor: "white",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starContainer: {
    justifyContent: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  contentColors: {
    justifyContent: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  contentSize: {
    justifyContent: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: "#eeeeee",
    marginTop: 20,
    marginHorizontal: 30,
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#0d56d9",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  addToCarContainer: {
    marginHorizontal: 30,
  },
});

