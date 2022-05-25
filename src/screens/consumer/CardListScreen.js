import React,{useEffect,useState}from "react";
import { View, Text, Button, StyleSheet,ScrollView,SafeAreaView, TextInput, FlatList, } from "react-native";
import firebase, { firestore } from "../../firebase/Firebase";
//import { FlatList } from "react-native-gesture-handler";
import HomeCard from "../../components/HomeCard";


const CardListScreen = ({ route, navigation }) => {
  const { title } = route.params;
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect (() => {
    // const db = firestore;
    //fetchData();
   getproducts();
  
   },[])

async function fetchData()
{
   let dict;
    let productArray = [];
  
          var searchRef = firestore.collection('products').where("productCategory","==",title);
          const snapshot = await searchRef.get();
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        dict = { ...doc.data(), productId: doc.id }; //EXTRAXT DOCUMENT DATA AND ID INTO A TEMP VARIABLE
        productArray.push(dict); // PUSHES DATA FROM THE TEMP VARIABLE INTO ARRAY 
        setFilteredDataSource(productArray); // STORES THE DATA INTO FILTEREDDATA SOURCE
        setMasterDataSource(productArray); // STORE THE DATA INTO MASTERED DATA SOURCE 
      })
      
    
}


// where("productStatus","!=","sold")
// where("productCategory","==",title)
//  FETCH ALL THE DATA FROM FIRESTORE  AND STORE INTO PRODUCT ARRAY 
function getproducts()
{
 let dict;
 let productArray = [];
     firestore.collection('products').where("productCategory","==",title)
     .onSnapshot(querySnapshot => {
       querySnapshot.docChanges().forEach(change => {
         if (change.type === 'added' && change.doc.data().productStatus !== "sold") {
            
              console.log('New product: ', change.doc.data());
                dict = { ...change.doc.data(), productId: change.doc.id }; //EXTRAXT DOCUMENT DATA AND ID INTO A TEMP VARIABLE
                productArray.push(dict); // PUSHES DATA FROM THE TEMP VARIABLE INTO ARRAY 
                // setFilteredDataSource(productArray); // STORES THE DATA INTO FILTEREDDATA SOURCE
                // setMasterDataSource(productArray); // STORE THE DATA INTO MASTERED DATA SOURCE 
            
                
          
          }

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




  // const renderItem = ({ item }) => {
  //   return (
  //     <Card
  //       itemData={item}
  //       onPress={() =>
  //         navigation.navigate("ProductDetailsScreen", { itemData: item })
  //       }
  //     />
  //   );
  // };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
   
      

      {/* SEARCH BAR */}
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search Here"
      />

      <View paddingVertical={10} />
      {/* <Text>{title}</Text> */}

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

export default CardListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24, //padding from the top
    // alignItems: "center",
    justifyContent: "center",
  },
});



