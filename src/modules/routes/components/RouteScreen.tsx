import React, { useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ImageSourcePropType, Dimensions, Image, Modal } from 'react-native'
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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window')

interface Slide {
    title: string;
    desc: string;
    img: ImageSourcePropType
}

const items: Slide[] = [
    {
        title: 'Ruta',
        desc: 'En esta parte podremos ver la Ruta que seleccionamos en la pantalla de Rutas. ',
        img: require('../../../assets/RoutesAsset1.png')
    },
    {
        title: 'Ruta en el Mapa',
        desc: 'Aqui se mostrara el viaje completo de la Ruta y la ubicación de todas las paradas que la ruta tenga asi como la ubicación de las Unidades disponibles. ',
        img: require('../../../assets/RoutesAsset2.png')
    },
    {
        title: 'Paradas',
        desc: 'Cada vez que observemos en el mapa este icono significa que hay una parada en esa ubicación por donde pasara la Ruta. ',
        img: require('../../../assets/RoutesAsset3.png')
    },
]



export const RouteScreen = () => {

    const navigation = useNavigation()

    const route = useRoute();

    const params = route.params || {};

    // Desestructurar los valores con asignación predeterminada
    const { idRuta = '', color = '', nombre = '', colorLetra = '', abreviaturaRuta = '' } = params;

    const defaultIdRuta = idRuta || '';
    const defaultColor = color || '';
    const defaultNombre = nombre || '';
    const defaultColorLetra = colorLetra || '';
    const defaultAbreviaturaRuta = abreviaturaRuta || '';

    const origin = { latitude: 19.03, longitude: -98.20 };
    const destination = { latitude: 23.03, longitude: -110.20 };

    const { t } = useTranslation();


    const api_Directions = 'AIzaSyB9DcIvaDukFT5D8a4S7zbDlm_dismNVG8'

    const API_URL = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Paradas';
    const API_URL_Rutas = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/CordenadaRutas';


    const [position, setPosition] = useState({
        latitude: 19.0437335,
        longitude: -98.1980244
    });

    const getPosition = () => {
        Geolocation.getCurrentPosition((pos) => {
            const crd = pos.coords;
            setPosition({
                latitude: crd.latitude,
                longitude: crd.longitude,
            });
        });
    };

    useEffect(() => {
        getPosition()
    }, []);

    useEffect(() => {
        // Ejecutar la función cada 30 segundos
        const interval = setInterval(getPosition, 6000);

        // Limpieza: eliminar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []);

    const [paradas, setParadas] = useState([]);


    // useEffect(() => {
    //     axios.get(API_URL)
    //         .then(response => {
    //             setParadas(response.data);

    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // }, []);
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

    const [coordenadasRuta, setCoordenadasRuta] = useState(null);

    useEffect(() => {
        const url = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/CordenadaRutas/GetCordenadaByIdRuta';

        // Datos a enviar en el body de la solicitud POST
        const data = {
            id: defaultIdRuta,
        };

        // Realizar la solicitud POST utilizando Axios
        axios
            .post(url, data)
            .then((response) => {
                // Actualizar el estado con la respuesta de la API
                setCoordenadasRuta(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
            });
    }, [defaultIdRuta]);

    useEffect(() => {
        const url = `https://beautiful-mendel.68-168-208-58.plesk.page/api/RutasParadas/GetParadasByIdRuta/${defaultIdRuta}`;


        // Realizar la solicitud POST utilizando Axios
        axios.get(url)
            .then(response => {
                setParadas(response.data);

            })
            .catch(error => {
                // console.error(error);
            });
    }, [defaultIdRuta]);

    const [unidadesCoord, setUnidadesCoord] = useState([])

    useEffect(() => {
        const fetchData = () => {
            const url = `https://beautiful-mendel.68-168-208-58.plesk.page/api/Unidades/ubicacion-ultima/${defaultIdRuta}`;

            // Realizar la solicitud GET utilizando Axios
            axios
                .get(url)
                .then((response) => {
                    // Extraer latitudes y longitudes de los datos y guardarlas en un array
                    const ubicacionesArray = response.data.map((item) => ({
                        latitud: item.ultimaUbicacion.latitud,
                        longitud: item.ultimaUbicacion.longitud,
                    }));

                    // Guardar el array de ubicaciones en el estado
                    setUnidadesCoord(ubicacionesArray);
                })
                .catch((error) => {
                });
        };

        // Ejecutar fetchData inmediatamente al cargar el componente
        fetchData();

        // Configurar un intervalo para ejecutar fetchData cada 6 segundos
        const intervalId = setInterval(fetchData, 10000);

        // Limpiar el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, [defaultIdRuta]);


    const [activeIndex, setActiveIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const isVisible = useRef(false)

    const renderItem = (item: Slide) => {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', borderRadius: 5, padding: 40, justifyContent: 'center' }}>
                <Image source={item.img} style={{ width: 350, height: 400, resizeMode: 'center', right: 10 }} />
                <Text style={{ ...styles.title2, color: 'red' }}>{item.title}</Text>
                <Text style={{ ...styles.subtitle, color: 'white' }}>{item.desc}</Text>
            </View>
        )
    }





    // console.log(routeCoordinates.map(coordinate => ({ latitude: coordinate.latitud, longitude: coordinate.longitud })));


    return (
        <View style={styles.container}>
            <View>
                <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ position: 'absolute', paddingLeft: 300 }} onPress={() => setShowModal(true)}>
                    <Ionicons name="help-circle-outline" size={40} color='white' />
                </TouchableOpacity>
                <Text style={styles.title}>{t('route:title')}</Text>
            </View>

            <View style={styles.rowRoutes}>
                <SquareRoute contentColor={defaultColorLetra === '' ? 'black' : defaultColorLetra} bgColor={defaultColor === null ? 'white' : defaultColor} content={defaultAbreviaturaRuta === '' ? 'S/R' : defaultAbreviaturaRuta} />
            </View>

            <MapView style={styles.map}
                region={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 0.010,
                }}
            >
                {/* {


                        <MapViewDirections
                            origin="19.050278, -98.199833" // Latitud y longitud del origen
                            destination="19.048833, -98.201968"
                            apikey={api_Directions}
                            strokeWidth={8}
                            strokeColor="black"
                        />

                } */}



                <Marker
                    coordinate={{ latitude: position.latitude, longitude: position.longitude }}
                    title={"Tu ubicación"}
                    description={"Esta es tu ubicación actual."}
                >
                    <FontAwesome5 name="circle" size={20} color='#00B0FF' solid />
                </Marker>
                {paradas.map(({ nombre, longitud, latitud, idParada }, index) => (
                    <Marker
                        key={idParada}
                        coordinate={{
                            latitude: parseFloat(latitud),
                            longitude: parseFloat(longitud)
                        }}
                        title={nombre}
                        pinColor='#74cfe6'
                    >
                        <FontAwesome5Icon name="bus" size={20} color='#09578e' />
                    </Marker>
                ))}

                {unidadesCoord.length > 0 ? (
                    unidadesCoord.map((ubicacion, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: parseFloat(ubicacion.latitud),
                                longitude: parseFloat(ubicacion.longitud)
                            }}
                        >
                            <MaterialCommunityIcons name="bus-side" size={20} color='red' />
                        </Marker>

                    ))
                ) : null}


                {Array.isArray(coordenadasRuta) && coordenadasRuta[0] ? (
                    <MapViewDirections
                        origin={{
                            latitude: parseFloat(coordenadasRuta[0].latitud),
                            longitude: parseFloat(coordenadasRuta[0].longitud),
                        }}
                        destination={{
                            latitude: parseFloat(coordenadasRuta[0].latitud),
                            longitude: parseFloat(coordenadasRuta[0].longitud),
                        }}
                        waypoints={coordenadasRuta.slice(1, coordenadasRuta.length - 1).map((coordenada) => ({
                            latitude: parseFloat(coordenada.latitud),
                            longitude: parseFloat(coordenada.longitud),
                        }))}
                        apikey={api_Directions}
                        strokeWidth={3}
                        strokeColor={defaultColor}
                    />
                ) : null}
            </MapView>

            {showModal === true ? (
                <Modal>
                    <SafeAreaView
                        style={{
                            flex: 1,
                            backgroundColor: 'black',
                            paddingTop: 50,
                        }}
                    >

                        <Carousel
                            data={items}
                            renderItem={({ item }) => renderItem(item)}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth}
                            layout="default"
                            onSnapToItem={(index) => {
                                setActiveIndex(index)
                                if (index === 2) {
                                    isVisible.current = true;
                                }
                            }}
                        />
                        <View style={{
                            flexDirection: 'row',
                            alignContent: 'space-between',
                            backgroundColor: 'black',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginHorizontal: 20
                        }}>
                            <Pagination
                                dotsLength={items.length}
                                activeDotIndex={activeIndex}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 10,
                                    backgroundColor: 'red'
                                }}
                            />
                            <View>
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'red',
                                    width: 140,
                                    height: 50,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        if (isVisible.current) {
                                            console.log('navegar ...')
                                            // navigation.navigate('HomeScreen');
                                            setShowModal(false)
                                        }
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 25,
                                        color: 'white'
                                    }}>Aceptar</Text>
                                    {/* <Icon style={{ paddingTop: 4 }} name="chevron-forward-outline" color="white" size={25} /> */}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>

            ) : null}

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
        justifyContent: 'center',
        marginVertical: 20,
        marginHorizontal: 97
    },
    map: {
        width: "100%",
        height: 520

    },
    title2: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#5856D6'
    },
    subtitle: {
        fontSize: 16
    }
})
