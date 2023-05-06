import { useState, useMemo } from 'react';
import { Text, StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next";
import '../../home/translations/i18n';
import Title from "./Title";
import Route from "./Route";
import { MyInput } from "../../shared/components/MyInput";
import { MainLayout } from "../../layout/components/MainLayout";
import { useOrientation } from "../../../hooks/useOrientation";

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

    //height1 * 0.05


    return (
        <MainLayout>
            <Title title1={t('selectRoute:title1')} title2={t('selectRoute:title2')} />
            <View style={{ marginHorizontal: 50, }}>
                <MyInput
                    value={origin.value}
                    placeholder={t('selectRoute:origin')}
                    onChangeText={handleOrigin}
                    errorMessage={origin.errorMessage}
                />
                <MyInput
                    value={origin.value}
                    placeholder={t('selectRoute:destiny')}
                    onChangeText={handleDestiny}
                    errorMessage={destiny.errorMessage}
                />
                <View style={styles.containerRoutes}>
                    <Route iconUrl="https://biblioteca.ucm.es/fsl/file/logo-bus/?ver">
                        <Text style={[styles.routeText, styles.red, { fontSize }]}>Parada mas cercana</Text>
                        <Text style={[styles.routeText, { fontSize }]}>115A Oriente con 16 sur</Text>
                        <Text style={[styles.routeText, { fontSize }]}><Text style={styles.red}>2 min</Text> caminando</Text>
                    </Route>
                    <Route numberRoutes={[{
                        number: 10,
                        bgColor: 'orange',
                        numberColor: 'red'
                    }]}>
                        <Text style={[styles.routeText, { fontSize }]}>Ruta 10</Text>
                        <Text style={[styles.routeText, { fontSize }]}>tiempo aprox de viaje <Text style={styles.red}>30 min</Text> </Text>
                        <Text style={[styles.routeText, { fontSize }]}>tiempo aprox que llega a la parada <Text style={styles.red}>10 min</Text></Text>
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
                        <Text style={[styles.routeText, { fontSize }]}>tiempo aprox de viaje <Text style={styles.red}>40 min</Text> </Text>
                        <Text style={[styles.routeText, { fontSize }]}>tiempo aprox que llega a la parada <Text style={styles.red}>2 min</Text></Text>
                    </Route>

                </View>
            </View>
        </MainLayout>
    )
}

const styles = StyleSheet.create({
    containerRoutes: {
        marginTop: 30,
        gap: 20,
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