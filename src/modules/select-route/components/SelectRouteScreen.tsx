import { useState, useMemo, useEffect, useRef } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Image, Modal, ImageSourcePropType, Dimensions } from "react-native"
import { useTranslation } from "react-i18next";
import '../../home/translations/i18n';
import Title from "./Title";
import Route from "./Route";
import { MyInput } from "../../shared/components/MyInput";
import { MainLayout } from "../../layout/components/MainLayout";
import { useOrientation } from "../../../hooks/useOrientation";
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';
import { MyButton } from '../../shared/components/MyButton';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import Carousel, { Pagination } from 'react-native-snap-carousel';

const GOOGLE_API_KEY = 'AIzaSyB9DcIvaDukFT5D8a4S7zbDlm_dismNVG8';

Geocoder.init(GOOGLE_API_KEY)

const { width: screenWidth } = Dimensions.get('window')

interface Slide {
    title: string;
    desc: string;
    img: ImageSourcePropType
}

const items: Slide[] = [
    {
        title: '¿A dónde quieres ir?',
        desc: 'Escribiremos en la parte de Origen la dirección de donde queremos iniciar nuestro viaje y en la parte de Destino escribiremos la dirección de a donde queremos llegar. ',
        img: require('../../../assets/SelectedRouteAsset1.png')
    },
    {
        title: 'Buscar',
        desc: 'Una vez que hayamos escrito nuestro Origen y Destino procederemos a darle al boton Buscar. ',
        img: require('../../../assets/SelectedRouteAsset2.png')
    },
    {
        title: 'Información de Ruta',
        desc: 'Se nos brindara la información de la Ruta que debes de tomar (Ubicación de la parada mas cercana, tiempo aproximado de viaje, distancia de la parada). ',
        img: require('../../../assets/SelectedRouteAsset3.png')
    },
]


const SelectRouteScreen = () => {

    const { t } = useTranslation();
    const { isPortrait } = useOrientation();
    const fontSize: number = useMemo(() => isPortrait ? 15 : 20, [isPortrait])

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [search, setSearch] = useState(false)
    const [paradaCercana, setParadaCercana] = useState({})
    const [parada, setParada] = useState()

    const handleSearch = async () => {
        const url = `https://beautiful-mendel.68-168-208-58.plesk.page/api/Paradas/ParadaMAsCercana`;
        setSearch(true)
        try {
            const originResponse = await Geocoder.from(origin);
            const originLatLng = originResponse.results[0].geometry.location;

            const destinationResponse = await Geocoder.from(destination);
            const destinationLatLng = destinationResponse.results[0].geometry.location;

            console.log('Origen:', originLatLng);
            console.log('Destino:', destinationLatLng);
            if (originLatLng.lat && destinationLatLng.lat) {
                const datosActualizados = {
                    "latOrigen": originLatLng.lat.toString(),
                    "lonOrigen": originLatLng.lng.toString(),
                    "latDestino": destinationLatLng.lat.toString(),
                    "lonDestino": destinationLatLng.lng.toString()
                };
                const response = await axios.post(url, datosActualizados);
                console.log(response.data);
                setParadaCercana(response.data)
            }
        } catch (error) {
            console.error('Error:', error);

        }
    };



    useEffect(() => {
        const fetchData = async () => {
            const urlParada = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Paradas/GetParadaById';
            const urlRuta = 'https://beautiful-mendel.68-168-208-58.plesk.page/api/Rutas/GetRutasById';

            const datosParada = {
                "Id": paradaCercana.idParada
            };

            const datosRuta = {
                "Id": paradaCercana.idRuta
            };

            const responseParada = await axios.post(urlParada, datosParada);
            const responseRuta = await axios.post(urlRuta, datosRuta);

            console.log('Parada', responseParada);
            console.log('Ruta', responseRuta);

        };

        if (paradaCercana) {
            fetchData();
        }
    }, [paradaCercana]);


    //height1 * 0.05

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


    return (
        <SafeAreaView style={styles.container}>
            <View>
                <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ position: 'absolute', paddingLeft: 300 }} onPress={() => setShowModal(true)}>
                    <Ionicons name="help-circle-outline" size={40} color='white' />
                </TouchableOpacity>
                <View style={{ marginBottom: 20 }}>
                    <Title title1={t('selectRoute:title1')} title2={t('selectRoute:title2')} />
                </View>
            </View>



            <GooglePlacesAutocomplete styles={{ container: { flex: 0 } }}
                placeholder={t('selectRoute:origin')}
                onPress={(data, details = null) => {
                    setOrigin(data.description);
                    console.log(data.description);


                }}
                query={{
                    key: GOOGLE_API_KEY,
                    language: 'es',
                }}


            />

            <GooglePlacesAutocomplete styles={{ container: { flex: 0 } }}
                placeholder={t('selectRoute:destiny')}
                onPress={(data, details = null) => {
                    setDestination(data.description);
                    console.log(data.description);

                }}
                query={{
                    key: GOOGLE_API_KEY,
                    language: 'es',
                }}

            />

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

            <MyButton onPress={handleSearch} content={t('selectRoute:search')} />
            {search === true ? <View style={styles.containerRoutes}>
                <Route iconUrl="https://biblioteca.ucm.es/fsl/file/logo-bus/?ver">
                    <Text style={[styles.routeText, styles.red, { fontSize }]}>Parada mas cercana</Text>
                    <Text style={[styles.routeText, { fontSize }]}>Sin Parada</Text>
                    <Text style={[styles.routeText, { fontSize }]}><Text style={styles.red}>00 Min</Text> caminando</Text>
                </Route>
                <Route numberRoutes={[{
                    number: 10,
                    bgColor: 'orange',
                    numberColor: 'red'
                }]}>
                    <Text style={[styles.routeText, { fontSize }]}>Sin Ruta</Text>
                    <Text style={[styles.routeText, { fontSize }]}>Tiempo aprox. de viaje <Text style={styles.red}>00 Min</Text> </Text>
                    <Text style={[styles.routeText, { fontSize }]}>Tiempo aprox. que llega a la</Text>
                    <Text style={[styles.routeText, { fontSize }]}>parada <Text style={styles.red}>00 Min</Text></Text>
                </Route>
                <Route numberRoutes={[
                    {
                        number: 33,
                        bgColor: 'white',
                        numberColor: 'red'
                    },
                    {
                        number: 72,
                        bgColor: 'purple',
                        numberColor: 'white'
                    }
                ]}>
                    <Text style={[styles.routeText, { fontSize }]}>Sin Ruta y luego Sin Ruta</Text>
                    <Text style={[styles.routeText, { fontSize }]}>Tiempo aprox. de viaje <Text style={styles.red}>00 Min</Text> </Text>
                    <Text style={[styles.routeText, { fontSize }]}>Tiempo aprox. que llega a la </Text>
                    <Text style={[styles.routeText, { fontSize }]}>parada <Text style={styles.red}>00 Min</Text></Text>
                </Route>

            </View> : null}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    containerRoutes: {
        marginTop: 10,
        gap: 20,
        marginHorizontal: 30,
        marginBottom: 10
    },
    routes: {

    },
    routeText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    red: {
        color: 'red',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        paddingTop: 10,
        zIndex: 0

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


export default SelectRouteScreen