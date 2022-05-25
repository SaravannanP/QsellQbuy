import React, { Component, useState,useEffect } from "react";
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
  TextInput,
  SafeAreaView,
} from "react-native";

import firebase, { firestore } from "../../firebase/Firebase";
import StarRating from 'react-native-star-rating';

function RatingsReviewScreen ({ route }) {
  //const itemData = route.params.itemData;

  const { item } = route.params;
  const [review,setReview] = useState("");
  const [rating,setRating] = useState(0);
  const [consumerName , setConsumerName] = useState("");
  const [reviewRatingStatus,setReviewRatingStatus] = useState("");
  const userID = firebase.auth().currentUser.uid;
  //const [userId,setUserId] = useState("");
  
  useEffect(() => {
    console.log(item);
    getConsumerDetails();
    checkIfRatingGiven();
  }, []);

  async function getConsumerDetails () {
    
    const DetailsRef = firestore.collection('users').doc(userID);
    const doc = await DetailsRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      //setConsumerAddress(doc.date().address);
      //setConsumerContactNumber(doc.data().contactNumber);
      setConsumerName(doc.data().firstName);
    }
  }


function checkIfRatingGiven(){

    // const docRef = firestore.collection('transactions').where("consumerId","==",userID).where("groupBuyId","==",item.groupBuyId);
    //     // docRef = docRef.where("consumerId","==",userID)
    //     // docRef = docRef.where("groupBuyId","==",item.groupBuyId);               
                            
    //   const doc = await docRef.get();
    //   if (!doc.exists) {
    //     console.log('No such document!!!');
    //   } else {
    //     console.log('Document data retrieved:', doc.data());
    //     setReviewRatingStatus(doc.data().reviewRatingStatus)
    //   } 


          firestore.collection('transactions').where("consumerId","==",userID).where("groupBuyId","==",item.groupBuyId)
          .onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                console.log(change.doc.data());
                setReviewRatingStatus(change.doc.data().reviewRatingStatus)
            });
          });
  }

function conditionalRendering(){
  console.log(reviewRatingStatus)
  if(reviewRatingStatus == "given")
  {
    return (
      <View style={styles.textContainer}>
          <Text style={styles.emptyTitle}>Product Reviewed</Text>
          <Text style={styles.emptySubtitle}>Review another product</Text>
      </View>
    )
  }
  else if (reviewRatingStatus == "notGiven")
  {
    return (

      <View>
          <View style={styles.starContainer}>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            selectedStar={(newRating) => {setRating(newRating)}}
          />
        </View>

        <View style={styles.action}>
          <TextInput
            placeholder="Review"
            placeholderTextColor="#666666"
            autoCorrect={false}
            numberOfLines={6}
            style={styles.input}
            multiline={true}
            value={review}
            onChangeText={(newReview) => {
              setReview(newReview);
            }}
          />
        </View>

        <View style={styles.addToCarContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={submitReviewRating}>
            <Text style={styles.shareButtonText}>Submit</Text>
          </TouchableOpacity>
        </View> 
    </View>
      
    )
  }

}




// SUBMITS FUNCTION THAT ADDS  NEW DOCUMENT TO RATING AND REVIEW COLLECTION
async function submitReviewRating() {
    //const userId = firebase.auth().currentUser.uid;
    // ADD NEW DOCUMENT TO REVIEW AND RATING COLLECTION
    var date = new Date();
    var Created = convertUTCDateToLocalDate(date);
    const rrRef = firestore.collection("reviewsRatings").doc()
    const ref = await rrRef.set(
      {
        consumerId: userID,
        consumerName : consumerName,
        createdAt: (Created.toISOString()),
        groupBuyId: item.groupBuyId,
        productId: item.productId,
        rating : rating,
        review : review,
      }
    
    )
    // UPDATE REVIEW AND RATING STATUS IN TRANSACTIONS TABLE
    const transactionRef = firestore.collection('transactions')
                                    .where("consumerId","==",userID)
                                    .where("groupBuyId","==",item.groupBuyId);

    // Set the 'reviewRatingStatus' field of the transaction document to 'given'
    const res = await transactionRef.update({ reviewRatingStatus: "given"});

    
    Alert.alert("Review and rating Successful", "", [
      { text: "Proceed", onPress: () => navigation.navigate("CompletedGroupsScreen") },
    ]);
  }


// RETURNS DATE STRING FOR CREATED AT 
  const convertUTCDateToLocalDate = (date) => {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    return newDate;   
}

  return ( 
      <View style={styles.container}>
        {/* <ScrollView> */}
        {/* <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          <Image style={styles.productImg} source={itemData.image} />
          <Text style={styles.name}>{itemData.title}</Text>
          <Text style={styles.price}>${itemData.discountedprice}</Text>
          <Text
            style={{
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            }}
          >
            original price: ${itemData.originalprice}
          </Text>
          <Text>{itemData.offer}% offer</Text>
          <Text>Product Description</Text>
          <Text style={styles.description}>{itemData.description}</Text>
        </View> */}
                {conditionalRendering()}
        {/* <View style={styles.starContainer}>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={rating}
            selectedStar={(newRating) => {setRating(newRating)}}
          />
        </View>

        <View style={styles.action}>
          <TextInput
            placeholder="Review"
            placeholderTextColor="#666666"
            autoCorrect={false}
            numberOfLines={6}
            style={styles.input}
            multiline={true}
            value={review}
            onChangeText={(newReview) => {
              setReview(newReview);
            }}
          />
        </View>

        <View style={styles.addToCarContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={submitReviewRating}>
            <Text style={styles.shareButtonText}>Submit</Text>
          </TouchableOpacity>
        </View> */}

        {/* </ScrollView> */}
      </View>
    
  );
};

export default RatingsReviewScreen;

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
  input: {
    //width: 200,
    //borderBottomColor: "red",
    //borderBottomWidth: 1,
    textAlignVertical: "top",
  },
  action: {
    //flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
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


