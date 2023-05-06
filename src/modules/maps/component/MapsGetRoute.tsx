import React, { useState } from 'react'
import MapView, { LatLng, Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet,SafeAreaView, Text, Dimensions } from 'react-native'
import globalStyles from '../../../styles/GlobalStyles';

var height1 = Dimensions.get("window").height; //con height se multiplica por ejemp *0.02 y vamos probando por numero para encontrar el tamaño deseado
var width1 = Dimensions.get("window").width;

const coordinates = [
  
    [-92.26167007996071,14.905335554313867],
    [-92.2595646652889,14.903928462607059],
    [-92.26018614018494,14.902480130141795],
    [-92.26062259159241,14.901555820736021],
    [-92.26107761540499,14.900550741943196], 
    [-92.2613608445104,14.899949487198834],
    [-92.2618019390223,14.89898927094653]
  ].map(pair => {
    return { latitude: pair[1], longitude: pair[0] };
  });

const MapsGetRoute = () => {

    const [origen,setOrigen] = useState({latitude: 14.905335554313867, longitude: -92.26167007996071});
    const [destination,setDestination] = useState({latitude: 14.89898927094653, longitude: -92.2618019390223});

  return (
    
    <SafeAreaView style={styles.contenedor} >

        <Text style={styles.titulo} >Ruta:15</Text>

        <MapView style={styles.map} provider={PROVIDER_GOOGLE}
        initialRegion={{latitude:origen.latitude,longitude:origen.longitude, latitudeDelta: 0.09, longitudeDelta: 0.04}}
        >

             {/* marcadores */}
          <Marker draggable //image={carImage} 
          coordinate={destination} onDragEnd={(direccion)=> setOrigen(direccion.nativeEvent.coordinate)} ></Marker>
          <Marker draggable coordinate={origen} onDragEnd={(direccion)=> setDestination(direccion.nativeEvent.coordinate)} ></Marker>

          <Polyline
        coordinates={coordinates as LatLng[]}
        strokeColor="black"
        strokeWidth={5}
        />
        </MapView>        

    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  
    contenedor: {
        width: '100%',
        height: '100%',
        marginBottom: '10%',
        ...globalStyles.contenedor
    },

    titulo: {
        color: '#FFF',
        textAlignVertical: 'center',
        marginTop: '8%',
        textAlign: 'center',
        fontSize: height1 * 0.06,//asi se consige las letras responsivas
        fontWeight: '900'
    },

    map: {
      width: 450,
      height: 450,
      marginTop: 15
    }

});

export default MapsGetRoute