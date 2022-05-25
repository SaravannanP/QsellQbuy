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
  SafeAreaView,
  TextInput,
} from "react-native";
import firebase, { firestore } from "../../firebase/Firebase";
import * as Progress from 'react-native-progress';
import dayjs from "dayjs";
import RRCard from "../../components/RRCard";
import QACard from "../../components/QACard"

const ProductDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const  productLink = item.productId;
  const uri = item.productImageUrl;
  const userID = firebase.auth().currentUser.uid;

  // STATE HOOKS
  const [consumerId, setConsumerId] = useState("");
  const [productId, setProductId] = useState("");
  const [consumerAddress,setConsumerAddress] = useState("");
  const [consumerContactNumber,setConsumerContactNumber] = useState("");
  const [consumerName , setConsumerName] = useState("");
  const [count,setCount] = useState(0);
  const [reviewAndRatings,setReviewAndRatings] = useState([]);
  const [questionAndAnswer,setQuestionAndAnswer] = useState([]);
  const [currentGroupBuySize,setCurrentGroupBuySize] = useState(0);
  const [productMinimumGroupSize,setProductMinimumGroupSize] = useState(0);
  const [groupBuyProgress,setGroupBuyProgress] = useState(0);
  const [groupBuyId,setGroupBuyId] = useState("");
  const [endDate,setEndDate] = useState("");
  const [inWatchlist,setInWatchlist] = useState(false);
  const [inGroupBuy,setInGroupBuy] = useState(false);
  const [accountTotalBalance,setAccountTotalBalance] = useState(0);
  const [accountBalanceOnHold,setAccountBalanceOnHold] = useState(0);
  const [accountBalance,setAccountBalance] = useState(0);
  const [question,setQuestion] = useState("")

  useEffect(() => {
    console.log(item);
    setConsumerId(userID);
    setProductId(item.productId);
    getConsumerDetails();
    getGroupBuyDetails();
    checkIfInWatchList();
    checkIfUserInGroupBuy();
    getRAndR();
    getQAndA();
  }, []);


function getRAndR()
{
  var reviewAndRatingArray = [];
  firestore.collection('reviewsRatings').where('productId',"==",item.productId)
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        console.log('New RR: ', change.doc.data());
        let dict = {
          consumerId : change.doc.data().consumerId,
          consumerName : change.doc.data().consumerName,
          createdAt : change.doc.data().createdAt,
          rating : change.doc.data().rating,
          review : change.doc.data().review,
        }
        reviewAndRatingArray.push(dict);
      }
      if (change.type === 'modified') {
        console.log('Modified RR: ', change.doc.data());
      }
      if (change.type === 'removed') {
        console.log('Removed RR: ', change.doc.data());
      }
      setReviewAndRatings(reviewAndRatingArray)
    });
  });

}

