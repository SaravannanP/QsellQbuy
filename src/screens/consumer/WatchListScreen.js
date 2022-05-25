import React, { useEffect, useState,useRef} from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import firebase, { firestore } from "../../firebase/Firebase";
import Card from "../../components/Card"

export default function WatchListScreen({ navigation }) {
  const [watchList, setWatchlist] = useState([]);
  const [arraylength,setArrayLength] = useState(0);

  useEffect(() => {
    productsInWatchList();
}, []);

function productsInWatchList()
{
    let watchListArray = [];
     const promises = [];
    const userID = firebase.auth().currentUser.uid;
    let watchlist;
    firestore.collection("watchlists").where("consumerId", "==", userID)
                        .onSnapshot(querySnapshot => {
                          if (querySnapshot.empty) {
                            console.log("no documents found");
                                } else {
                                  querySnapshot.docs.map(documentSnapshot => {
                                   // console.log(documentSnapshot.data())
                                   // console.log(documentSnapshot.id)
                                          let promise = firestore
                                              .collection("products")
                                              .doc(documentSnapshot.data().productId)
                                              .get()
                                              .then((productDoc) => {
                                                watchlist = 
                                                {
                                                  ...productDoc.data(),
                                                  watchListId: documentSnapshot.id,
                                                  ...documentSnapshot.data(),
                                                }
                                              //   console.log(watchlist)
                                              watchListArray.push(watchlist);                                               
                                  })
                                  
                                  .catch((errors) => {
                                    console.log(errors);
                                  });
                                  promises.push(promise);
                                })
                                  Promise.all(promises).then((result) => {
                                          console.log("WatchListArray")
                                          console.log(watchListArray)
                                          setWatchlist(watchListArray);
                                          watchListArray = [];
                                          watchlist = "";                                
                                          //setArrayLength(watchListArray.length);
                                        });
                                }// END ELSE
                              })
                                
}


  return watchList.length > 0 ? (
    <SafeAreaView style={StyleSheet.container}>
    <ScrollView>
    
    <View style={styles.cardsWrapper}>
      <FlatList
        data={watchList}
        keyExtractor={(item, index) => {
          return item.watchListId;
        }}
        distance
        renderItem={({ item, index }) => {
          return <Card item={item}  onPress={() => {
            navigation.navigate("WatchListDetailsScreen", {
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
      <Text style={styles.emptyTitle}>No products in Watchlist</Text>
      <Text style={styles.emptySubtitle}>Add a new product</Text>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },cardsWrapper: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  cardsWrapper: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
});
