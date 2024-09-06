import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { React, useState, useEffect } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Colours from "../../Utils/Colours.js";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocation } from "../../Context/LocationContext.jsx";
import { GOOGLE_MAPS_APIKEY } from "@env";

export default function SearchBar({ searchedLocation }) {
  const {
    setOrigin,
    setDestination,
    mode,
    setMode,
    setInputsCompleted,
    origin,
    destination,
  } = useLocation();

  useEffect(() => {
    if (origin && destination) {
      setInputsCompleted(true);
    } else {
      setInputsCompleted(false);
    }
  }, [origin, destination]);

  return (
    <View>
      <View style={styles.inputContainer}>
        <FontAwesome6
          name="location-dot"
          size={24}
          color={Colours.GRAY}
          style={styles.icon}
        />

        <GooglePlacesAutocomplete
          placeholder="Origin"
          fetchDetails={true}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            let originCoordinates = {
              latitude: details?.geometry?.location.lat,
              longitude: details?.geometry?.location.lng,
            };
            setOrigin(originCoordinates);
          }}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome6
          name="location-dot"
          size={24}
          color={Colours.GRAY}
          style={styles.icon}
        />

        <GooglePlacesAutocomplete
          placeholder="Destination"
          fetchDetails={true}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            let destinationCoordinates = {
              latitude: details?.geometry?.location.lat,
              longitude: details?.geometry?.location.lng,
            };
            setDestination(destinationCoordinates);
          }}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
        />
      </View>

      <View style={styles.pickerContainer}>
        {/* <Text style={{ padding: 10 }}>Select Mode of Transport:</Text> */}
        <Picker
          selectedValue={mode}
          onValueChange={(itemValue) => setMode(itemValue)}
        >
          <Picker.Item label="Walking" value="WALKING" />
          <Picker.Item label="Cycling" value="BICYCLING" />
          <Picker.Item label="Public Transport" value="TRANSIT" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 5,
    backgroundColor: Colours.WHITE,
    borderRadius: 6,
  },
  icon: {
    paddingTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  pickerContainer: {
    marginTop: 15,
    paddingHorizontal: 5,
    backgroundColor: Colours.WHITE,
    borderRadius: 6,
  },
});
