import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import "core-js/stable/atob";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import env from "../env";

const ProfileScreen = () => {
  // const {isLoading, token} = useContext(AuthContext);
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  useEffect(() => {
    console.log("hi");
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  // console.log("token");
  const [currentProfile, setCurrentProfile] = useState(null);
  useEffect(() => {
    if (userId) {
      getUserDetails();
    }
  }, [userId]);

  const { token, isLoading, setToken } = useContext(AuthContext);

  // console.log(token);

  useEffect(() => {
    // Check if the token is set and not in loading state
    if (!token) {
      // Navigate to the main screen
      navigation.navigate("AuthStack", { screen: "Login" });
    }
  }, [token, navigation]);

  const getUserDetails = async () => {
    try {
      // Make a GET request to the endpoint with the userId parameter
      const response = await axios.get(`${env.IP}/users/${userId}`);

      // Check if the response contains the user data
      if (response.status === 200) {
        // Extract the user data from the response
        const userData = response.data;

        // Handle the user data as needed (e.g., set state, display in UI)
        console.log("User details:", userData);

        setCurrentProfile(userData); // Return the user data if needed
      } else {
        console.error("Error fetching user details:", response.data.message);
        return null; // Return null or handle the error appropriately
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      return null; // Return null or handle the error appropriately
    }
  };
  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem("token");
      console.log("AuthToken cleared successfully");

      setToken("");
      // Perform any necessary actions after clearing the authToken
    } catch (error) {
      console.error("Failed to clear AuthToken:", error);
    }
  };


  //const VideoCallToggle 
    const [isVideoCallEnabled, setIsVideoCallEnabled] = useState(true);
  
    const handlePress = () => {
      setIsVideoCallEnabled(!isVideoCallEnabled);
    };

    const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { label: '$0.5', value: 0.5 },
    { label: '$1', value: 1 },
    { label: '$1.5', value: 5 },
  ];

  const handleOptionsPress = () => {
    setShowOptions(!showOptions);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  };


  //const VideoCallToggle 
  const [isAudioCallEnabled, setIsAudioCallEnabled] = useState(true);
  
  const handlePressAudio = () => {
    setIsAudioCallEnabled(!isAudioCallEnabled);
  };
  const [showAudioOptions, setShowAudioOptions] = useState(false);
const [selectedAudioOption, setSelectedAudioOption] = useState(null);
const optionsAudio = [
  { label: '$0.5', value: 0.5 },
  { label: '$1', value: 1 },
  { label: '$1.5', value: 5 },
];

const handleOptionsPressAudio = () => {
  setShowAudioOptions(!showAudioOptions);
};

const handleSelectAudioOption = (optionAudio) => {
  setSelectedAudioOption(optionAudio);
  setShowAudioOptions(false);
};
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/*<View >
            <Image
              style={{ width: 100, height: 80, resizeMode: "cover" }}
              source={{
                uri: "https://branditechture.agency/brand-logos/wp-content/uploads/wpdm-cache/Hinge-App-900x0.png",
              }}
            />
          </View>*/}
          <View
            style={{
              flexDirection: "row",
              alignItems: "left",
              width: 100,
              marginLeft: "80%",
              gap: 15,
            }}
          >

<Pressable
            onPress={() =>
              navigation.navigate("Details", {
                currentProfile: currentProfile,
              })
            }
          >
            <AntDesign name="infocirlce" size={24} color="grey" />
