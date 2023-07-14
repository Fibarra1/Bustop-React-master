import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next';
import '../../home/translations/i18n';
import SquareRoute from './SquareRoute';
import { MyInput } from '../../shared/components/MyInput'
import { MainLayout } from '../../layout/components/MainLayout';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';


export const RouteScreen = () => {

    const origin = { latitude: 19.03, longitude: -98.20 };
    const destination = { latitude: 23.03, longitude: -110.20 };

    const coordinates = [
        {
            latitude: 19.3317876,
            longitude: -98.3317876,
        },
        {
            latitude: 23.3317876,
            longitude: -110.3317876,
        },
    ]
    const { t } = useTranslation();


    const api_Directions = 'AIzaSyB9DcIvaDukFT5D8a4S7zbDlm_dismNVG8'

    const API_URL = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Paradas';
    const API_URL_Rutas = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/CordenadaRutas';


    const [position, setPosition] = useState({
        latitude: 0,
        longitude: 0
    });

    useEffect(() => {
        Geolocation.getCurrentPosition((pos) => {
            const crd = pos.coords;
            setPosition({
                latitude: crd.latitude,
                longitude: crd.longitude,
            });
        })
    }, []);

    const [paradas, setParadas] = useState([]);


    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setParadas(response.data);

            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    const [routeCoordinates, setRouteCoordinates] = useState([]);



    useEffect(() => {
        axios.get(API_URL_Rutas)
            .then(response => {
                setRouteCoordinates(response.data);

            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // console.log(routeCoordinates.map(coordinate => ({ latitude: coordinate.latitud, longitude: coordinate.longitud })));


    return (
        <View style={styles.container}>
            <View>
                <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
            </View>
            <Text style={styles.title}>{t('route:title')}</Text>

            <View style={styles.rowRoutes}>
                <SquareRoute contentColor='red' bgColor='orange' content='10' />
                <SquareRoute contentColor='white' bgColor='purple' content='72' />
            </View>

            <MapView style={styles.map}
                region={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 0.051,
                }}
            >
                {/* {routeCoordinates.map(({ nombre, longitud, latitud, idCordenada }, index) => ( */}

                {/* <MapViewDirections
                    origin={coordinates[0]} // Latitud y longitud del origen
                    destination={coordinates[1]}
                    apikey={api_Directions}
                    strokeWidth={3}
                    strokeColor="black"
                /> */}

                {/* ))} */}

                <Marker
                    coordinate={{ latitude: position.latitude, longitude: position.longitude }}
                    title={"Tu ubicación"}
                    description={"Esta es tu ubicación actual."}
                />
                {paradas.map(({ nombre, longitud, latitud, idParada }, index) => (
                    <Marker
                        key={idParada}
                        coordinate={{
                            latitude: parseFloat(latitud),
                            longitude: parseFloat(longitud)
                        }}
                        title={nombre}
                        pinColor='#74cfe6'
                    />
                ))}
            </MapView>

        </View>
        // <MainLayout>
        //     <Text style={styles.title}>{"Ruta"}</Text>
        //     <View style={{ flex: 1, display: 'flex' }}>
        //         <View style={styles.containerRoutes}>
        //             <View style={styles.rowRoutes}>
        //                 <SquareRoute contentColor='red' bgColor='orange' content='10' />
        //                 <SquareRoute contentColor='white' bgColor='purple' content='72' />
        //             </View>


        //             <MapView style={styles.map}
        //                 showsUserLocation={true}
        //                 followsUserLocation={true}
        //             />
        //         </View>
        //     </View>
        // </MainLayout>

    )
}

const styles = StyleSheet.create({
    container: {
        // width: '100%',
        // height: '100%',
        backgroundColor: '#000',
    },
    title: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
    },
    containerRoutes: {
        marginVertical: 100,
    },
    rowRoutes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 40,
        marginHorizontal: 97
    },
    map: {
        width: "100%",
        height: 480

    },
})