function getQAndA()
{
const promises = [];
let questionsAnswers = [];
let questionsAnswersInfo;
firestore.collection("questions") /* get all the questions of the item */
  .where(
    "productId",
    "==",
    item.productId
  ) /* for these questions that have the same product id */
  .orderBy("createdAt", "desc") /* sort the questions by descending order */
  .get() /* get all the questions of the product */
  .then((questionData) => {
    if (questionData.docs[0] != null) {
      questionData.forEach((questionDoc) => {
        let promise = questionDoc.ref
          .collection("answers")
          .orderBy(
            "createdAt",
            "desc"
          ) /* sort the questions by descending order */
          .get()
          .then((answerData) => {
            if (answerData.docs[0] != null) {
              answerData.forEach((answerDoc) => {

                questionsAnswersInfo = {
                       questionId: questionDoc.id,
                       question: questionDoc.data().question,
                       createdAt: questionDoc.data().createdAt,
                       answerId:  answerDoc.id,
                       answer : answerDoc.data().answer
                        }

              });
              questionsAnswers.push({ ...questionsAnswersInfo });
            } else {
              questionsAnswersInfo = {
                questionId: questionDoc.id,
                question: questionDoc.data().question,
                createdAt: questionDoc.data().createdAt,
                //answerId:  answerDoc.id,
                answer : "There is no answer to this question"
                 }

              questionsAnswers.push({ ...questionsAnswersInfo });
            }
          })
          .catch((error) => {
            console.log(error.message)
          });

        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        console.log(questionsAnswers)
       setQuestionAndAnswer(questionsAnswers)
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

  // GET CURRENT CONSUMER DETAILS
async function getConsumerDetails () {
  const DetailsRef = firestore.collection('users').doc(userID);
  const doc = await DetailsRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Consumer data:', doc.data());
    setConsumerAddress(doc.data().address);
    setConsumerContactNumber(doc.data().contactNumber);
    setConsumerName(doc.data().firstName);
  }
  
}

  // GET GROUPBUY DETAILS OF THE PRODUCT
  async function getGroupBuyDetails(){
    var GroupBuyRef = firestore.collection('groupBuys');
    GroupBuyRef = GroupBuyRef.where('productId', '==', item.productId)
    GroupBuyRef = GroupBuyRef.where('groupBuyStatus','==','ongoing')
    const snapshot = await GroupBuyRef.get();

    if (snapshot.empty) {
      console.log('No groupBuy documents.');
      return;
    }  

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      console.log(doc.data().productMinimumGroupSize)
      console.log(doc.data().currentGroupBuySize)
      setProductMinimumGroupSize(doc.data().productMinimumGroupSize);
      setCurrentGroupBuySize(doc.data().currentGroupBuySize);
      setGroupBuyProgress((doc.data().currentGroupBuySize) / doc.data().productMinimumGroupSize)
      setEndDate(doc.data().endDate)
      setGroupBuyId(doc.id);
     
    });
  }

  async function checkIfUserInGroupBuy()
  {
        // const promises = [];
        // firestore.collection("groupBuys").where("productId","==",item.productId)
        // .onSnapshot(querySnapshot => {
        //   querySnapshot.docChanges().forEach(change => {
        //   let promise =  firestore.collection("groupBuys").doc(change.doc.id).collection("userJoinGroupBuy")
        //                       .where("consumerId","==",userID)
        //                       .get()
        //                       .then((userJoinGroupBuyData) => {
                                
        //                         userJoinGroupBuyData.forEach((userJoinGroupBuyDataDoc) =>{ 
        //                           console.log("Consumer in groupBuy")
        //                           setInGroupBuy(true);
        //                         })
                                
        //                       })
        //                       .catch((error) => {
        //                         Alert.alert(error)
        //                       })
        //                       promises.push(promise);
        //                       })
        //                       Promise.all(promises).then (() => {
                                
        //                       })
        // })


        const promises = [];
        firestore.collection("groupBuys").where("productId","==",item.productId)
        .onSnapshot(querySnapshot => {
          querySnapshot.docs.map(change => {
          let promise =  firestore.collection("groupBuys").doc(change.id).collection("userJoinGroupBuy")
                              .where("consumerId","==",userID)
                              .get()
                              .then((userJoinGroupBuyData) => {
                                if (userJoinGroupBuyData.docs[0] != null  && change.data().groupBuyStatus === "ongoing") {
                                
                                userJoinGroupBuyData.forEach((userJoinGroupBuyDataDoc) =>{ 
                                  console.log(change.data())
                                  console.log(userJoinGroupBuyDataDoc.data())
                                  console.log("Consumer in groupBuy")
                                  setInGroupBuy(true);
                                })
                              }
                              })
                              .catch((error) => {
                                Alert.alert(error)
                              })
                              promises.push(promise);
                              })
                              Promise.all(promises).then (() => {
                                
                              })
        })

      
  }
  


  function displayReviewsAndRatings()
  {
    return reviewAndRatings.length > 0 ? (
      
        <View style={styles.cardsWrapper}> 
            <FlatList
              data={reviewAndRatings}
              keyExtractor={(item, index) => {
                return item.consumerId;
              }}
              distance
              renderItem={({ item, index }) => {
                return <RRCard item={item} />;
              }}
            />
    </View>
      
    ): ( 
      <View style={styles.textContainer}>
      {/* <Text style={styles.emptyTitle}></Text> */}
      <Text style={styles.emptySubtitle}>No ReviewsAndRatings so far</Text>
    </View>
    )
  }
  
  async function postQuestion()
  {
    var date = new Date();
    var Created = convertUTCDateToLocalDate(date);
    const postQuestionRef = firestore.collection('questions').doc();
    
    const res = await postQuestionRef.set({
      consumerId : userID,
      createdAt :  (Created.toISOString()) ,
      productId : item.productId,
      question : question,
    });
    console.log("posted")
    setQuestion("");

  }

 
function displayQuestionAndAnswers()
{
  return questionAndAnswer.length > 0 ? (
   
    
    <View style={styles.cardsWrapper}> 
      <FlatList
        data={questionAndAnswer}
        keyExtractor={(item, index) => {
          return item.questionId;
        }}
        distance
        renderItem={({ item, index }) => {
          return <QACard item={item} />;
        }}
      />
                <TouchableOpacity
                       onPress={() => {
                      navigation.navigate("ChatScreenTwo", {
                      Link : item.productId,
                      });
                      }} 
                >
                  <Text style={{  textAlign: 'center',marginTop: 10,fontSize: 18, color: "green",fontWeight: "bold",textDecorationLine: 'underline'}}>Post Question</Text>
                </TouchableOpacity>
    </View>
    
    
    
  ):(
    <View style={styles.textContainer}>
      {/* <Text style={styles.emptyTitle}></Text> */}
      <Text style={styles.emptySubtitle}>No questions so far</Text>
      <View paddingVertical={10} />
      <TouchableOpacity
                       onPress={() => {
                      navigation.navigate("ChatScreenTwo", {
                      Link : item.productId,
                      });
                      }} 
                >
                  <Text style={{  textAlign: 'center',marginTop: 10,fontSize: 18, color: "green",fontWeight: "bold",textDecorationLine: 'underline'}}>Post Question</Text>
                </TouchableOpacity>
    </View>
    
  )
}


// if(ongoing groupbuy)
  // GB progress
  // join group 
  
 // if(noongoinggroupbuy)
 // create group
 // add to watchlist to be notified to join group
// STOPPED HERE!!!

function checkIfProductInGroupBuy()
{

  if(item.productStatus == "ongoingGroupBuy" )
  {
    return (
              <View>
                    <View style={{ alignItems: "center", marginHorizontal: 30 }}>
                    <Text style={styles.price}> Product currently in a GroupBuy</Text>
                    <View paddingVertical={10} />
                    <Progress.Bar progress={groupBuyProgress} width={200} />
                    <View paddingVertical={5} />
                    <Text>Minimum group size: {productMinimumGroupSize}</Text>
                    <Text>Current group size: {currentGroupBuySize}</Text>
                    <View paddingVertical={2} />
                    <Text style={styles.price}>Time left: {timeLeftDisplay()}</Text>
                    </View>
                    <View paddingVertical={7} />

                    {/* check if consumer already in the group */} 
                    {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                    {displayGroupBuyStatus()}
                    {/* <TouchableOpacity style={styles.shareButton} onPress={JoinGroup}>
                        <Text style={styles.shareButtonText}>Join Group</Text>
                    </TouchableOpacity>  */}

              </View>
          )
  }
  else if(item.productStatus == "noOngoingGroupBuy")
  {
    return (
      <View>
            <View style={{ alignItems: "center", marginHorizontal: 30 }}>
            
            <Text style={styles.price}>There is no Ongoing Groupbuy </Text>
            </View>


            {/* cehck if consumer added product to watchlist */}  
            {displayWatchListStatus()}
      </View>
    )

  }
}




// DICTATES IF THE ITEM IS IN THE USERS WATCHLIST
function displayWatchListStatus()
{
  if(inWatchlist)
  {
    return(
      <View style={{ alignItems: "center", marginHorizontal: 30 }}>
      <Text style={styles.errorMessage}>Product already in your WatchList</Text> 
      </View>
      )
  }
  else {
    return(
            <View>
          

            {/* CREATE GROUP */}
            {/* <TouchableOpacity style={styles.shareButton} onPress={CreateGroupBuy}>
            <Text style={styles.shareButtonText}>Create Group</Text>
            </TouchableOpacity> */}

            

            <TouchableOpacity style={styles.shareButton} onPress={addToWatchList}>
            <Text style={styles.shareButtonText}>Add To WatchList</Text>
            </TouchableOpacity>
            
            </View>
        
    )
  }
  
}


function displayGroupBuyStatus()
{
  if(inGroupBuy)
  {
    return(
      <View style={{ alignItems: "center", marginHorizontal: 30 }}>
      <Text style={styles.errorMessage}>You are already in the groupbuy</Text> 
      </View>
      )
  }
  else {
    return(
            <View>
              
                    <TouchableOpacity style={styles.shareButton} onPress={JoinGroup}>
                        <Text style={styles.shareButtonText}>Join Group</Text>
                    </TouchableOpacity> 
            
            </View>
        
          )
      }
}

async function checkIfInWatchList()
{
      var docRef = firestore.collection("watchlists");
      docRef = docRef.where("consumerId","==",userID)
      docRef = docRef.where("productId","==",item.productId)
      const snapshot = await docRef.get();
      if (snapshot.empty) {
        console.log('No matching documents.');
        
      }  
      
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        setInWatchlist(true); 
      });
 }

// CREATES A NEW DOCUMENT IN THE WATCHLIST COLLECTION 
  function addToWatchList() {
    const watchListRef = firestore.collection("watchlists").doc();
    watchListRef
      .set({
        consumerId: consumerId,
        productId: productId,
      })
      .then(function (docRef) {
        console.log("Document written with ID:", watchListRef.id);
        Alert.alert("Added to Watchlist Successfully", "", [
          { text: "Proceed", onPress: () => navigation.navigate("HomeScreen") }, // WatchListScreen
        ]);
      })
      .catch(function (error) {
        Alert.alert(error.message);
        console.log(error.message);
        console.error("error adding document: ", error);
      });
  }


  // CHECK USER ACCOUNT BALANCE
  async function checkBalance()
  {
    const DetailsRef = firestore.collection('users').doc(userID);
      const doc = await DetailsRef.get();
        console.log('Document data:', doc.data());
        setAccountBalance(doc.data().accountBalance)
  
  }// END CHECK ACCOUNT BALANCE


  
  // UPDATES CURRENT GROUPSIZE IN THE GROUPBUYS COLLECTION AND ADDS A NEW DOCUMENT IN THE USERJOINGROUPBUY COLLECTION
  async function JoinGroup()
  {
    
    // CHECK AND STORES USERS AVAILABLE ACCOUNT BALANCE
    //checkBalance();
    const DetailsRef = firestore.collection('users').doc(userID);
    const doc = await DetailsRef.get();
    console.log(accountBalance)

    // COMPARE USERS ACCOUNT BALANCE WITH THE ITEMS PRICE
    if((doc.data().accountBalance - doc.data().accountBalanceOnHold) < item.productDiscountedPrice)
    {
      return  Alert.alert("Insufficient funds please top up at profile page", "", [
        { text: "Proceed", onPress: () => navigation.navigate("HomeScreen") }, // WatchListScreen
      ]);
    }
    else {
    const joinGroupRef = firestore.collection("groupBuys").doc(groupBuyId);
    const doc = await joinGroupRef.get();
    if(!doc.exists)
    {
      console.log('No such document!');
      
    }
    else
    {
      // UPDATE CURRENT GROUP SIZE IN  THE COLLECTION IN THE DATABSE 
      firestore.collection("groupBuys").doc(groupBuyId).update({currentGroupBuySize : (doc.data().currentGroupBuySize + 1)})

      // CREATE A NEW DOCUMENT IN THE USER JOIN GROUP BUY COLLECTION IN THE GROUPBUYS COLLECTION IN THE DATABSE
      firestore.collection("groupBuys").doc(groupBuyId).collection("userJoinGroupBuy").doc(consumerId)
      .set({ 
        balanceHold: item.productDiscountedPrice,
        consumerAddress: consumerAddress,
        consumerContactNumber: consumerContactNumber,
        consumerId: consumerId,
        consumername : consumerName,
      })
      .catch(error => {
        Alert.alert('Error:', error.message)
      });
    }

    // REMOVE BALANCE FROM USER TABLE
    // need update balance on hold and available balance
    updateConsumerBalance();

    Alert.alert("Group joined Successfully", "", [
      { text: "Proceed", onPress: () => navigation.navigate("HomeScreen") }, // WatchListScreen
    ]);
  }
} // END JOIN GROUP



function millisecondsToTimeLeft(miliseconds) 
{
  var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;
  total_seconds = parseInt(Math.floor(miliseconds / 1000));
  total_minutes = parseInt(Math.floor(total_seconds / 60));
  total_hours = parseInt(Math.floor(total_minutes / 60));
  days = parseInt(Math.floor(total_hours / 24));

  seconds = parseInt(total_seconds % 60);
  minutes = parseInt(total_minutes % 60);
  hours = parseInt(total_hours % 24);
  return days + "day " + hours + "h " + minutes + "min " + seconds + "sec";
}// END MILLISECONDSTOTIMELEFT 

function timeLeft()
{
  if(dayjs(endDate) - dayjs() > 0)
  {
  return  dayjs(endDate) - dayjs()
  }
  else 
  {
    return 0
  }
} // END TIMELEFT

function timeLeftDisplay()
{

  if(endDate !== null && endDate !== undefined){ 
    return millisecondsToTimeLeft(timeLeft())
    }
    else {
      return "GroupBuy for this product has ended";
    }
} // END TIMELEFTDISPLAY

const convertUTCDateToLocalDate = (date) => {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  return newDate;   
} // CONVERT UTC TO SG LOCAL TIME


async function CreateGroupBuy()
{
// // CHECK IF CURRENT USER HAS ENOUGH MONEY 
    const DetailsRef = firestore.collection('users').doc(userID);
    const doc = await DetailsRef.get();
      console.log('Document data:', doc.data());

    // CHECKS IF AVAILABLE BALNCE IS MORE THAN THE PRICE OF THE PRODUCT
    if((doc.data().accountBalance - doc.data().accountBalanceOnHold) < item.productDiscountedPrice)
    {
      return  Alert.alert("Insufficient funds please top up at profile page", "", [
        { text: "Proceed", onPress: () => navigation.navigate("HomeScreen") }, // WatchListScreen
      ]);
    }

    else {
    const groupBuyRef = firestore.collection("groupBuys").doc();
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
      .collection("groupBuys")
      .doc(groupBuyRef.id)
      .collection("userJoinGroupBuy")
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

        //need to update products table 
      updateProductsTable();

      //need update balance on hold and available balance
      updateConsumerBalance();

    Alert.alert("GroupBuy created Successfully", "", [
      { text: "Proceed", onPress: () => navigation.navigate("HomeScreen") }, // HomeScreen
    ]);
    })
    .catch(function (error) {
      Alert.alert(error.message);
      console.error("error adding document: ", error.message);
    });

    
  } // END ELSE

  
} // END CREATEGROUPBUY



