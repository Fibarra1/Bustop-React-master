import React, { useRef, useState, useContext } from 'react'
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, Animated, ImageSourcePropType } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window')

interface Slide {
    title: string;
    desc: string;
    img: ImageSourcePropType
}

const items: Slide[] = [
    {
        title: 'Rutas',
        desc: 'Selecciona la Ruta que te interese para ver su ubicación en el mapa y su información.',
        img: require('../../assets/RouteAsset1.png')
    },
    {
        title: 'Buscador de Ruta',
        desc: 'En el buscador de rutas escribimos la Ruta que deseemos buscar y nos arrojara los resultados. ',
        img: require('../../assets/RouteAsset2.png')
    },
    {
        title: 'Favoritos',
        desc: 'Para agregar nuestras rutas favoritas es necesario seleccionar el boton agregar favoritos y posteriormente seleccionar las rutas que queramos agregar o quitar de Favoritos. Una vez terminemos de agregar o eliminar presionamos el boton Finalizar. ',
        img: require('../../assets/RouteAsset3.png')
    },
]


export const helpRoutes = () => {



    const [activeIndex, setActiveIndex] = useState(0);
    const isVisible = useRef(false)

    const renderItem = (item: Slide) => {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', borderRadius: 5, padding: 40, justifyContent: 'center' }}>
                <Image source={item.img} style={{ width: 350, height: 400, resizeMode: 'center' }} />
                <Text style={{ ...styles.title, color: 'red' }}>{item.title}</Text>
                <Text style={{ ...styles.subtitle, color: 'white' }}>{item.desc}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                // backgroundColor: 'red',
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
                // backgroundColor: 'red',
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
                        backgroundColor: 'black'
                    }}
                />
                <View>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        backgroundColor: 'black',
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
    )
}


const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#5856D6'
    },
    subtitle: {
        fontSize: 16
    }
})