import React, { useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Button, Alert, ImageSourcePropType, Dimensions, Image, Modal } from 'react-native'
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
import { useNavigation } from '@react-navigation/native';
import Modal2 from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { MyButton } from '../../shared/components/MyButton';
import { useRoute } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel, { Pagination } from 'react-native-snap-carousel';


const { width: screenWidth } = Dimensions.get('window')

interface Slide {
    title: string;
    desc: string;
    img: ImageSourcePropType
}

const items: Slide[] = [
    {
        title: 'Iniciar Ruta',
        desc: 'Una vez que hayamos iniciado sesión como Conductor tendremos que presionar el boton Iniciar Ruta. ',
        img: require('../../../assets/ChoferAsset1.png')
    },
    {
        title: 'Seleccionar Ruta y Unidad',
        desc: 'Despues de que hayamos presionado Iniciar Ruta nos mostrara un panel en donde tendremos que seleccionar la Ruta y despues la Unidad que usara. ',
        img: require('../../../assets/ChoferAsset2.png')
    },
    {
        title: 'Finalizar Ruta',
        desc: 'Cuando desee finalizar la Ruta le daremos al boton Terminar Ruta. ',
        img: require('../../../assets/ChoferAsset3.png')
    },
]




export const ChoferScreen = () => {

    const route = useRoute();

    const params = route.params || {};

    // Desestructurar los valores con asignación predeterminada
    const { idConductor = '' } = params;

    const defaultIdConductor = idConductor || '';

    const navigation = useNavigation()



    const { t } = useTranslation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [selection, setSelection] = useState(false);


    useEffect(() => {
        // Comenzar a observar la ubicación actual
        const watchId = Geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;
            },
            error => console.log(error),
            { enableHighAccuracy: true, distanceFilter: 10 }
        );

        // Detener la observación cuando el componente se desmonte
        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);



    const API_URL = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Paradas';
    const API_RUTAS = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Rutas';

    const API_URL_Rutas = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/CordenadaRutas';

    const [rutas, setRutas] = useState([]);

    useEffect(() => {
        axios.get(API_RUTAS)
            .then(response => {
                setRutas(response.data);

            })
            .catch(error => {
                console.error(error);
            });
    }, []);


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
        console.log(position)
    }, []);

    useEffect(() => {
        // Ejecutar la función cada 6 segundos
        const interval = setInterval(getPosition, 6000);

        // Limpieza: eliminar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
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

    const handleRouteSelection = (route) => {
        setSelectedRoute(route);
        console.log(route)
    };

    const handleUnitSelection = (unit) => {
        setSelectedUnit(unit);
        console.log(unit)
    };

    const [units, setUnits] = useState([])

    const getUnits = (idRuta) => {
        // Prepare the data to send in the request body
        const requestData = { idRuta: idRuta };

        // Fetch units for the selected route from the API using POST method
        axios.post('https://beautiful-mendel.68-168-208-58.plesk.page/api/Unidades/GetUnidadesByRuta', requestData)
            .then(response => {
                setUnits(response.data);
            })
            .catch(error => {
                console.error('Error fetching units:', error);
                Alert.alert('Alerta', 'No se encontraron Unidades para esta Ruta.');
                setUnits([])
            });
    }

    const handleSelection = (route, unit) => {

        const url = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Turnos';

        const fechaActual = new Date().toISOString();

        if (route !== null && unit !== null) {// Datos a enviar en el body de la solicitud POST
            const data = {
                idConductor: defaultIdConductor,
                idRuta: route.idRuta,
                idUnidad: unit.idUnidad,
                fechaActual: fechaActual

            };

            // Realizar la solicitud POST utilizando Axios
            axios
                .post(url, data)
                .then((response) => {
                    // Actualizar el estado con la respuesta de la API
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error('Error al publicar los datos:', error);
                });
        }
        setSelection(true)
        setModalVisible(false);
    };

    const handleCleanRute = () => {
        setSelection(false)
        setSelectedUnit(null)
        setSelectedOption(null)
        setSelectedOption2(null)
        setSelectedRoute(null)
    }

    // console.log(routeCoordinates.map(coordinate => ({ latitude: coordinate.latitud, longitude: coordinate.longitud })));

    const [activeIndex, setActiveIndex] = useState(0);
    const [showModal2, setShowModal2] = useState(false);
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


    return (
        <View>

                {showModal2 === true ? (
                    <Modal>
                        <SafeAreaView
                            style={{
                                flex: 1,
                                backgroundColor: 'black',
                                paddingTop: 50,
                                zIndex: 1
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
                                                setShowModal2(false)
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
            <View style={styles.container}>
                <View>
                    <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 30, zIndex: 1 }}>
                    <TouchableOpacity style={{ position: 'absolute', paddingLeft: 300 }} onPress={() => setShowModal2(true)}>
                        <Ionicons name="help-circle-outline" size={40} color='white' />
                    </TouchableOpacity>
                </View>
                {selection === true ? <View style={styles.rowRoutes}>
                    <SquareRoute onPress={() => setModalVisible(true)} contentColor={selectedRoute === null ? 'black' : selectedRoute.colorLetra} bgColor={selectedRoute === null ? 'white' : selectedRoute.color} content={selectedRoute === null ? 'S/R' : selectedRoute.abreviaturaRuta} />
                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 23, paddingTop: 15, paddingBottom: 20 }}>
                        {selectedUnit === null ? 'Sin Unidad' : `U - ${selectedUnit.numeroUnidad}`}
                    </Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Report', {
                            idRuta: selectedRoute === null ? 'S/R' : selectedRoute.idRuta,
                            color: selectedRoute === null ? 'white' : selectedRoute.color,
                            nombre: selectedRoute === null ? 'Sin Ruta' : selectedRoute.nombre,
                            colorLetra: selectedRoute === null ? 'black' : selectedRoute.colorLetra,
                            abreviaturaRuta: selectedRoute === null ? 'S/R' : selectedRoute.abreviaturaRuta,
                            numeroUnidad: selectedUnit === null ? 'Sin Unidad' : selectedUnit.numeroUnidad,
                            idUnidad: selectedUnit === null ? '0' : selectedUnit.idUnidad,
                            idConductor: defaultIdConductor
                        });
                    }}>
                        <FontAwesome5 name="exclamation-triangle" size={80} color='red' />
                    </TouchableOpacity>
                    <MyButton onPress={handleCleanRute} content={'     Terminar Ruta     '} />
                </View>

                    :
                    <View style={{ paddingHorizontal: 23, paddingVertical: 120 }}>
                        <MyButton onPress={() => setModalVisible(true)} content={'Iniciar Ruta'} />
                    </View>
                }


                <Modal2
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20 }}>
                            <Text style={styles.text1}>Selecciona una ruta:</Text>
                            <Picker
                                selectedValue={selectedOption}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedOption(itemValue);
                                    if (itemValue) {
                                        getUnits(itemValue.idRuta);
                                    }
                                }}
                            >
                                <Picker.Item key={null} style={styles.text1} label="Rutas" value={null} />
                                {rutas.map((route) => (

                                    <Picker.Item key={route.idRuta} style={styles.text1} label={route.nombre} value={route} />

                                ))}
                            </Picker>
                            {units.length > 0 && (<View>
                                <Text style={styles.text1}>Selecciona una unidad:</Text>
                                <Picker
                                    selectedValue={selectedOption2}
                                    onValueChange={(itemValue, itemIndex) => { setSelectedOption2(itemValue); }}
                                >
                                    <Picker.Item key={null} style={styles.text1} label="Unidades" value={null} />
                                    {units.map((unit) => (
                                        <Picker.Item style={styles.text1} key={unit.unidad.idUnidad} label={`Unidad ${unit.unidad.numeroUnidad}`} value={unit.unidad} />
                                    ))}
                                </Picker>

                            </View>)}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => { setModalVisible(false) }} style={{ backgroundColor: 'red', padding: 8, borderRadius: 10 }}>
                                    <Text style={styles.text2}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { handleSelection(selectedOption, selectedOption2); handleRouteSelection(selectedOption); handleUnitSelection(selectedOption2) }} style={{ backgroundColor: '#20BF27', padding: 8, borderRadius: 10 }}>
                                    <Text style={styles.text2}>Aceptar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal2>




                <MapView style={styles.map}
                    region={{
                        latitude: position.latitude,
                        longitude: position.longitude,
                        latitudeDelta: 0,
                        longitudeDelta: 0.005,
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


                </MapView>

            </View >
        </View>

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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
        // marginHorizontal: 97
    },
    map: {
        width: "100%",
        height: 450

    },
    text1: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 20
    },
    text2: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 20
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
