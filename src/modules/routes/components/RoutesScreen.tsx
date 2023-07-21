import React, { useState, useEffect, useRef } from 'react'
import { Text, View, StyleSheet, ScrollView, Alert, Platform, Button, TouchableOpacity, FlatList, Dimensions, TextInput, TouchableWithoutFeedback } from 'react-native'
import '../../home/translations/i18n';
import { useTranslation } from 'react-i18next';
import SquareRoute from './SquareRoute';
import { MyInput } from '../../shared/components/MyInput'
import { MainLayout } from '../../layout/components/MainLayout';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import globalStyles from '../../../styles/GlobalStyles';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';
import { MyButton } from '../../shared/components/MyButton';

var height1 = Dimensions.get("window").height; //con height se multiplica por ejemp *0.02 y vamos probando por numero para encontrar el tamaño deseado
var width1 = Dimensions.get("window").width;


const RoutesScreen = () => {


    const API_URL = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Paradas';
    const API_RUTAS = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Rutas'


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
    const [rutas, setRutas] = useState([]);
    const [rutas2, setRutas2] = useState([]);
    const [isClicked, setIsClicked] = useState(false);


    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setParadas(response.data);

            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        axios.get(API_RUTAS)
            .then(response => {
                setRutas(response.data);
                setRutas2(response.data);
                setFilteredData(response.data)

            })
            .catch(error => {
                console.error(error);
            });
    }, []);



    const { t } = useTranslation();

    const [selectedRoute, setSeletedRoute] = useState({
        value: t('routes:searchRoute'),
        errorMessage: ""

    })
    const [selectedRoute2, setSeletedRoute2] = useState({
        value: '',
        errorMessage: ""

    })

    const handleSelectRoute = (value: string) => {
        setSeletedRoute2({
            value,
            errorMessage: ""
        })
        if (selectedRoute2.value.length === 1) {
            setFilteredData(rutas2)
        } else {
            const newData = rutas.filter((item) =>
                item.nombre.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(newData);
        }

    }

    const [rutasFavoritas, setRutasFavoritas] = useState([]);
    const [rutasFavoritasData, setRutasFavoritasData] = useState([]);
    const [isActive, setIsActive] = useState(false)


    // Función para agregar o quitar una ruta de las favoritas
    const toggleFavorito = (idRuta, color, nombre) => {
        // Crear una copia del estado rutasFavoritas para no modificarlo directamente
        const updatedRutasFavoritas = [...rutasFavoritas];

        const isFavorito = updatedRutasFavoritas.some((ruta) => ruta.idRuta === idRuta);
        if (isFavorito) {
            // Si ya es favorito, lo eliminamos de las rutas favoritas
            const index = updatedRutasFavoritas.findIndex((ruta) => ruta.idRuta === idRuta);
            if (index !== -1) {
                updatedRutasFavoritas.splice(index, 1);
            }
        } else {
            // Si no es favorito, lo agregamos a las rutas favoritas
            updatedRutasFavoritas.push({ idRuta, color, nombre });
        }

        // Actualizar el estado rutasFavoritas con la copia actualizada
        setRutasFavoritas(updatedRutasFavoritas);
    };

    const activeButton = () => {
        setIsActive(!isActive)
    }

    // console.log(rutasFavoritas)

    // console.log(rutasFavoritasData)









    return (


        <ScrollView style={styles.container}>

            <View>
                <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
            </View>


            <Text style={styles.title}>{t('routes:title')}</Text>
            {/* <MyInput
                    value={selectedRoute.value}
                    placeholder={t('routes:searchRoute')}
                    onChangeText={handleSelectRoute}
                    errorMessage={selectedRoute.errorMessage}
                /> */}
            <View style={{ zIndex: 1 }}>
                <TouchableOpacity style={styles.dropdownSelector} onPress={() => {
                    setIsClicked(!isClicked);
                }}>
                    <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', paddingTop: 7 }}>{selectedRoute.value}</Text>
                </TouchableOpacity>
                <View>
                    {isClicked ? <View style={styles.dropdownArea}>
                        <TextInput placeholder='Buscar Ruta' style={styles.searchInput} onChangeText={handleSelectRoute} value={selectedRoute2.value} />
                        <FlatList data={filteredData} renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    style={styles.rutasItem}
                                    onPress={() => {
                                        setSeletedRoute({ value: item.nombre, errorMessage: '' });
                                        setSeletedRoute2({ value: '', errorMessage: '' })
                                        setIsClicked(false);
                                    }}
                                >
                                    <Text>{item.nombre}</Text>
                                </TouchableOpacity>
                            )
                        }} />
                    </View>
                        : null}
                </View>
            </View>

            <View style={{ paddingTop: 20 }}>
                {/* {selectedRoute.value.length > 0 &&
                    <View style={styles.flatListContainer}>
                        <FlatList
                            data={filteredData}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => {
                                    const latitude = parseFloat(item.latitud)
                                    const longitude = parseFloat(item.longitud)
                                    setCambiolocalizacion({ latitude, longitude })
                                    setSeletedRoute({ value: '', errorMessage: '' });

                                }}>
                                    <Text style={{ color: 'black', fontSize: 20 }}>{item.nombre}
                                    </Text>
                                </TouchableOpacity>
                            }
                        keyExtractor={(item) => item.idParada}
                        />
                    </View>

                } */}
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
                                latitude: parseFloat(latitud),
                                longitude: parseFloat(longitud)
                            }}
                            title={nombre}
                            pinColor='#74cfe6'
                        />
                    ))}
                </MapView>
            </View>
            <View>
                <View style={styles.containerRoutes}>
                    {rutasFavoritas.length > 0 ?
                        <Text style={{ color: 'white', fontSize: 30, textAlign: 'center', paddingBottom: 10 }}>Rutas Favoritas</Text>
                        : null}
                    <View style={styles.rowRoutes2}>
                        {rutasFavoritas.length > 0 ?
                            rutasFavoritas.map(({ idRuta, color, nombre }, index) => (
                                <View key={index} style={{ paddingBottom: 20, paddingHorizontal: 13 }}>
                                    <SquareRoute contentColor='red' bgColor={color === 'aa' ? 'white' : color} content={idRuta} onPress={() => {
                                        !isActive ?
                                            setSeletedRoute({ value: nombre, errorMessage: '' })
                                            : toggleFavorito(idRuta, color, nombre)
                                    }}
                                    />

                                </View>
                            )) : null}

                    </View>
                    {rutasFavoritas.length > 0 ?
                        <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>Rutas</Text>
                        : null}
                    <View style={styles.rowRoutes}>

                        {rutas.map(({ idRuta, color, nombre }, index) => (
                            <View key={index} style={{ paddingBottom: 20, paddingHorizontal: 13 }}>
                                <SquareRoute contentColor='red' bgColor={color === 'aa' ? 'white' : color} content={idRuta} onPress={() => {
                                    !isActive ?
                                        setSeletedRoute({ value: nombre, errorMessage: '' })
                                        : toggleFavorito(idRuta, color, nombre)
                                }}
                                />

                            </View>
                        ))}
                    </View>
                    <View style={{ paddingHorizontal: 15 }}>
                        <MyButton onPress={activeButton} content={!isActive ? 'Agregar Favorito' : 'Finalizar'} />
                    </View>

                    {/* <SquareRoute contentColor='orange' bgColor='blue' content='Blvd' />
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
                        <SquareRoute contentColor='white' bgColor='red' content='S1' /> */}
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
        ...globalStyles.contenedor,

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
        flex: 1,


    },
    rowRoutes: {
        flexDirection: 'row',
        // justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
        flexWrap: 'wrap',
        paddingLeft: 7
    },
    rowRoutes2: {
        flexDirection: 'row',
        // justifyContent: 'center',
        // marginVertical: 10,
        marginHorizontal: 10,
        flexWrap: 'wrap',
        paddingLeft: 7
    },
    map: {
        flex: 1,
        width: "100%",
        height: 435,
    },
    flatListContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'white',
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 4,
        fontSize: 25,
        color: '#FFF',
        marginTop: 30,
        paddingVertical: 10,
    },
    dropdownSelector: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#8e8e8e',
        alignSelf: 'center',
        // flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'red',
    },
    dropdownArea: {
        width: '90%',
        height: 271,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: '#fff',
        elevation: 5,
        alignSelf: 'center',
        position: 'absolute',
    },
    searchInput: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#8e8e8e',
        alignSelf: 'center',
        marginTop: 20,
        paddingLeft: 15
    },
    rutasItem: {
        width: '85%',
        height: 50,
        borderBottomWidth: 0.2,
        borderBottomColor: '#8e8e8e',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'red',
        borderRadius: 10,
        marginVertical: 20,
    },
})

export default RoutesScreen