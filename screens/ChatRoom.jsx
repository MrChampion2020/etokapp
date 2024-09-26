import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Platform,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { io } from "socket.io-client";
import axios from "axios";
import env from '../env';
import {API_URL} from "../config";


const ChatRoom = () => {
  const scrollViewRef = useRef();
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

 // Add this state to track the call status
 const [callStatus, setCallStatus] = useState(null);

  // console.log(route?.params);
  const socket = io(`${API_URL}`);
  const [messages, setMessages] = useState([]);

  socket.on("connect", () => {
    console.log("Connected to the Socket.IO server");
  });
  socket.on("receiveMessage", (newMessage) => {
    console.log("new Message", newMessage);

    //update the state to include new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  });


  const sendMessage = async (senderId, receiverId) => {
    socket.emit("sendMessage", { senderId, receiverId, message });

    setMessage("");

    // call the fetchMessages() function to see the UI update
    setTimeout(() => {
      fetchMessages();
    }, 200);
  };

  useLayoutEffect(() => {
    return navigation.setOptions({
      headerTitle: `${route?.params?.name}`,
      // headerLeft: () => (
      //   <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
      //     <Ionicons name="arrow-back" size={24} color="black" />
      //     <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
      //       <Text style={{fontSize: 16, fontWeight: 'bold'}}>
      //         {route?.params?.name}
      //       </Text>
      //     </View>
      //   </View>
      // ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

  <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginHorizontal: 2,
  }}
>

 <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        marginHorizontal: 2,
      }}
    >
      <Pressable
        onPress={() => {
          // Check if the receiver is online
          //socket.emit(`${API_URL}/checkUserOnline`, route.params.receiverId, (online) => {
            //if (online) {
              // Navigate to the CallScreen
              navigation.navigate("Call", {
                receiverId: route.params.receiverId,
                receiverName: route.params.name,
                callType: "video",
              });
            //} else {
             // console.log("User is offline");
              // Deliver a missed call record on the receiver's ChatRoom
             // socket.emit(`${API_URL}/deliverMissedCall`, route.params.receiverId, route.params.senderId);
            //}
        //  });
        }}
      >
        
        <Ionicons name="videocam-outline" size={24} color="gray" padding={15} />
      </Pressable>

      <Pressable
        onPress={() => {
          // Check if the receiver is online
          socket.emit(`${API_URL}/checkUserOnline`, route.params.receiverId, (online) => {
            if (online) {
              // Navigate to the CallScreen
              navigation.navigate("Call", {
                receiverId: route.params.receiverId,
                receiverName: route.params.name,
                callType: "audio",
              });
            } else {
              console.log("User is offline");
              // Deliver a missed call record on the receiver's ChatRoom
              socket.emit(`${API_URL}/deliverMissedCall`, route.params.receiverId, route.params.senderId);
            }
          });
        }}
      >
        <Feather name="phone" size={20} color="gray" padding={8} />
      </Pressable>

    </View>


</View>
        </View>
      ),
    });
  }, []);

  const fetchMessages = async () => {
    try {
      const senderId = route?.params?.senderId;
      const receiverId = route?.params?.receiverId;

      const response = await axios.get(`${env.IP}/messages`, {
        params: { senderId, receiverId },
      });

      setMessages(response.data);
    } catch (error) {
      console.log("Error fetching the messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  });
  // console.log('messages:', messages);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height + 1"}
      style={{ flex: 1, backgroundColor: "white" }}
      enabled
    >
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ marginTop: 10, marginHorizontal: 10 }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages?.map((item, index) => (
          <Pressable
            key={index}
            style={[
              item?.senderId === route?.params?.senderId
                ? {
                    alignSelf: "flex-end",
                    backgroundColor: "#c1ffc1",
                    padding: 8,
                    maxWidth: "60%",
                    borderRadius: 7,
                    margin: 3,
                  }
                : {
                    alignSelf: "flex-start",
                    backgroundColor: "white",
                    padding: 10,
                    borderColor: "grey",
                    borderWidth: 0.3,
                    margin: 5,
                    borderRadius: 7,
                    maxWidth: "60%",
                  },
            ]}
          >
            <Text
              style={{
                fontSize: 15,
                textAlign: "left",
                color: "black",
                fontWeight: "400",
              }}
            >
              {item?.message}
            </Text>
            <Text
              style={{
                fontSize: 9,
                textAlign: "right",
                color: "black",
                marginTop: 5,
              }}
            >
              {formatTime(item?.timestamp)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: 10,
        }}
      >
      
        <Entypo
          style={{ marginRight: 7 }}
          name="emoji-happy"
          size={30}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 50,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 5,
          }}
          placeholder="Type your message..."
        />
        {/*<View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            marginHorizontal: 2,
          }}
        >
          <Pressable
          
          >
            <Entypo name="camera" size={24} color="gray" />
            </Pressable>
          

          <Feather name="mic" size={24} color="gray" />
        </View>*/}

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginHorizontal: 2,
  }}
>
  <Pressable
    onPress={() => {
      // Logic to initiate a video call
      navigation.navigate(" ", {
        receiverId: route.params.receiverId,
        receiverName: route.params.name,
        callType: "video",
      });
    }}
  >
    <Entypo name="camera" size={24} color="gray" />
  </Pressable>

  <Pressable
    onPress={() => {
      // Logic to initiate an audio call
      navigation.navigate(" ", {
        receiverId: route.params.receiverId,
        receiverName: route.params.name,
        callType: "audio",
      });
    }}
  >
    <Feather name="mic" size={24} color="gray" />
  </Pressable>
</View>


        <Pressable
          onPress={() =>
            sendMessage(route?.params?.senderId, route?.params?.receiverId)
          }
          style={{
            backgroundColor: "white",
            paddingHorizontal: 2,
            paddingVertical: 2,
            borderRadius: 20,
          }}
        >
          <MaterialCommunityIcons
                name="send-circle"
                size={40}
                color="#318ce7"
              />

        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({});
