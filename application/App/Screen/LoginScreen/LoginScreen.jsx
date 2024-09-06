import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Colours from "../../Utils/Colours";

export default function LoginScreen() {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: -40,
      }}
    >
      <View>
        <Text style={styles.title}>GoByGreen</Text>
        <Text style={styles.description}>
          GoByGreen so your carbon footprint is clean!{" "}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => console.log("Hi")}>
        <Text
          style={{
            fontFamily: "outfit-SemiBold",
            color: Colours.WHITE,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 25,
            textAlign: "center",
          }}
        >
          Get Going
        </Text>
      </TouchableOpacity>
      <Image
        source={require("../../../assets/images/pin.png")}
        style={styles.logoImage}
      />

      <View>
        <Text style={{ top: 520, fontSize: 20 }}>Login</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: 250,
    height: 250,
    objectFit: "contain",
    position: "absolute",
    top: 330,
  },
  title: {
    padding: 60,
    fontSize: 48,
    fontWeight: "bold",
    color: "green",
    top: 150,
    fontStyle: "italic",
    fontFamily: "outfit-Bold",
  },
  description: {
    top: 100,
    fontFamily: "outfit-SemiBold",
    color: Colours.PRIMARY,
    paddingLeft: 50,
  },
  button: {
    padding: 16,
    backgroundColor: Colours.PRIMARY,
    borderRadius: 100,
    top: 410,
    display: "flex",
    alignContent: "center",
  },
});
