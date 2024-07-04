import React from 'react';
import MapComponent from '@/components/MapComponent';
import { StyleSheet, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={ styles.container }>
      <MapComponent/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  map: {
    width: '100%',
    height: '100%',
  }
});
