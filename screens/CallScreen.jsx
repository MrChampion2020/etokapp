/*import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_URL } from "../config";

const CallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const receiverId = route.params.receiverId;
  const receiverName = route.params.receiverName;
  const callType = route.params.callType;

  useEffect(() => {
    // Logic to initiate the call
    // You can use the call library you prefer (e.g. Agora, Twilio, etc.)
    const initiateCall = async () => {
      try {
        const response = await fetch(`${API_URL}/makeCall`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverId,
            callType,
          }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    initiateCall();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{receiverName}</Text>
      </View>
      <View style={styles.callContainer}>
        <Text style={styles.callText}>
          {callType === "video" ? "Video Call" : "Audio Call"}
        </Text>
        <TouchableOpacity style={styles.callButton}>
          <MaterialCommunityIcons name="phone" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  callContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  callButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
  },
});

export default CallScreen;*/


// CallScreen.js

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { io } from "socket.io-client";
import axios from "axios";
import {API_URL} from "../config";

const CallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const receiverId = route.params.receiverId;
  const receiverName = route.params.receiverName;
  const callType = route.params.callType;


  const socket = io(`${API_URL}`);

  const [callStatus, setCallStatus] = useState("checking"); // checking, dialing, answered, rejected, ended
  const [receiverOnline, setReceiverOnline] = useState(false);

  useEffect(() => {
   // Check if the receiver is online
   socket.emit(`${API_URL}/checkUserOnline`, receiverId, (online) => {
     setReceiverOnline(online);
     if (online) {
       // Make the call
       socket.emit(`${API_URL}/makeCall`, {
         callerId: route.params.senderId,
         receiverId: receiverId,
         callType: callType,
       });
       setCallStatus("dialing");
     } else {
       // End the call and send receipt to receiver
       socket.emit(`${API_URL}/endCall`, receiverId);
       socket.emit(`${API_URL}/deliverMissedCall`, receiverId, route.params.senderId);
       setCallStatus("rejected");
       setTimeout(() => {
         navigation.goBack();
       }, 2000);
     }
   });
 
   // When the receiver answers the call
   socket.on(`${API_URL}/callAnswered`, () => {
     setCallStatus("answered");
   });
 
   // When the receiver rejects the call
   socket.on(`${API_URL}/callRejected`, () => {
     setCallStatus("rejected");
     setTimeout(() => {
       navigation.goBack();
     }, 2000);
   });
 
   // When the receiver ends the call
   socket.on(`${API_URL}/callEnded`, () => {
     setCallStatus("ended");
     setTimeout(() => {
       navigation.goBack();
     }, 2000);
   });
 }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        </TouchableOpacity>
        <Text style={styles.headerText}>{receiverName}</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="video" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.callContainer}>
        {callStatus === "checking" && (
          <View>
            <Text style={styles.callText}>Checking if {receiverName} is online...</Text>
          </View>
        )}
        {callStatus === "dialing" && (
          <View>
            <Text style={styles.callText}>Dialing {receiverName}...</Text>
            <Text style={styles.callDuration}>00:00</Text>
          </View>
        )}
        {callStatus === "answered" && (
          <View>
            <Text style={styles.callText}>Call Answered</Text>
            <Text style={styles.callDuration}>00:30</Text>
          </View>
        )}
        {callStatus === "rejected" && (
          <View>
            <Text style={styles.callText}>Call Rejected</Text>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.callButtonText}>Call Again</Text>
            </TouchableOpacity>
          </View>
        )}
        {callStatus === "ended" && (
          <View>
            <Text style={styles.callText}>Call Ended</Text>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.callButtonText}>Return to Chat</Text>
            </TouchableOpacity>
          </View>
        )}
        {callStatus === "answered" && (
          <View style={styles.callActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                // Logic to end the call
                socket.emit(`${API_URL}/endCall`, receiverId);
                setCallStatus("ended");
              }}
            >
              <MaterialCommunityIcons name="phone-hangup" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                // Logic to convert to video call
                socket.emit(`${API_URL}/convertToVideoCall`, receiverId);
              }}
            >
              <MaterialCommunityIcons name="video" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#fff",
 },
 header: {
   flexDirection: "row",
   alignItems: "center",
   padding: 10,
   borderBottomWidth: 1,
   borderBottomColor: "#ddd",
 },
 headerText: {
   fontSize: 18,
   fontWeight: "bold",
   marginLeft: 10,
 },
 callContainer: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
 },
 callText: {
   fontSize: 24,
   fontWeight: "bold",
   marginBottom: 20,
 },
 callDuration: {
   fontSize: 18,
   color: "#666",
 },
 callButton: {
   backgroundColor: "#4CAF50",
   padding: 10,
   borderRadius: 50,
   marginTop: 20,
 },
 callButtonText: {
   fontSize: 18,
   color: "#fff",
 },
 callActions: {
   flexDirection: "row",
   justifyContent: "space-around",
   width: "100%",
   padding: 20,
 },
 actionButton: {
   backgroundColor: "#4CAF50",
   padding: 10,
   borderRadius: 50,
 },
});

export default CallScreen;