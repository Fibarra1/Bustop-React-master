import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, Alert, Platform, Button, TouchableOpacity, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next';
import '../../home/translations/i18n';
import SquareRoute from './SquareRoute';
import { MyInput } from '../../shared/components/MyInput'
import { MainLayout } from '../../layout/components/MainLayout';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import globalStyles from '../../../styles/GlobalStyles';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';


const RoutesScreen = () => {



    const API_URL = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Paradas';

    const [location, setLocation] = useState({
        latitude: 19.0437335,
        longitude: -98.1980244
    });

    const [cambiolocalizacion, setCambiolocalizacion] = useState({
        latitude: 19.0437335,
        longitude: -98.1980244
    })

    useEffect(() => {
        // Comenzar a observar la ubicación actual
        const watchId = Geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setCambiolocalizacion({ latitude, longitude });
            },
            error => console.log(error),
            { enableHighAccuracy: true, distanceFilter: 10 }
        );

        // Detener la observación cuando el componente se desmonte
        return () => {
            Geolocation.clearWatch(watchId);
        };
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



    const { t } = useTranslation();

    const [selectedRoute, setSeletedRoute] = useState({
        value: "",
        errorMessage: ""

    })
    const [filteredData, setFilteredData] = useState([]);

    const handleSelectRoute = (value: string) => {
        setSeletedRoute({
            value,
            errorMessage: ""
        })
        const newData = paradas.filter((item) =>
            item.nombre.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(newData);
    }









    return (


        <ScrollView style={styles.container}>

            <View>
                <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
            </View>


            <Text style={styles.title}>{t('routes:title')}</Text>
            <MyInput
                value={selectedRoute.value}
                placeholder={t('routes:searchRoute')}
                onChangeText={handleSelectRoute}
                errorMessage={selectedRoute.errorMessage}
            />
            <View >
                {selectedRoute.value.length > 0 &&
                    <View style={styles.flatListContainer}>
                        <FlatList
                            data={filteredData}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => {
                                    const latitude = item.latitud
                                    const longitude = item.longitud
                                    setCambiolocalizacion({ latitude, longitude })
                                    setSeletedRoute({value: '', errorMessage: ''});
                                    
                                }}>
                                    <Text style={{ color: 'black', fontSize: 20 }}>{item.nombre}
                                    </Text>
                                </TouchableOpacity>
                            }
                            keyExtractor={(item) => item.idParada}
                        />
                    </View>

                } 
                <MapView 
                    style={styles.map}
                    region={{
                        latitude: cambiolocalizacion.latitude,
                        longitude: cambiolocalizacion.longitude,
                        latitudeDelta: 0,
                        longitudeDelta: 0.051,
                    }}

                >
                    <Marker
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title={"Tu ubicación"}
                        description={"Esta es tu ubicación actual."}
                    />
                    {paradas.map(({ nombre, longitud, latitud, idParada }, index) => (
                        <Marker
                            key={idParada}
                            coordinate={{
                                latitude: latitud,
                                longitude: longitud
                            }}
                            title={nombre}
                            pinColor='#74cfe6'
                        />
                    ))}
                </MapView>
            </View>
            <View>
                <View style={styles.containerRoutes}>
                    <View style={styles.rowRoutes}>
                        <SquareRoute contentColor='red' bgColor='orange' content='10' />
                        <SquareRoute contentColor='orange' bgColor='blue' content='Blvd' />
                        <SquareRoute contentColor='white' bgColor='red' content='S1' />
                    </View>
                    <View style={styles.rowRoutes}>
                        <SquareRoute contentColor='black' bgColor='white' content='S2' />
                        <SquareRoute contentColor='white' bgColor='green' content='S3' />
                        <SquareRoute contentColor='black' bgColor='yellow' content='S1' />
                    </View>
                    <View style={styles.rowRoutes}>
                        <SquareRoute contentColor='white' bgColor='purple' content='72' />
                        <SquareRoute contentColor='red' bgColor='white' content='33' />
                        <SquareRoute contentColor='white' bgColor='red' content='S1' />
                    </View>
                </View>
            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        // marginBottom: '10%',
        ...globalStyles.contenedor
    },
    title: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    containerRoutes: {
        marginVertical: 20,

    },
    rowRoutes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 20

    },
    map: {
        flex: 1,
        width: "100%",
        height: 410
    },
    flatListContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'white',
    },
})

export default RoutesScreen