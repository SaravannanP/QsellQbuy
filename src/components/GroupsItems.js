import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Constants from "../const/Constants";
import Images from "../const/Images";
import Color from "../utils/Colors";

//Images.groups

function GroupsItem({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardImgWrapper}>
        <Image
          source={Images.groups}
          resizeMode="cover"
          style={styles.cardImg}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.productName}</Text>
        <Text> $ {item.productDiscountedPrice}</Text>
        <Text> Orignal Price $ {item.productOriginalPrice}</Text>
        {/* <Text> -{itemData.offer} % offer</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    width: Constants.screenWidth,
    margin: 10,
  },
  descriptionContainer: {
    margin: 5,
  },
  Image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: Color.gray,
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 2,
    backgroundColor: Color.theme,
  },
  groupTitle: {
    color: Color.black,
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  groupMembers: {
    color: Color.smoke,
    fontSize: 14,
  },
  separator: {
    height: 0.5,
    width: Constants.width,
    backgroundColor: Color.theme,
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
});

export default GroupsItem;

{
  /* <View>
      <View style={styles.container}>
        <Image source={Images.groups} style={styles.Image} />
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.groupTitle}>{item.productName}</Text>
          <Text style={styles.groupTitle}>{item.prodtctCategory}</Text>
        </View>
      </View>
    </View> */
}
