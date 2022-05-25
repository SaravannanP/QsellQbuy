import React, { Component, useState,useEffect } from "react";
import { View, Text, StyleSheet,FlatList,SafeAreaView} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ComsumerListCard from "../../components/ComsumerListCard"
import firebase, { firestore } from "../../firebase/Firebase";
import dayjs from "dayjs";

function CompletedGroupsScreen ({ route,navigation}){
  //const itemData = route.params.itemData;
  const { item } = route.params;
  const [consumerListArray,setConsumerListArray] = useState([]);
  const [description,setDescription] = useState("");
  const [originalPrice,setOriginalPrice] = useState(0);

  useEffect(() => {
    console.log('Group data:',item);
    getConsumerList();
    getAdditonalProductData();

  }, []);

  function getConsumerList()
  {
    let consumerDoc;
    let tempArray = [];
    const userID = firebase.auth().currentUser.uid;
    firestore.collection("groupBuys").doc(item.groupBuyId).collection("userJoinGroupBuy")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(document => {

          consumerDoc = {
            consumerListId :document.id,
            ...document.data()
          }
          console.log(consumerDoc)
          tempArray.push(consumerDoc);
          setConsumerListArray(tempArray)
        });
      })
  }

async function getAdditonalProductData()  
  {
    
    const productRef = firestore.collection("products").doc(item.productId);
    const doc = await productRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      setDescription(doc.data().productDescription)
      setOriginalPrice(doc.data().productOriginalPrice)
    }
  }

function productOriginalPrice()
{
  var op = originalPrice;
  return op.toFixed(2) 
}

function productDiscountedPrice()
{
  var op = item.productDiscountedPrice;
  return op.toFixed(2) 
}

function grossRevenue(){
  var op = item.productDiscountedPrice * item.currentGroupBuySize;
  return op.toFixed(2) 
}



  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    
      <View style={styles.userInfoSection}></View>
      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Text style={{ flex: 1 , fontWeight: "bold",}}>Product Name :</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>{item.productName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 , fontWeight: "bold" }}>Product Description :</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>
          {description}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1  ,fontWeight: "bold"}}>Original Price :</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>
            $ {productOriginalPrice()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 ,fontWeight: "bold" }}>Discounted Price :</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>
            $ {productDiscountedPrice()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 ,fontWeight: "bold"}}>Minimum Group Size : </Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>{item.productMinimumGroupSize}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 ,fontWeight: "bold"}}>Final Group Size : </Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>{item.currentGroupBuySize}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 ,fontWeight: "bold"}}>Start Data :</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>{dayjs(item.startDate).format("DD/MM/YYYY",{timeZone: "Asia/Singapore",})}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 ,fontWeight: "bold" }}>End Date :</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>{dayjs(item.endDate).format("DD/MM/YYYY",{timeZone: "Asia/Singapore",})}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 ,fontWeight: "bold" }}>Gross Revenue:</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>$ {grossRevenue()} </Text>
        </View>
        <View style={styles.row}>
          <Text
            style={{
              flex: 1,
              textDecorationLine: "underline",
              fontWeight: "bold",
            }}
          >
            Consumer information
          </Text>
        </View>


        <FlatList
                data={consumerListArray}
                keyExtractor={(item, index) => {
                  return item.consumerId;
                }}
                distance
                renderItem={({ item, index }) => {
                  return <ComsumerListCard item={item} />;
              }}
        />

        {/* <View style={styles.row}>
          <Text style={{ flex: 1 }}>name:</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>Rach</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 }}>contact number:</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}> 919298374</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1 }}>Address:</Text>
          <Text style={{ marginLeft: 20, flex: 1 }}>
            50 tagore Lane #B1-02 markono Districentre
          </Text>
        </View> */}


      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default CompletedGroupsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "center",
    // padding: 35,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
    display: "flex",
  },
});
