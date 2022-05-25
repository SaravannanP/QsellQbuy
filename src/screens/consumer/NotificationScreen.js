import React, { Component, useState, useEffect } from "react";
import { 
    View,
    Text,
    ScrollView,
    StyleSheet,
    FlatList,
    SafeAreaView,
} from "react-native";
import firebase, { firestore } from "../../firebase/Firebase";
import NotificationCard from "../../components/NotificationCard"
const NotificationsScreen = ({ route, navigation }) => {
    const userID = firebase.auth().currentUser.uid;   
    const [notification,setNotifications] = useState([])

    useEffect(() => {
        getNotifications();
      }, []);



function getNotifications()
{
    var notificationArray = [];
    firestore.collection('notifications').where('userId', '==', userID)
    .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            console.log('New groupBuy: ', change.doc.data());
            let Dict = {
                notificationId : change.doc.id,
                ...change.doc.data()
            }
            notificationArray.push(Dict)
        }
        if (change.type === 'modified') {
            console.log('Modified groupBuy: ', change.doc.data());
        }
        if (change.type === 'removed') {
            console.log('Removed groupBuy: ', change.doc.data());
        }

        setNotifications(notificationArray);
        });
    });

}


            return notification.length > 0 ? (
                <SafeAreaView style={StyleSheet.container}>
                <ScrollView>
                <View style={styles.cardsWrapper}> 
                <FlatList
                    data={notification}
                    keyExtractor={(item, index) => {
                    return item.notificationId;
                    }}
                    distance
                    renderItem={({ item, index }) => {
                    return <NotificationCard item={item}/>;
                    }}
                />
                </View>
                </ScrollView>
                </SafeAreaView>
            ) : (
                <View style={styles.textContainer}>
                <Text style={styles.emptyTitle}>No Notifications</Text>
                {/* <Text style={styles.emptySubtitle}></Text> */}
                </View>
            );
    
}
export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
      },
      cardsWrapper: {
        marginTop: 20,
        width: "90%",
        alignSelf: "center",
      },
    
});