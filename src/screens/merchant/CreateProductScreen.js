import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Picker,
  Alert,
  SafeAreaView,
  TextInput,
  Platform,
} from "react-native";

import CustomTextField from "../../components/CustomTextField";
import Button from "../../components/Button";
import Strings from "../../const/Strings";
import Utility from "../../utils/Utility";
import firebase, { firestore } from "../../firebase/Firebase";
import * as ImagePicker from "expo-image-picker";
import Constants from "../../const/Constants";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { RadioButton } from "react-native-paper";
// CREATE PRODUCT FUNCTION
function CreateProductScreen({ navigation }) {
  // STATE HOOKS
  const [image, setImage] = useState(
    "https://kangstkd.net/wp-content/uploads/2017/04/default-image-620x600.jpg"
  );

  const [productName, setProductName] = useState("");
  const [productNameError, setProductNameError] = useState("");

  const [productDescription, setProductDescription] = useState("");
  const [productDescriptionError, setProductDescriptionError] = useState("");

  const [productDiscountedPrice, setProductDiscountedPrice] = useState("");
  const [
    productDiscountedPriceError,
    setProductDiscountedPriceError,
  ] = useState("");

  const [productOriginalPrice, setProductOriginalPrice] = useState("");
  const [productOriginalPriceError, setProductOriginalPriceError] = useState(
    ""
  );

  const [fieldError, setFieldError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productImageURL, setProductImageURL] = useState("");
  // MINIMUM GROUP SIZE
  const [productMinimumGroupSize, setProductMinimumGroupSize] = useState(5);
  //  PRODUCT CATEGORY
  const [selectedValue, setSelectedValue] = useState("household");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          console.log(
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // CREATES RANDOM IMAGE NAME AND UPLOADS THE IMAGE TO STORAGE WITHIN FIREBASE
    if (!result.cancelled) {
      setImage(result.uri);
      let imageFileName = "";
      const characters = "1234567890qwertyuiopasdfghjklzxcvbnm";
      for (let i = 0; i < 15; i++) {
        let randomNum = Math.round(Math.random() * characters.length);
        imageFileName += characters[randomNum];
      }
      uploadImage(result.uri, imageFileName)
        .then(() => {
          console.log("Success");
          var ref = firebase.storage().ref().child(imageFileName);
          ref.getDownloadURL().then((url) => setProductImageURL(url));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // UPLOAD IMAGE FUNCTION
  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child(imageName);

    return ref.put(blob);
    //ref.getDownloadURL().then((url) => console.log(url));
  };

  // CHECKS IF PRODUCT NAME TEXT INPUT HAS MORE THAN ONE CHARACTER
  const validateFieldProductName = () => {
    const isValidField = Utility.isValidField(productName);
    isValidField
      ? setProductNameError("")
      : setProductNameError(Strings.ProductNameEmpty);
    return isValidField;
  };

  // CHECKS IF PRODUCT DESCRIPTION TEXT INPUT HAS MORE THAN ONE CHARACTER
  const validateFieldProductDescription = () => {
    const isValidField = Utility.isValidField(productDescription);
    isValidField
      ? setProductDescriptionError("")
      : setProductDescriptionError(Strings.ProductDescriptionEmpty);
    return isValidField;
  };

  // CHECKS IF PRODUCT DISCOUNTED PRICE INPUT HAS MORE THAN ONE CHARACTER
  const validateFieldProductDiscountedPrice = () => {
    const isValidField = Utility.isValidField(productDiscountedPrice);
    isValidField
      ? setProductDiscountedPriceError("")
      : setProductDiscountedPriceError(Strings.ProductDiscountedPriceEmpty);
    return isValidField;
  };

  // CHECKS IF PRODUCT ORIGINAL PRICE INPUT HAS MORE THAN ONE CHARACTER
  const validateFieldProductOriginalPrice = () => {
    const isValidField = Utility.isValidField(productOriginalPrice);
    isValidField
      ? setProductOriginalPriceError("")
      : setProductOriginalPriceError(Strings.ProductOriginalPriceEmpty);
    return isValidField;
  };

  const convertUTCDateToLocalDate = (date) => {
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  };

  // CREATES A NEW PRODUCT IN FIRESTORE WITH MERCHANT ID
  function createProductToFireBase() {
    setIsLoading(true);
    const userID = firebase.auth().currentUser.uid;
    const productsRef = firestore.collection("products").doc();
    var discountedPrice = parseInt(productDiscountedPrice);
    var originalPrice = parseInt(productOriginalPrice);
    var date = new Date();
    var Created = convertUTCDateToLocalDate(date);
    productsRef
      .set({
        productName: productName,
        productDescription: productDescription,
        productDiscountedPrice: discountedPrice,
        productOriginalPrice: originalPrice,
        productMinimumGroupSize: productMinimumGroupSize,
        productCategory: selectedValue,
        productStatus: "noOngoingGroupBuy",
        createdAt: Created.toISOString(),
        productImageUrl: productImageURL,
        merchantId: userID,
      })
      .then(function (docRef) {
        // setIsLoading(false);
        console.log("Document written with ID:", productsRef.id);
        Alert.alert("Product Created Successfully", "", [
          {
            text: "Proceed",
            onPress: () => navigation.navigate("MerchantDashboardScreen"),
          },
        ]);
      })
      .catch(function (error) {
        Alert.alert(error.message);
        console.log(error.message);
        //setIsLoading(false);
        console.error("error adding document: ", error);
      });
  } //

  // CHECKS IF ALL INPUTS ARE VALID BEFORE CALLING THE CREATE PRODUCT FUNCTION
  const performCreateProduct = () => {
    const isValidFieldProductName = validateFieldProductName();
    const isValidFieldProductDescription = validateFieldProductDescription();
    const isValidFieldProductDiscountedPrice = validateFieldProductDiscountedPrice();
    const isValidFieldProductOriginalPrice = validateFieldProductOriginalPrice();
    if (
      isValidFieldProductName &&
      isValidFieldProductDescription &&
      isValidFieldProductDiscountedPrice &&
      isValidFieldProductOriginalPrice
    ) {
      createProductToFireBase();
    }
  };

  return (
    // IMAGE

    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View paddingVertical={10} />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={pickImage}>
            <View
              style={{
                height: 250,
                width: 250,
                borderRadius: 75,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageBackground
                source={{ uri: image }}
                style={{ height: 250, width: 250 }}
                imageStyle={{ borderRadius: 75 }}
              ></ImageBackground>
            </View>
          </TouchableOpacity>
        </View>

        <View paddingVertical={10} />

        {/* PRODUCT NAME  */}
        <CustomTextField
          term={productName}
          error={productNameError}
          placeHolder={Strings.ProductName}
          onTermChange={(newProductName) => setProductName(newProductName)}
          onValidateTextField={validateFieldProductName}
        />
        {/* <Text style={styles.text_footer}>Product Name</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Product Name"
              style={styles.textInput}
              autoCapitalize="none"
              value={productName}
              onChangeText={(newProductName) => setProductName(newProductName)}
              onEndEditing={validateFieldProductName}
            />
            <Text style={styles.ErrorText}> {productNameError}</Text>
          </View> */}

        {/* PRODUCT DESCRIPTION */}
        <CustomTextField
          term={productDescription}
          error={productDescriptionError}
          placeHolder={Strings.ProductDescription}
          onTermChange={(newProductDescription) =>
            setProductDescription(newProductDescription)
          }
          onValidateTextField={validateFieldProductDescription}
        />
        {/* <Text style={styles.text_footer}>Product Description</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Product Description"
              style={styles.textInput}
              autoCapitalize="none"
              value={productDescription}
              onChangeText={(newProductDescription) => setProductDescription(newProductDescription)}
              onEndEditing={validateFieldProductDescription}
            />
            <Text style={styles.ErrorText}> {productDescriptionError}</Text>
          </View> */}

        {/* PRODUCT DISCOUNTED PRICE */}
        <CustomTextField
          term={productDiscountedPrice}
          error={productDiscountedPriceError}
          placeHolder={Strings.ProductDiscountedPrice}
          onTermChange={(newProductDiscountedPrice) =>
            setProductDiscountedPrice(newProductDiscountedPrice)
          }
          onValidateTextField={validateFieldProductDiscountedPrice}
        />

        {/* <Text style={styles.text_footer}>Product Discounted Price ($):</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Product Discounted Price"
              style={styles.textInput}
              autoCapitalize="none"
              value={productDiscountedPrice}
              onChangeText={(newProductDiscountedPrice) => setProductDiscountedPrice(newProductDiscountedPrice)}
              onEndEditing={validateFieldProductDiscountedPrice}
            />
            <Text style={styles.ErrorText}> {productDiscountedPriceError}</Text>
          </View> */}

        {/* PRODUCT ORIGINAL PRICE */}
        <CustomTextField
          term={productOriginalPrice}
          error={productOriginalPriceError}
          placeHolder={Strings.ProductOriginalPrice}
          onTermChange={(newProductOriginalPrice) =>
            setProductOriginalPrice(newProductOriginalPrice)
          }
          onValidateTextField={validateFieldProductOriginalPrice}
        />
        {/* <Text style={styles.text_footer}>Product Original Price ($):</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Product Original Price"
              style={styles.textInput}
              autoCapitalize="none"
              value={productOriginalPrice}
              onChangeText={(newProductOriginalPrice) => setProductOriginalPrice(newProductOriginalPrice)}
              onEndEditing={validateFieldProductOriginalPrice}
            />
            <Text style={styles.ErrorText}> {productOriginalPriceError}</Text>
          </View> */}

        <View paddingVertical={15} />

        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          {/* PRODUCT MINIMUM GROUP SIZE */}
          <Text>Minimum Group Size:</Text>
          {/* <Picker
            selectedValue={productMinimumGroupSize}
            style={{
              height: Constants.screenHeight * 0.06,
              width: Constants.screenWidth * 0.35,
            }}
            onValueChange={(NewitemValue) =>
              setProductMinimumGroupSize(NewitemValue)
            }
          >
            <Picker.Item label="2" value={2} />
            <Picker.Item label="3" value={3} />
            <Picker.Item label="4" value={4} />
            <Picker.Item label="5" value={5} />
            <Picker.Item label="6" value={6} />
          </Picker> */}
          <DropDownPicker
            items={[
              {
                label: "5",
                value: 5,
                icon: () => (
                  <MaterialIcons name="merge-type" size={18} color="#900" />
                ),
                hidden: true,
              },
              {
                label: "10",
                value: 10,
                icon: () => (
                  <MaterialIcons name="merge-type" size={18} color="#900" />
                ),
              },
              {
                label: "15",
                value: 15,
                icon: () => (
                  <MaterialIcons name="merge-type" size={18} color="#900" />
                ),
              },
              {
                label: "20",
                value: 20,
                icon: () => (
                  <MaterialIcons name="merge-type" size={18} color="#900" />
                ),
              },
              {
                label: "25",
                value: 25,
                icon: () => (
                  <MaterialIcons name="merge-type" size={18} color="#900" />
                ),
              },
            ]}
            defaultValue={productMinimumGroupSize}
            containerStyle={{ width: 150, height: 40 }}
            d
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(itemValue) =>
              setProductMinimumGroupSize(itemValue.value)
            }
          />

          <View paddingVertical={70} />

          {/* PRODUCT CATEGORY */}
          <Text>Product Category:</Text>
          {/* <Picker
            selectedValue={selectedValue}
            style={{
              height: Constants.screenHeight * 0.06,
              width: Constants.screenWidth * 0.35,
            }}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="fashion" value="fashion" />
            <Picker.Item label="electronics" value="electronics" />
            <Picker.Item label="household" value="household" />
          </Picker> */}

          {/* <DropDownPicker
            items={[
              {
                label: "fashion",
                value: "fashion",
                icon: () => (
                  <MaterialIcons name="merge-type" size={18} color="#900" />
                ),
                hidden: true,
              },
              {
                label: "electronics",
                value: "electronics",
                icon: () => (
                  <MaterialIcons name="merge-type" size={18} color="#900" />
                ),
              },
              {
                label: "household",
                value: "household",
                icon: () => (
                  <MaterialIcons name="merge-type" size={18} color="#900" />
                ),
              },
            ]}
            defaultValue={selectedValue}
            containerStyle={{ width: 150, height: 40 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(NewitemValue) =>
              setSelectedValue(NewitemValue.value)
            }
          /> */}
        </View>

        <View style={styles.radiogroup}>
          <View style={{ flex: 1 }}>
            <Text style={styles.radioText}>fashion</Text>
            <RadioButton
              value="fashion"
              status={selectedValue === "fashion" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("fashion")}
            ></RadioButton>
          </View>
          {/* -RADIO BUTTONS- */}
          <View style={{ flex: 1 }}>
            <Text style={styles.radioText}>electronics</Text>
            <RadioButton
              value="electronics"
              status={selectedValue === "electronics" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("electronics")}
            ></RadioButton>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.radioText}>household</Text>
            <RadioButton
              value="household"
              status={selectedValue === "household" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("household")}
            ></RadioButton>
          </View>
        </View>

        {/* CREATE BUTTON */}
        {/* <Button
        title={Strings.CreateProduct}
        onPress={performCreateProduct}
        isLoading={isLoading}
      /> */}
        <TouchableOpacity
          style={styles.commandButton}
          onPress={performCreateProduct}
        >
          <Text style={styles.panelButtonTitle}>Create Product</Text>
        </TouchableOpacity>

        <View paddingVertical={10} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ErrorText: {
    fontSize: 12,
    color: "#FF0000",
    marginBottom: -5,
    marginHorizontal: 20,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#0d56d9",
    alignItems: "center",
    marginTop: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  radiobtn: {
    flexDirection: "row",
    width: "100%",
  },
  radioText: {
    marginRight: 35,
    fontSize: 15,
    //fontWeight: "700",
    color: "#05375a",
  },
  radiogroup: {
    marginTop: 20,
    marginBottom: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
