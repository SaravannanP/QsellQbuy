import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "../const/Constants";
import Images from "../const/Images";
import Color from "../utils/Colors";
import dayjs from "dayjs";

function GroupBuyCard({ item, onPress }) {
  const uri = item.productImageUrl;
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
  if(dayjs(item.endDate) - dayjs() > 0)
  {
  return  dayjs(item.endDate) - dayjs()
  }
  else 
  {
    return 0
  }
} // END TIMELEFT

function timeLeftDisplay()
{

  if(item.endDate !== null && item.endDate !== undefined){ 
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
          <Text>CurrentGroupBuySize : {item.currentGroupBuySize} / {item.productMinimumGroupSize} </Text>
          <Text>Time left: {timeLeftDisplay()}</Text>
         
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default GroupBuyCard;

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
  price: {
    marginTop: 10,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
});
