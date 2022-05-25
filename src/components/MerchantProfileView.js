import React ,{useEffect,useState}from "react";
import { 
    View,
    Text,
    StyleSheet,
    SafeAreaView,u
} from "react-native";
import { firestore } from "../firebase/Firebase";
//import { SafeAreaView } from "react-native-safe-area-context";

const MerchantProfileView = ({ route, navigation }) => 
{

    const { item } = route.params;
    const [merchantName,setMerchantName] = useState("");
    const [email,setEmail] = useState("");
    const [contactNumber,setContactNumber] = useState("");
    const [address,setAddress] = useState("")

    useEffect(() => {
        getMerchantDetails();
      }, []);
    
async function getMerchantDetails()
{
    var docRef = firestore.collection("users").doc(item.merchantId);

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        setMerchantName(doc.data().firstName + " " + doc.data().lastName);
        setEmail(doc.data().email);
        setContactNumber(doc.data().contactNumber);
        setAddress(doc.data().address);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
}



return(
    <SafeAreaView style={styles.container}>


  <View style={styles.userInfoSection}></View>
  <View style={styles.userInfoSection}>
        <View style={styles.row}>
        <Text style={{ flex: 1 , fontWeight: "bold"}}>Merchant Name :</Text>
        <Text style={{ marginLeft: 20, flex: 1 }}>{merchantName}</Text>
        </View>
        <View style={styles.row}>
        <Text style={{ flex: 1 , fontWeight: "bold"}}>Email :</Text>
        <Text style={{ marginLeft: 20, flex: 1 }}>{email}</Text>
        </View>
        <View style={styles.row}>
        <Text style={{ flex: 1 , fontWeight: "bold"}}>Contact Number :</Text>
        <Text style={{ marginLeft: 20, flex: 1 }}>{contactNumber}</Text>
        </View>
        <View style={styles.row}>
        <Text style={{ flex: 1 , fontWeight: "bold"}}>Address :</Text>
        <Text style={{ marginLeft: 20, flex: 1 }}>{address}</Text>
        </View>
  </View>

</SafeAreaView>    
)


}
export default MerchantProfileView;

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