import React, { Component ,useEffect,useState} from "react";
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
  SafeAreaView,
} from "react-native";
import firebase, { firestore } from "../../firebase/Firebase";
import * as Progress from 'react-native-progress';
import dayjs from "dayjs";

const GroupBuyDetailsScreen = ({ route,navigation }) => {
  const { item } = route.params;
  const uri = item.productImageUrl;
  const userID = firebase.auth().currentUser.uid;


  const [count,setCount] = useState(0);
  const [productDescription,setProductDescription] = useState("");
  const [originalPrice,setOriginalPrice] = useState(0);
  const [currentGroupBuySize,setCurrentGroupBuySize] = useState(0);
  const [productMinimumGroupSize,setProductMinimumGroupSize] = useState(0);
  const [groupBuyProgress,setGroupBuyProgress] = useState(0);


  useEffect(() => {
    console.log(item);
    // setConsumerId(userID);
    // setProductId(item.productId);
    // getConsumerDetails();
    // getGroupBuyDetails();
    getProductDetails();
    
  }, []);

async function getProductDetails(){
  const ProductRef = firestore.collection("products").doc(item.productId);
  const doc = await ProductRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
    setProductDescription(doc.data().productDescription);
    setOriginalPrice(doc.data().productOriginalPrice);
  }
}


async function leaveGroup(){
    const leaveGroupRef = await firestore.collection("groupBuys").doc(item.groupBuyId)
                          .collection('userJoinGroupBuy').doc(userID)
                          .delete()
                          .then(function () {
                            updateGroupSize();
                          })
                          .catch(function (error) {
                            Alert.alert("Error removing document: ", error);
                          });  

    const userRef = firestore.collection('users').doc(userID);

    const doc = await userRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
       // Set the 'accountBalance' field of the user Doc
    const res = await  userRef.update({
          accountBalanceOnHold: (doc.data().accountBalanceOnHold - item.productDiscountedPrice)});
    }

    Alert.alert("Left Group Successfully", "", [
      { text: "Proceed", onPress: () => navigation.navigate("GroupBuyListScreen") },
    ]);

}

async function updateGroupSize()
{
  const getGroupSizerRef = await firestore.collection("groupBuys").doc(item.groupBuyId).get();
  const updateGroupSizerRef = firestore.collection("groupBuys").doc(item.groupBuyId);
  console.log(getGroupSizerRef.data().currentGroupBuySize);
  updateGroupSizerRef.update({currentGroupBuySize: (getGroupSizerRef.data().currentGroupBuySize - 1) });
}

function millisecondsToTimeLeft(miliseconds) {
  var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;
  total_seconds = parseInt(Math.floor(miliseconds / 1000));
  total_minutes = parseInt(Math.floor(total_seconds / 60));
  total_hours = parseInt(Math.floor(total_minutes / 60));
  days = parseInt(Math.floor(total_hours / 24));

  seconds = parseInt(total_seconds % 60);
  minutes = parseInt(total_minutes % 60);
  hours = parseInt(total_hours % 24);
    
  return days + "day " + hours + "h " + minutes + "min " + seconds + "sec";
}

function timeLeft(){
  if(dayjs(item.endDate) - dayjs() > 0)
  {
    return  dayjs(item.endDate) - dayjs()
  }
  else 
  {
    return 0
  }

}

function timeLeftDisplay(){

  if(item.endDate !== null && item.endDate !== undefined){ 
    return millisecondsToTimeLeft(timeLeft())
    }
    else {
      return "GroupBuy for this product has ended";
    }
}


var num = (((originalPrice - item.productDiscountedPrice) / originalPrice) * 100 );
var n = num.toFixed(0)

// setProductMinimumGroupSize(item.productMinimumGroupSize);
// setCurrentGroupBuySize(item.currentGroupBuySize);
// setGroupBuyProgress((item.currentGroupBuySize) / item.productMinimumGroupSize)




  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    
        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          <Image style={styles.productImg} source={{ uri: uri }} />
          <Text style={styles.name}>{item.productName}</Text>
          <Text style={styles.price}>$ {item.productDiscountedPrice} </Text>
          <Text
            style={{
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            }}
          >
            original price: $ {originalPrice}
          </Text>
          <Text> {n} % off </Text>
          <Text>Product Description</Text>
          {/* <Text style={styles.description}>{productDescription}</Text> */}
        </View>
        <View style={styles.separator}></View>
        <View style={styles.addToCarContainer}>

        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
                    <Text style={styles.price}> Product currently in a GroupBuy</Text>
                    <View paddingVertical={10} />
                    <Progress.Bar progress={(item.currentGroupBuySize) / item.productMinimumGroupSize} width={200} />
                    <View paddingVertical={5} />
                    {/* <Text>Current group size: {item.currentGroupBuySize} / {item.productMinimumGroupSize}</Text> */}
                    <Text>Minimum group size: {item.productMinimumGroupSize}</Text>
                    <Text>Current group size: {item.currentGroupBuySize}</Text>
                    <View paddingVertical={5} />
                    {/* <Text>{item.productMinimumGroupSize - item.currentGroupBuySize} more spot left for this product at this price!!!</Text> */}
                    <View paddingVertical={2} />
                    <Text style={styles.price}>Time left: {timeLeftDisplay()}</Text>
        </View>
                    <View paddingVertical={10} />


          
        <TouchableOpacity style={styles.shareButton} onPress={leaveGroup}>
          <Text style={styles.shareButtonText}>Leave Group</Text>
        </TouchableOpacity>
          
          {/* <TouchableOpacity style={styles.shareButton} onPress={() => {}}>
            <Text style={styles.shareButtonText}>View GroupBuy</Text>
          </TouchableOpacity> */}
           <View paddingVertical={10} />
        </View>

    </ScrollView>
    </SafeAreaView>
  );
};

export default GroupBuyDetailsScreen;

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
