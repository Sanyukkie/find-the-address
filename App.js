import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, Dimensions, Button } from 'react-native';
import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
import { Marker } from "react-native-maps";
import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setAddress({latitude: location.coords.latitude, longitude: location.coords.longitude})
    })();
  }, []);



  const showLocation = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=HposypAKycCGhd31u6p4FnWziNg7N2qj&location=${location}`)
    .then(response => response.json())
    .then(responseJson => setResult(responseJson.results[0].locations[0].latLng.lat, responseJson.results[0].locations[0].latLng.lng))
    .catch(error => {Alert.alert('Error', error); });
  }

  const setResult = (lat, lng) => {
    setAddress({latitude: lat, longitude: lng});
    
  }



  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={address}
        region={address}>
        <Marker coordinate={address} />
      </MapView>
      <TextInput
          style={{width:200, borderColor: 'gray', borderWidth:1}}
          onChangeText={location => setLocation(location)}
          value={location}
        />
      <Button title="SHOW" onPress={ showLocation }/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
});
