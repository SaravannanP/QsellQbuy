import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "../const/Constants";
import Images from "../const/Images";
import Color from "../utils/Colors";

function  ConsumerListCard({ item, onPress }) {
return (

   <View>
        <View style={styles.row}>
                <Text style={{ flex: 1 ,fontWeight: "bold"}}>name:</Text>
                <Text style={{ marginLeft: 20, flex: 1 }}>{item.consumerName}</Text>
        </View>
        <View style={styles.row}>
                <Text style={{ flex: 1 ,fontWeight: "bold" }}>contact number:</Text>
                <Text style={{ marginLeft: 20, flex: 1 }}>{item.consumerContactNumber}</Text>
        </View>
        <View style={styles.row}>
                <Text style={{ flex: 1 ,fontWeight: "bold" }}>Address:</Text>
                <Text style={{ marginLeft: 20, flex: 1 }}>{item.consumerAddress}</Text>
        </View>
  </View> 
  );
}

export default ConsumerListCard;

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
  row: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
    display: "flex",
  },
});
