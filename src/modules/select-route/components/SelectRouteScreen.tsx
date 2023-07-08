import { useState, useMemo } from 'react';
import { Text, StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next";
import '../../home/translations/i18n';
import Title from "./Title";
import Route from "./Route";
import { MyInput } from "../../shared/components/MyInput";
import { MainLayout } from "../../layout/components/MainLayout";
import { useOrientation } from "../../../hooks/useOrientation";
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';
import { MyButton } from '../../shared/components/MyButton';

const SelectRouteScreen = () => {

    const { t } = useTranslation();
    const { isPortrait } = useOrientation();
    const fontSize: number = useMemo(() => isPortrait ? 15 : 20, [isPortrait])

    const [origin, setOrigin] = useState({ value: '', errorMessage: '' });
    const [destiny, setDestiny] = useState({ value: '', errorMessage: '' });

    const handleOrigin = (value: string) => {
        setOrigin({ ...origin, value });
    }
    const handleDestiny = (value: string) => {
        setDestiny({ ...destiny, value });
    }

    const onSubmit = () => {
        setOrigin({value: '', errorMessage: ''});
        setDestiny({value: '', errorMessage: ''});
    }

    //height1 * 0.05


    return (
        <MainLayout>
            <View>
                <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
            </View>
            <Title title1={t('selectRoute:title1')} title2={t('selectRoute:title2')} />
            <View style={{ marginHorizontal: 50, }}>
                <MyInput
                    value={origin.value}
                    placeholder={t('selectRoute:origin')}
                    onChangeText={handleOrigin}
                    errorMessage={origin.errorMessage}
                />
                <MyInput
                    value={destiny.value}
                    placeholder={t('selectRoute:destiny')}
                    onChangeText={handleDestiny}
                    errorMessage={destiny.errorMessage}
                />
                <MyButton onPress={onSubmit} content={'Buscar'} />
            </View>
            <View style={styles.containerRoutes}>
                <Route iconUrl="https://biblioteca.ucm.es/fsl/file/logo-bus/?ver">
                    <Text style={[styles.routeText, styles.red, { fontSize }]}>Parada mas cercana</Text>
                    <Text style={[styles.routeText, { fontSize }]}>115A Oriente con 16 sur</Text>
                    <Text style={[styles.routeText, { fontSize }]}><Text style={styles.red}>2 Min</Text> caminando</Text>
                </Route>
                <Route numberRoutes={[{
                    number: 10,
                    bgColor: 'orange',
                    numberColor: 'red'
                }]}>
                    <Text style={[styles.routeText, { fontSize }]}>Ruta 10</Text>
                    <Text style={[styles.routeText, { fontSize }]}>Tiempo aprox. de viaje <Text style={styles.red}>30 Min</Text> </Text>
                    <Text style={[styles.routeText, { fontSize }]}>Tiempo aprox. que llega a la</Text>
                    <Text style={[styles.routeText, { fontSize }]}>parada <Text style={styles.red}>10 Min</Text></Text>
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
                    <Text style={[styles.routeText, { fontSize }]}>Ruta 33 y luego ruta 72</Text>
                    <Text style={[styles.routeText, { fontSize }]}>Tiempo aprox. de viaje <Text style={styles.red}>40 Min</Text> </Text>
                    <Text style={[styles.routeText, { fontSize }]}>Tiempo aprox. que llega a la </Text>
                    <Text style={[styles.routeText, { fontSize }]}>parada <Text style={styles.red}>2 Min</Text></Text>
                </Route>

            </View>
        </MainLayout>
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
        flexDirection: 'row',
        gap: 10,
    },
    routeText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    red: {
        color: 'red',
    }
})


export default SelectRouteScreen