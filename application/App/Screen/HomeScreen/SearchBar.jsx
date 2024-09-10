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
    <View style={styles.container}>
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
          styles={{
            container: {
              flex: 1,
            },
            textInputContainer: {
              paddingRight: 10,
            },
          }}
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
          styles={{
            container: {
              flex: 1,
            },
            textInputContainer: {
              paddingRight: 10,
            },
          }}
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
        <Picker
          selectedValue={mode}
          onValueChange={(itemValue) => setMode(itemValue)}
          style={styles.picker}
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
  container: {
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: Colours.WHITE,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colours.PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // overflow: 'hidden', // This will clip any content that exceeds the container
  },
  icon: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  textInput: {
    height: 50,
    paddingRight: 10, // Add some padding on the right side
  },
  pickerContainer: {
    backgroundColor: Colours.WHITE,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colours.PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 50,
    justifyContent: 'center', // Center the picker vertically
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
