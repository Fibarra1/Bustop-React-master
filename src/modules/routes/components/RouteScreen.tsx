import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next';
import '../../home/translations/i18n';
import SquareRoute from './SquareRoute';
import { MyInput } from '../../shared/components/MyInput'
import { MainLayout } from '../../layout/components/MainLayout';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';


export const RouteScreen = () => {



    return (
        <View style={styles.container}>
            <View>
                <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
            </View>
            <Text style={styles.title}>{"Ruta"}</Text>

            <View style={styles.rowRoutes}>
                <SquareRoute contentColor='red' bgColor='orange' content='10' />
                <SquareRoute contentColor='white' bgColor='purple' content='72' />
            </View>

            <MapView style={styles.map}
                showsUserLocation={true}
                followsUserLocation={true}
            />

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
        width: '100%',
        height: '100%',

    },
})
