import { View, StyleSheet, Text, FlatList } from "react-native";
import React, { useContext, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from "../../Utils/MapViewStyle.json";
import { UserLocationContext } from "../../Context/UserLocationContext";
import { useLocation } from '../../Context/LocationContext';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from '@env';
import Colours from "../../Utils/Colours";

export default function AppMapView() {
  const { location, setLocation } = useContext(UserLocationContext);
  const { origin, destination, mode, inputsCompleted, routeDetails, setRouteDetails } = useLocation();
  const mapRef = useRef(null);
  const [steps, setSteps] = useState([]);
  const [distance, setDistance] = useState(0);

  // Default location is Manchester, England
  const defaultLocation = {
    latitude: 53.483959,
    longitude: -2.244644,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0421,
  };

  const mapRegion = location?.latitude && location?.longitude
    ? {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0422,
      longitudeDelta: 0.0421,
    }
    : defaultLocation;

  const markerCoordinate = location?.latitude && location?.longitude
    ? {
      latitude: location.latitude,
      longitude: location.longitude,
    }
    : defaultLocation;

  const handleReady = (result) => {
    mapRef.current.fitToCoordinates(result.coordinates, {
      edgePadding: {
        top: 300,
        right: 50,
        bottom: 50,
        left: 50,
      },
      animated: true,
    });

    const routeDistance = result.distance * 1000; // Convert km to meters
    setDistance(routeDistance);

    // Extract steps from the directions result
    const routeSteps = result.legs[0].steps.map((step, index) => ({
      key: `${index}`,
      instruction: step.html_instructions.replace(/<[^>]+>/g, ''), // Removing HTML tags
      distance: step.distance.text,
      duration: step.duration.text,
    }));
    setSteps(routeSteps);

    const leg = result.legs[0];

    const carbonUsageNumber = parseFloat(co2EstimateKg); // Convert to float

    let distanceFromApi = (leg.distance.value / 1000).toFixed(2); // Convert meters to km
    const distanceToString = `${distanceFromApi.toString()} km`;

    const details = {
      distance: distanceToString,
      duration: leg.duration.text,
      end_address: leg.end_address,
      end_location_lat: leg.end_location.lat,
      end_location_lng: leg.end_location.lng,
      start_address: leg.start_address,
      start_location_lat: leg.start_location.lat,
      start_location_lng: leg.start_location.lng,
      carbon_usage: carbonUsageNumber,
    };
    setRouteDetails(details);
  };

  const calculateCO2 = (distance, mode) => {
    let emissionFactor;
    switch (mode) {
      case 'WALKING':
      case 'BICYCLING':
        return 0;
      case 'TRANSIT':
        emissionFactor = 0.035; // 35 grams of CO2 per km, which is 0.035 grams per meter
        break;
      default:
        emissionFactor = 0;
    }
    return distance * emissionFactor; // CO2 in grams
  };

  const co2Estimate = calculateCO2(distance, mode);
  const co2EstimateKg = (co2Estimate / 1000).toFixed(2);

  return (
    location?.latitude && (
      <View>
        <MapView
          ref={mapRef}
          style={inputsCompleted ? styles.mapWithList : styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapViewStyle}
          region={mapRegion}
        >
          {origin && (
            <Marker
              coordinate={origin}
              pinColor={Colours.HIGHLIGHT_GREEN}
            />
          )}
          {destination && (
            <Marker
              coordinate={destination}
              pinColor={Colours.HIGHLIGHT_GREEN}
            />
          )}
          {origin && destination && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              mode={mode}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor={Colours.PRIMARY}
              onReady={handleReady}
            />
          )}
        </MapView>
        <View style={[styles.co2Container, inputsCompleted && styles.co2ContainerWithList]}>
          <Text style={styles.co2Text}>CO2:</Text>
          <Text style={styles.co2Value}>{co2EstimateKg}kg</Text>
        </View>
        {inputsCompleted && (
          <FlatList
            style={styles.stepsList}
            data={steps}
            renderItem={({ item }) => (
              <View style={styles.stepItem}>
                <Text style={styles.stepText}>{item.instruction}</Text>
                <Text style={styles.stepText}>{item.distance} - {item.duration}</Text>
              </View>
            )}
            keyExtractor={(item) => item.key}
          />
        )}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapWithList: {
    width: "100%",
    height: "75%",
  },
  stepsList: {
    width: "100%",
    height: "25%",
    padding: 10,
    backgroundColor: '#00BF63',
  },
  stepItem: {
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  co2Container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#00BF63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  co2ContainerWithList: {
    bottom: '26%', // Adjust this value based on the height of the FlatList
  },
  co2Text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 0,
    marginTop: 2,
    paddingBottom: 0,
    lineHeight: 18,
  },
  co2Value: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 0,
    paddingTop: 0,
    lineHeight: 18,
  },
});
