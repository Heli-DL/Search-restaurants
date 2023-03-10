import { StyleSheet, TextInput , View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { API_KEY } from '@env';

const apikey = API_KEY;

export default function App() {
  const [address, setAddress] = useState(null);
  const [region, setRegion] = useState({
    latitude: 60.1699,
    longitude: 24.9384,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121,
  });
  const [restaurants, setRestaurants] = useState([]);
  const [changeRegion, setChangeRegion] = useState(false);

  const getCoordinates = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apikey}`, {
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setRegion({
        ...region,
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng
      });
      setChangeRegion(!changeRegion);
    })
    .catch(error => {
      console.error(error);
    });
  }
   useEffect(() => {
      fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=1000&type=restaurant&key=${apikey}`, {
      })
      .then(response => response.json())
      .then(data => {
        let places = data.results;
        setRestaurants(places);
        console.log(restaurants);
      })
      .catch(error => {
        console.error(error);
      });
   }, [changeRegion]);

  return (
    <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={region => setRegion(region)}
        >
         {restaurants.map((restaurant, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: restaurant.geometry.location.lat,
            longitude: restaurant.geometry.location.lng,
          }}
          title={restaurant.name}
        />
        ))} 
        </MapView>
      <View style={styles.input}>
      <TextInput
        style={{fontSize: 18, width: 200, height: 40, marginBottom: 5}}
        placeholder='Address'
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <Button title="Show" onPress={getCoordinates} />
      </View>
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
    width: '100%',
    height: '80%',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

