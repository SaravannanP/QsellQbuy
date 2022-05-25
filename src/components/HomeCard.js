import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity ,Dimensions} from "react-native";
//import StarRating from 'react-native-star-rating'


function  HomeCard ({ item, onPress }) {

const uri = item.productImageUrl;
const { height, width } = Dimensions.get('window');  
        return (
            <TouchableOpacity onPress={onPress}>
            <View style={{ width: width / 2 - 40, height: width / 2 - 0, borderWidth: 0.5, borderColor: '#dddddd',backgroundColor: '#fff' , shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,}}>
                <View style={{ flex: 1 }}>
                    <Image
                        style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                        source={{ uri: uri }} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'space-evenly', paddingLeft: 10 }}>
                    <Text style={{ fontSize: 13, color: '#0d56d9' }}>{item.productName}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' ,color:'#008000' }}>$ {item.productDiscountedPrice}</Text>
                    <Text style={{ fontSize: 10 , textDecorationLine: "line-through",textDecorationStyle: "solid"}}>$ {item.productOriginalPrice}</Text>

                </View>
            </View>
            </TouchableOpacity>
        );
    
}
export default HomeCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});