// UPDATE PRODUCT STATUS OF ITEM IN PRODUCT TABLE
async function updateProductsTable(){
  const productRef = firestore.collection('products').doc(item.productId);
  const res = await productRef.update({productStatus: "ongoingGroupBuy"});
}// END UPDATE PRODUCT STATUS OF THE ITEM


//  UPDATE CONSUMER ACCOUNT BALANCE
async function updateConsumerBalance()
{
  const joinGroupRef = firestore.collection('users').doc(userID);
  const doc = await joinGroupRef.get();
  if(!doc.exists)
  {
    console.log('No such document!');
  }
    else
  {
    // setAccountTotalBalance(doc.data().accountBalance - item.productDiscountedPrice);
    // setAccountBalanceOnHold(doc.data().accountBalanceOnHold + item.productDiscountedPrice)
    const productRef = firestore.collection('users').doc(userID);
    const res = await productRef.update({accountBalanceOnHold: (doc.data().accountBalanceOnHold + item.productDiscountedPrice) });
    //, accountBalance:(doc.data().accountBalance - item.productDiscountedPrice)
  }
} // END  UPDATECONSUMER BALANCE

// DISPLAY PERCENTAGE OFF
  var num = (((item.productOriginalPrice - item.productDiscountedPrice) / item.productOriginalPrice) * 100 );
  var n = num.toFixed(0)

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      
        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          <Image style={styles.productImg} source={{ uri: uri }} />
           <TouchableOpacity   onPress={() => {
            navigation.navigate("MerchantProfileView", {
            item,
            });
          }} >
            <Text style={{  marginTop: 10,fontSize: 18, color: "green",fontWeight: "bold",textDecorationLine: 'underline'}}>Merchant Profile</Text>
          </TouchableOpacity> 

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
          <Text> {n} % off </Text>
          <Text>Product Description</Text>
          <Text style={styles.description}>{item.productDescription}</Text>
          {/* <Text style={styles.price}>{item.productStatus}</Text> */}
        </View>
        <View style={styles.separator}></View>
        
        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
        <Text style={styles.name}>Review and Ratings</Text>
        {displayReviewsAndRatings()}
        </View>

        <View style={styles.separator}></View>

        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
        <Text style={styles.name}>Questions and Answers</Text>
        {displayQuestionAndAnswers()}
        </View>
        
        <View style={styles.separator}></View>

        <View style={styles.addToCarContainer}>

        {/* Determines between the Add to watchtlist button and join group button */}
        {checkIfProductInGroupBuy()}

        </View>
        <View paddingVertical={10} />
    
    </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;

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
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%"
  },
  emptyTitle: {
    fontSize: 32,
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 18,
    fontStyle: "italic",
    color: "red",
  },
  errorMessage: {
    marginTop: 10,
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  cardsWrapper: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#0d56d9',
    backgroundColor: '#0d56d9',
    padding: 15,
    margin: 5
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center'
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20
  }
});