</Pressable>
            <Pressable
            onPress={() =>
              navigation.navigate("Edit", {
                currentProfile: currentProfile,
              })
            }
          >
           <AntDesign name="setting" size={24} color="#318ce7" />

          </Pressable>
          
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() =>
              navigation.navigate("Details", {
                currentProfile: currentProfile,
              })
            }
          >
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                resizeMode: "cover",
                borderColor: "black",
                borderWidth: 3,
                alignSelf: "center",
              }}
              source={{
                uri: currentProfile?.imageUrls[0],
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 12,
              }}
            >
              <Text style={{ fontSize: 19, fontWeight: "600" }}>
                {currentProfile?.firstName}
              </Text>
              <MaterialIcons name="verified" size={18} color="blue" />
            </View>
          </Pressable>
        </View>
        {/*
        <View style={{ marginTop: 30, marginHorizontal: 20 }}>
          <Image
            style={{ height: 250, width: "100%", borderRadius: 10 }}
            source={{
              uri: "https://cdn.sanity.io/images/l7pj44pm/production/5f4e26a82da303138584cff340f3eff9e123cd56-1280x720.jpg",
            }}
          />
        </View>
*/}

        <View
          style={{
            marginVertical: 10,
            marginHorizontal: 30,
            flexDirection: "row",
            alignItems: "center",
            gap: 45,
            borderColor: "#E0E0E0",
            borderWidth: 0.1,
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Pressable
            onPress={() =>
              navigation.navigate("ChatScreen", {
                currentProfile: currentProfile,
              })
            }
            style={{ alignItems: "center" }}
          >
            <Text
              style={{
                color: "black",
                marginTop: 3,
                fontWeight: "600",
                alignItems: "left",
              }}
            >
              0
            </Text>

            <Text style={{ color: "gray", marginTop: 3 }}>Followings</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("ChatScreen", {
                currentProfile: currentProfile,
              })
            }
            style={{ alignItems: "center" }}
          >
            <Text
              style={{
                color: "black",
                marginTop: 3,
                fontWeight: "600",
                alignItems: "center",
              }}
            >
              0
            </Text>

            <Text style={{ color: "gray", marginTop: 3 }}>Followers</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("ChatScreen", {
                currentProfile: currentProfile,
              })
            }
            style={{ alignItems: "center" }}
          >
            <Text
              style={{
                color: "black",
                marginTop: 3,
                fontWeight: "600",
                alignItems: "center",
              }}
            >
              0
            </Text>

            <Text style={{ color: "gray", marginTop: 3 }}>Free Messages</Text>
          </Pressable>
        </View>

        <View //coins, diamonds, withdrawal area
          style={{
            marginVertical: 5,
            marginHorizontal: 20,
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            borderColor: "#E0E0E0",
            borderWidth: 0.1,
            padding: 5,
            borderRadius: 2,
          }}
        >
          <View //coins row
            style={{
              marginVertical: 5,
              marginHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              borderColor: "#E0E0E0",
              borderWidth: 0.1,
              padding: 2,
              borderRadius: 8,
              width: "100%",
            }}
          >
            <View //coins icon
              style={{
                height: 30,
                width: 30,
                borderRadius: 20,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="wallet" size={22} color="gold" />
            </View>

            <View //coins text
            >
              <Text style={{ fontSize: 15, color: "gray", fontWeight: "600" }}>
                Coins
              </Text>
            </View>

            <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Recharge", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <Text //recharge text
                style={{
                  width: "35%",
                  padding: 6,
                  borderRadius: 15,
                  backgroundColor: "#318ce7",
                  color: "white",
                  fontWeight: "600",
                  marginLeft: "53%",
                  textAlign: "center",
                }}
              >
                Recharge
              </Text>
            </Pressable>
          </View>

          <View //coins row
            style={{
              marginVertical: 10,
              marginHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              borderColor: "#E0E0E0",
              borderWidth: 0.1,
              padding: 5,
              borderRadius: 8,
              width: "100%",
            }}
          >
            <View //coins icon
              style={{
                height: 30,
                width: 30,
                borderRadius: 50,
                backgroundColor: "#0048ba",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="diamond-stone"
                size={30}
                color="#f0f8ff"
              />
            </View>

            <View //coins text
            >
              <Text style={{ fontSize: 15, color: "gray", fontWeight: "600" }}>
                Diamonds
              </Text>
            </View>

            <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Recharge", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <Text //recharge text
                style={{
                  width: "40%",
                  padding: 6,
                  borderRadius: 15,
                  backgroundColor: "#318ce7",
                  color: "white",
                  fontWeight: "600",
                  marginLeft: "45%",
                  textAlign: "center",
                }}
              >
                Withdraw
              </Text>
            </Pressable>
          </View>

          <View //account details row
            style={{
              marginVertical: 10,
              marginHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              borderColor: "#E0E0E0",
              borderWidth: 0.1,
              padding: 5,
              borderRadius: 8,
              width: "100%",
            }}
          >
            <View //account details icon
              style={{
                height: 30,
                width: 30,
                borderRadius: 20,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="card-account-details"
                size={25}
                color="#318ce7"
              />
            </View>

            <View //account details button
            >
              <Text style={{ fontSize: 15, color: "gray", fontWeight: "600" }}>
                Bill Details
              </Text>
            </View>

            <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Details", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <Text //recharge text
                style={{
                  width: "40%",
                  padding: 6,
                  borderRadius: 15,
                  backgroundColor: "white",
                  color: "white",
                  fontWeight: "600",
                  marginLeft: "56%",
                  textAlign: "center",
                }}
              >
               <MaterialCommunityIcons
                name="greater-than"
                size={20}
                color="grey"
              />
                
              </Text>
            </Pressable>
          </View>
        </View>


        <View //video area
          style={{
            marginVertical: 5,
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 50,
            borderColor: "#E0E0E0",
            borderWidth: 0.2,
            padding: 3,
           
          }}
        >
        
      <View>
      <TouchableOpacity onPress={handlePress}>
        {isVideoCallEnabled ? (
          <MaterialCommunityIcons
          name="video-check"
          size={40}
          color="#318ce7"
        />
        ) : (
          <MaterialCommunityIcons
          name="video-box-off"
          size={30}
          color="lightgrey"
        />
        )}
      </TouchableOpacity>
      </View>{/*video call toggle off and on icon end */}


      <View
          style={{
            alignItems: "right",
            borderRadius: 8,
            marginLeft: "55%"
          }}
        >
            <TouchableOpacity onPress={handleOptionsPress}>
            <MaterialCommunityIcons
                name="greater-than"
                size={20}
                color="grey"
              />
      </TouchableOpacity>
      {showOptions && (
        <View>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleSelectOption(option)}
              style={{
                width: "40px",

              }}
            >
              <Text>
                {option.label}
                {selectedOption === option && ' (selected)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
          
        </View >{/* call price area end*/}

    </View>


    <View //video area
          style={{
            marginVertical: 5,
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            borderColor: "#E0E0E0",
            borderWidth: 0.2,
            padding: 3,
           
          }}
        >
        
      <View>
      <TouchableOpacity onPress={handlePressAudio}>
        {isAudioCallEnabled ? (
          <MaterialCommunityIcons
          name="microphone"
          size={40}
          color="#318ce7"
        />
        ) : (
          <MaterialCommunityIcons
          name="account-voice-off"
          size={30}
          color="lightgrey"
        />
        )}
      </TouchableOpacity>
      
      </View>{/*video call toggle off and on icon end */}
      <View
          style={{
            borderRadius: 8,
            fontSize: 15, color: "gray", fontWeight: "900" 
          }}
        >
      <Text>Audio</Text>
      </View>
      <View
          style={{
            alignItems: "right",
            borderRadius: 8,
            marginLeft: "55%"
          }}
        >
            <TouchableOpacity onPress={handleOptionsPressAudio}>
            <MaterialCommunityIcons
                name="greater-than"
                size={20}
                color="grey"
              />
      </TouchableOpacity>
      {showAudioOptions && (
        <View>
          {optionsAudio.map((optionAudio) => (
            <TouchableOpacity
              key={optionAudio.value}
              onPress={() => handleSelectAudioOption(optionAudio)}
              style={{
                width: "40px",

              }}
            >
              <Text>
                {optionAudio.label}
                {selectedAudioOption === optionAudio && ' (selected)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
          
        </View >{/* call price area end*/}

    </View>
           
           



        <View //share, referral link, home page post, Reward Tasks
          style={{
            marginVertical: 0,
            marginHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            borderColor: "#E0E0E0",
            borderWidth: 0.2,
            padding: 5,
            borderRadius: 8,
          }}
        >
           <View
          style={{
            marginVertical: 5,
            marginHorizontal: 5,
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            borderColor: "#E0E0E0",
            padding: 5,
            borderRadius: 8,
          }}
        >
          <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Details", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <MaterialCommunityIcons
            name="account-multiple-plus"
            size={35}
            color="#848482"
          />
          </Pressable>
            <Text>
              Invite
            </Text>

        </View>




        <View
          style={{
            marginVertical: 2,
            marginHorizontal: 20,
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderColor: "#E0E0E0",
            padding: 5,
            borderRadius: 8,
          }}
        >
          <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Details", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <MaterialCommunityIcons
            name="medal"
            size={30}
            color="#9f8170"
          />
          </Pressable>
            <Text>
              Rewards
            </Text>

        </View>





        <View
          style={{
            marginVertical: 20,
            marginHorizontal: 20,
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderColor: "#E0E0E0",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Details", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <MaterialCommunityIcons
            name="post"
            size={30}
            color="#ff91af"
          />
          </Pressable>
            <Text>
              post
            </Text>

        </View>




        <View
          style={{
            marginVertical: 20,
            marginHorizontal: 20,
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderColor: "#E0E0E0",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Home", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <MaterialCommunityIcons
            name="home-circle"
            size={30}
            color="#7f7f7f"
          />
          </Pressable>
            <Text>
              Home
            </Text>

        </View >
        </View>{/*section close */}




        <View //share, referral link, home page post, Reward Tasks
          style={{
            marginVertical: 0,
            marginHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            borderColor: "#E0E0E0",
            borderWidth: 0.2,
            padding: 5,
            borderRadius: 8,
          }}
        >
           <View
          style={{
            marginVertical: 5,
            marginHorizontal: 5,
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            borderColor: "#E0E0E0",
            padding: 5,
            borderRadius: 8,
          }}
        >
          <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Details", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <MaterialCommunityIcons
            name="comment-quote"
            size={30}
            color="black"
          />
          </Pressable>
            <Text>
              Feedback
            </Text>

        </View>




        <View
          style={{
            marginVertical: 2,
            marginHorizontal: 20,
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderColor: "#E0E0E0",
            padding: 5,
            borderRadius: 8,
          }}
        >
          <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Details", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
              <MaterialCommunityIcons
            name="face-agent"
            size={35}
            color="#318ce7"
          />
          </Pressable>
            <Text>
              Agent
            </Text>

        </View>





        <View
          style={{
            marginVertical: 2,
            marginHorizontal: 2,
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderColor: "#E0E0E0",
            padding: 5,
            borderRadius: 8,
          }}
        >
          <Pressable //recharge button
              onPress={() =>
                navigation.navigate("Details", {
                  currentProfile: currentProfile,
                })
              }
              style={{ alignItems: "center" }}
            >
          
          <AntDesign name="infocirlce" size={24} color="grey" />
          </Pressable>
            <Text>
            Instructions
            </Text>

        </View>




        <View
          style={{
            marginVertical: 20,
            marginHorizontal: 20,
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderColor: "#E0E0E0",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Pressable
          onPress={logout}
          style={{
            padding: 5,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          
          }}
        >
          <MaterialCommunityIcons
            name="logout"
            size={30}
            color="red"
          />
          <Text>
            Logout
            </Text>
        </Pressable>

        </View >
        </View>{/*section close */}

        
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
