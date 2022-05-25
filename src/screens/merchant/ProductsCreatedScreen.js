
// @refresh reset


import React, { Component, useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
//import ButtonWithBackground from "../components/ButtonWithBackground";
//import Images from "../const/Images";
//import GroupItem from "../components/GroupsItems";
import firebase, { firestore } from "../../firebase/Firebase";
import { ScrollView } from "react-native-gesture-handler";
import MerchantsProductListCard from "../../components/MerchantsProductListCard";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";


function ProductsCreatedScreen ({ navigation }) {
  // const [groups, setGroups] = useState([]);
  // Top Bar
  
  const [products, setProducts] = useState([]);
  const [arrayLength,setArrayLength] = useState(products.length);
  const userID = firebase.auth().currentUser.uid;

  useEffect(() => {
    
    // const unsubscribe = firestore.collection("products")
    //                             .where("merchantId","==",userID)
    //                             // .where("productStatus","!=","sold")
    //                     .onSnapshot(querySnapshot => {
    //                       const productsData = querySnapshot.docs.map(documentSnapshot => {
    //                         return{
    //                           ...documentSnapshot.data(),productId: documentSnapshot.id 
    //                         }
    //                       })
    //                       setProducts(productsData)
    //                     } 
    //                       )
    //                       return () => unsubscribe();

    getProducts();
    }, []);


function getProducts()
{
  firestore.collection("products").where("merchantId","==",userID)
                                // .where("productStatus","!=","sold")
                        .onSnapshot(querySnapshot => {
                          const productsData = querySnapshot.docs.map(documentSnapshot => {
                            return{
                              ...documentSnapshot.data(),productId: documentSnapshot.id 
                            }
                          })
                          setProducts(productsData)
                        } 
                          )
}



  return products.length > 0 ? (
    // <SafeAreaView style={styles.container}>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        <View style={styles.cardsWrapper}>
          <FlatList
            data={products}
            keyExtractor={(item, index) => "key" + index}
            distance
            renderItem={({ item }) => {
              return (
                <MerchantsProductListCard
                  item={item}
                  onPress={() => {
                    navigation.navigate("MerchantProductDetailsScreen", {
                      item,
                    });
                  }}
                />
              );
            }}
          />
        </View>
    </ScrollView>
    // </SafeAreaView>
  ) : (

    <SafeAreaView style={styles.textContainer}>
      <Text style={styles.emptyTitle}>No products Created</Text>
      <Text style={styles.emptySubtitle}>
        Add a new product using the + button above
      </Text>
    </SafeAreaView>
  );
}
export default ProductsCreatedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24, //padding from the top
  },
  cardsWrapper: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
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
});
