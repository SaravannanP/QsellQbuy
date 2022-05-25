import React, { Component ,useEffect,useState} from "react";
import { View, Text, StyleSheet, Alert,FlatList,ScrollView,SafeAreaView } from "react-native";
import CompletedProductsCard from "../../components/CompletedProductsCard"
import firebase, { firestore } from "../../firebase/Firebase";

function CompletedProductsScreen ({navigation}){
  const [transactionHistoryList, setTransactionHistoryList] = useState([]);


  useEffect(() => {
    const db = firestore;
    const promises = [];
    let groupBuys = [];
    const userID = firebase.auth().currentUser.uid;

    db.collection("products")
    .where("merchantId", "==", userID)
    .get()
    .then((productData) => {
        productData.forEach((productDoc) => {
          let promise = db
            .collection("groupBuys")
            .where("productId", "==", productDoc.id)
            .where("groupBuyStatus", "==", "completed")
            .get()
            .then((groupBuyData) => {
              
                groupBuyData.forEach((groupBuyDoc) => {
                  console.log(groupBuyDoc.data())
                  groupBuys.push({
                    groupBuyId: groupBuyDoc.id,
                    ...groupBuyDoc.data(),
                    ...productDoc.data().productOriginalPrice,
                  });
                });
              
            })
            .catch((error) => {
              Alert.alert(error)
              });
              promises.push(promise);
            });
        Promise.all(promises).then(() => {
          setTransactionHistoryList(groupBuys)
        });
    })



  },[]);

  return transactionHistoryList.length > 0 ? (
    // <SafeAreaView style={styles.container}>

    <ScrollView>

    <View style={styles.cardsWrapper}>
      <FlatList
        data={transactionHistoryList}
        keyExtractor={(item, index) => {
          return item.groupBuyId;
        }}
        distance
        renderItem={({ item, index }) => {
          return <CompletedProductsCard item={item} 
            onPress={() => {
            navigation.navigate("CompletedGroupsScreen", {
            item,
            });
          }} 
            />;
        }}
      />
      </View>
   
    </ScrollView>

    // </SafeAreaView>
  ) : (
    <View style={styles.textContainer}>
      <Text style={styles.emptyTitle}>No Completed products</Text>
      {/* <Text style={styles.emptySubtitle}></Text> */}
    </View>
  );
  
}
export default CompletedProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
