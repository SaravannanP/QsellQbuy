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


const MerchantProductDetailsScreen = ({ route, navigation }) => {
  const itemData = route.params.itemData;
  const { item } = route.params;
  const uri = item.productImageUrl;
  const userID = firebase.auth().currentUser.uid;
  // STATE HOOKS
  const [consumerId, setConsumerId] = useState("");
  const [productId, setProductId] = useState("");
  const [productStatus,setProductStatus] = useState("");
  const [reviewAndRatings,setReviewAndRatings] = useState([]);
  const [questionAndAnswer,setQuestionAndAnswer] = useState([]);
  const [currentGroupBuySize,setCurrentGroupBuySize] = useState(0);
  const [productMinimumGroupSize,setProductMinimumGroupSize] = useState(0);
  const [groupBuyProgress,setGroupBuyProgress] = useState(0);
  const [groupBuyId,setGroupBuyId] = useState("");
  const [endDate,setEndDate] = useState("");
  
  useEffect(() => {
    console.log(item);
    setConsumerId(userID);
    setProductId(item.productId);
    setProductStatus(item.productStatus);
    getRAndR();
    getQAndA();
    getGroupBuyDetails();

    const doc = firestore.collection('products').doc(item.productId);
    const observer = doc.onSnapshot(docSnapshot => {
      setProductStatus(docSnapshot.data().productStatus);
      console.log("test")
    }, err => {
      console.log(`Encountered error: ${err}`);
    });

observer();
  }, []);



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
    checkIfUserInGroupBuy(doc.id);
  });
}




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
            return <QACard item={item} onPress={() => {
              navigation.navigate("ChatScreen", {
              item,
              });
              }} />;
          }}
        />
      </View>
      
  
      
    ):(
      <View style={styles.textContainer}>
        {/* <Text style={styles.emptyTitle}></Text> */}
        <Text style={styles.emptySubtitle}>No questions so far</Text>
        <View paddingVertical={10} />
        {/* <TextInput
                style={styles.textInput}
                autoCorrect={false}
                placeholder="Post a Question"
                maxLength={50}
                value = {question}
                onChangeText= {(newQuestion) => setQuestion(newQuestion)}
                //onEndEditing={onValidateTextField}
              />
                  <TouchableOpacity
                    style={styles.saveButton} onPress={postQuestion}
                  >
                    <Text style={styles.saveButtonText}>Post Question</Text>
                  </TouchableOpacity> */}
      </View>
      
    )
  }

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



function checkGroupBuyStatus () {

if(productStatus == "ongoingGroupBuy")
{
    return(
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
    )
}
else {
        if(productStatus == "sold")
        {
          return(
            <View>
            <TouchableOpacity style={styles.shareButton} onPress={autoSellProduct}>
                    <Text style={styles.shareButtonText}>Autosell Product</Text>
            </TouchableOpacity>
    
    
            <TouchableOpacity style={styles.shareButton} onPress={deleteProduct}>
                    <Text style={styles.shareButtonText}>Delete Product</Text>
            </TouchableOpacity>
            </View>
          )

        }
        else if(productStatus == "noOngoingGroupBuy") 
        {
          return(
            <View>    
            <TouchableOpacity style={styles.shareButton} onPress={deleteProduct}>
                    <Text style={styles.shareButtonText}>Delete Product</Text>
            </TouchableOpacity>
            </View>
          )
        }

     

    }

}


 async function deleteProduct() {
  console.log(item.productId)
  const res = await firestore.collection("products").doc(item.productId).delete();
  Alert.alert("Product Deleted  Successfully", "", [
    { text: "Proceed", onPress: () => navigation.navigate("MerchantDashboardScreen") },
  ]);


  }

  async function autoSellProduct(){
  const productRef = firestore.collection("products").doc(item.productId);

  // Set the 'capital' field of the city
  const res = await productRef.update({ productStatus: "noOngoingGroupBuy"});
  Alert.alert("Product renewed  Successfully", "", [
    { text: "Proceed", onPress: () => navigation.navigate("MerchantDashboardScreen") },
  ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barstyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          <Image style={styles.productImg} source={{ uri: uri }} />
          <Text style={styles.name}>{item.productName}</Text>
          {/* <Text style={styles.name}>{item.id}</Text> */}
          <Text style={styles.price}>${item.productDiscountedPrice}</Text>
          <Text
            style={{
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            }}
          >
            original price: ${item.productOriginalPrice}
          </Text>
          <Text> % offer</Text>
          <Text>Product Description</Text>
          <Text style={styles.description}>{item.productDescription}</Text>
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
          {/* <TouchableOpacity style={styles.shareButton} onPress={deleteProduct}>
            <Text style={styles.shareButtonText}>Delete Product</Text>
          </TouchableOpacity> */}
          {checkGroupBuyStatus()}

        </View>

        <View style={styles.separator}></View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default MerchantProductDetailsScreen;

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

