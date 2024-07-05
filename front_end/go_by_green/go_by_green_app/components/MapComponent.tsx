import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  Pressable,
  Text,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "@env";

const address = "10 Downing St London SW1A 2AA";

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [region, setRegion] = useState<Region>({
    latitude: 53.480759,
    longitude: -2.242631,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: {
              address: "CWC8%2BR9%20Mountain%20View%20CA%20USA",
              key: GOOGLE_MAPS_API_KEY,
            },
          }
        );
        const location = response.data.results[0].geometry.location;
        console.log(response)
        console.log(">>>>>>", fetchCoordinates, location);
        setLocation({
          latitude: location.lat,
          longitude: location.lng,
        });
        setRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchCoordinates();
  }, []);

  const onPressLearnMore = () => {
    if (location) {
      console.log("Hello?");
      setRegion({
        ...region,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 53.480759,
            longitude: -2.242631,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={location}
              title="Location"
              description={address}
            />
          )}
        </MapView>
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={onPressLearnMore}>
          <Text style={styles.text}>Click me!</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    height: "94%",
  },
  buttonView: {
    height: "30%",
    width: "100%",
  },
  button: {
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "green",
  },
  text: {
    fontSize: 16,
  },
});

export default MapComponent;






