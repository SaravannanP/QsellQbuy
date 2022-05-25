import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "../const/Constants";
import Images from "../const/Images";
import Color from "../utils/Colors";

function Card({ item, onPress }) {
  const uri = item.productImageUrl;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.cardImgWrapper}>
          <Image
            source={{ uri: uri }}
            resizeMode="cover"
            style={styles.cardImg}
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.productName}</Text>
          <Text> $ {item.productDiscountedPrice}</Text>
          <Text> Orignal Price $ {item.productOriginalPrice}</Text>
          {/* <Text> -{itemData.offer} % offer</Text> */}

          {/* <StarRating ratings={itemData.ratings} reviews={itemData.reviews} /> */}
          {/* <Text numberOfLines={2} style={styles.cardDetails}>
            {itemData.description}
          </Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Card;

const styles = StyleSheet.create({
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
