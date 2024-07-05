import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

console.log(GOOGLE_MAPS_API_KEY)

const address = '24%20Sussex%20Drive%20Ottawa%20ON';

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address: address,
              key: GOOGLE_MAPS_API_KEY,
            },
          }
        );
        const location = response.data.results[0].geometry.location;
        console.log(fetchCoordinates, location)
        setLocation({
          latitude: location.lat,
          longitude: location.lng,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchCoordinates();
  }, []);

  const onPressLearnMore = () => {
    return console.log("Hello")
  }

  return (
    <View style={styles.container}>

        <View style={styles.map}>
      <MapView
      style={{flex: 1}}
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
        <Button
        style= {{height:"50%"}}
  onPress={onPressLearnMore}
  title="Learn More"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>
    </View>

    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%"
  },
  map: {
    height: "50%",
  },
  buttonView: {
    height: "50%",
    width: "80%"
  }
});

export default MapComponent;