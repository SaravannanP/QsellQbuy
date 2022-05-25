import React, { Component, useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import Swiper from "react-native-swiper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontiso from "react-native-vector-icons/Fontisto";
import firebase, { firestore } from "../../firebase/Firebase";
//import StarRating from "../Components/StarRating";
import HomeCard from "../../components/HomeCard";
import CardListScreen from "../consumer/CardListScreen"

// HOMESCREEN FUNCTION
const HomeScreen = ({ navigation }) => {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 7 }}>
          <Fontiso.Button
            name="favorite"
            size={23}
            backgroundColor="#0d56d9"
            onPress={() => {
              navigation.navigate("WatchListScreen");
            }}
          />
        </View>
      ),
      headerLeft: () => (
        <View style={{ marginLeft: 10 }}>
          <SimpleLineIcons.Button
            name="logout"
            size={23}
            backgroundColor="#0d56d9"
            onPress={() => {
              signOutUser();
            }}
          />
        </View>
      ),
    });
  });


  
  const signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (e) {
      console.log(e);
    }
  };


//  FIRST
useEffect (() => {
  getproducts();
 },[])


 //  FETCH ALL THE DATA FROM FIRESTORE  AND STORE INTO PRODUCT ARRAY 
 function getproducts()
 {
  let dict;
  let productArray = [];
      firestore.collection('products').where("productStatus","!=","sold").onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            console.log('New product: ', change.doc.data());
                dict = { ...change.doc.data(), productId: change.doc.id }; //EXTRAXT DOCUMENT DATA AND ID INTO A TEMP VARIABLE
                 productArray.push(dict); // PUSHES DATA FROM THE TEMP VARIABLE INTO ARRAY 
                 
          }
          // if (change.type === 'modified') {
          //   console.log('Modified product: ', change.doc.data());
          //        dict = {...change.doc.data(), productId: change.doc.id }; //EXTRAXT DOCUMENT DATA AND ID INTO A TEMP VARIABLE
          //        productArray.push(dict); // PUSHES DATA FROM THE TEMP VARIABLE INTO ARRAY 
          //        setFilteredDataSource(productArray); // STORES THE DATA INTO FILTEREDDATA SOURCE
          //        setMasterDataSource(productArray); // STORE THE DATA INTO MASTERED DATA SOURCE 

          // }
          // if (change.type === 'removed') {
          //   console.log('Removed product: ', change.doc.data());
          // }
        });
                 setFilteredDataSource(productArray); // STORES THE DATA INTO FILTEREDDATA SOURCE
                 setMasterDataSource(productArray); // STORE THE DATA INTO MASTERED DATA SOURCE 

      });
    

 }

// SECOND 
// FILTERS THE RESULTS BASED ON SEARCH INPUT 
const searchFilterFunction = (text) => {
  // Check if searched text is not blank
  if (text) {
    // Inserted text is not blank
    // Filter the masterDataSource
    // Update FilteredDataSource
    const newData = masterDataSource.filter(
      function (item) {
        const itemData = item.productName
          ? item.productName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    setFilteredDataSource(newData);
    setSearch(text);
  } else {
    // Inserted text is blank
    // Update FilteredDataSource with masterDataSource
    setFilteredDataSource(masterDataSource);
    setSearch(text);
  }
};

const getItem = (item) => {
  // Function for click on an item
  alert('Id : ' + item.merchantId + ' productName : ' + item.productName);
};

const ItemView = ({item}) => {
  return (
    <HomeCard
          item={item}
          onPress={() => {
          navigation.navigate("ProductDetailsScreen", {
          item,
          });
          }}
    />
  );
};

const ItemSeparatorView = () => {
  return (
    // Flat List Item Separator
    <View
      style={{
        height: 10,
        width: '100%',
        backgroundColor: '#eee',
      }}
    />
  );
};



return (
  <SafeAreaView style={styles.container}>
  <ScrollView showsVerticalScrollIndicator={false}>
  
  <View paddingVertical={5} />
      {/* SEARCH BAR */}
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search Here"
      />
      <View paddingVertical={5} />
            <View style={styles.sliderContainer}>
              <Swiper height={200} autoplay horizontal={false} /*activeDotColor*/>
                <View style={styles.slide}>
                    <Image
                      source={require("../../../assets/shirt.jpg")}
                      resizeMode="cover"
                      style={styles.sliderImage}
                    />
                  </View>
                  <View style={styles.slide}>
                    <Image
                      source={require("../../../assets/shirt2.jpg")}
                      resizeMode="cover"
                      style={styles.sliderImage}
                    />
                  </View>
                  <View style={styles.slide}>
                    <Image
                      source={require("../../../assets/ladyFashion.jpg")}
                    resizeMode="cover"
                      style={styles.sliderImage}
                    />
                  </View>
                </Swiper>
            </View>
        
      <View paddingVertical={10} />
        {/* Category Buttons */}
        <View style={[styles.categoryContainer, {marginTop:10}]}>
        {/* navigation.navigate('CardListScreen', {title: 'Restaurant'}) */}
                      <TouchableOpacity style={styles.categoryBtn} onPress={()=> { navigation.navigate('CardListScreen', {title: 'fashion'})} }>
                      <View style={styles.categoryIcon}>
                          <MaterialCommunityIcons name= "hanger" size={35} color="#0d56d9" />
                      </View>
                      <Text style={styles.categoryBtnTxt}>Fashion</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.categoryBtn} onPress={()=> { navigation.navigate('CardListScreen', {title: 'electronics'})} }>
                      <View style={styles.categoryIcon}>
                          <MaterialCommunityIcons name= "lightbulb" size={35} color="#0d56d9" />
                      </View>
                      <Text style={styles.categoryBtnTxt}>Electronics</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.categoryBtn} onPress={()=> { navigation.navigate('CardListScreen', {title: 'household'})} }>
                      <View style={styles.categoryIcon}>
                          <MaterialCommunityIcons name= "home-variant" size={35} color="#0d56d9" />
                      </View>
                      <Text style={styles.categoryBtnTxt}>HouseHold</Text>
                      </TouchableOpacity>
                  
        </View>
        <View paddingVertical={10} />
            <FlatList
              numColumns = {2}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              //contentContainerStyle={styles.flatlist}
              data={filteredDataSource}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={ItemView}             
            />  
    
   
  </ScrollView>
  </SafeAreaView>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24, //padding from the top
    //alignItems: 'center',
    justifyContent: 'center'
  },
  sliderContainer: {
    height: 200,
    width: "90%",
    marginTop: 10,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 8,
  },

  wrapper: {},

  slide: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  sliderImage: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 10,
  },
  categoryBtn: {
    flex: 1,
    width: "30%",
    marginHorizontal: 0,
    alignSelf: "center",
  },
  categoryIcon: {
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: 70,
    height: 70,
    backgroundColor: "#f1faff" /* '#0d56d9' */,
    borderRadius: 50,
  },
  categoryBtnTxt: {
    alignSelf: "center",
    marginTop: 5,
    color: "#0d56d9",
  },
  cardsWrapper: {
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  card: {
    height: 100,
    marginVertical: 10,
    flexDirection: "row",
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#fff",
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardDetails: {
    fontSize: 12,
    color: "#444",
  },
  list: { 
  paddingHorizontal: 20, 
  marginTop: 20, 
  flexDirection: 'row', 
  flexWrap: 'wrap', 
  justifyContent: 'space-between',
},
 flatlist:{
  shadowColor: "#999",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
 }
});

export default HomeScreen;
