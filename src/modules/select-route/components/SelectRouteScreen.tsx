import { useState, useMemo, useEffect } from 'react';
import { Text, StyleSheet, View, SafeAreaView } from "react-native"
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

const GOOGLE_API_KEY = 'AIzaSyB9DcIvaDukFT5D8a4S7zbDlm_dismNVG8';

Geocoder.init(GOOGLE_API_KEY)

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


    return (
        <SafeAreaView style={styles.container}>
            <View>
                <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
            </View>
            <Title title1={t('selectRoute:title1')} title2={t('selectRoute:title2')} />



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

    }
})


export default SelectRouteScreen