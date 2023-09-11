import React, { useEffect, useState, useRef } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from 'react-native'
import { useTranslation } from 'react-i18next';
import Modal2 from 'react-native-modal';
import '../../home/translations/i18n';
import SquareRoute from './SquareRoute';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-admob/admob';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import { ImageSourcePropType } from 'react-native';
import { Dimensions } from 'react-native';
import { Image } from 'react-native';
import { Modal } from 'react-native';
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
    title: 'Reportes',
    desc: 'Al inicio se nos mostrara la Ruta y Unidad que disponemos y nos mostrara las opciones de Reportes que hay y que podremos seleccionar. ',
    img: require('../../../assets/ReportAsset1.png')
  },
  {
    title: 'Cambio de Ruta',
    desc: 'En la parte de Cambio de Ruta tendremos que seleccionar la opción de porque hubo cambio de Ruta y posteriormente darle al boton Aceptar. ',
    img: require('../../../assets/ReportAsset2.png')
  },
  {
    title: 'Otro',
    desc: 'En esta parte tendremos que poner una breve descripción del reporte y posteriormente darle al boton Aceptar. ',
    img: require('../../../assets/ReportAsset3.png')
  },
]





export const ReportScreen = () => {

  const route = useRoute();

  const params = route.params || {};

  // Desestructurar los valores con asignación predeterminada
  const { idRuta = '', color = '', nombre = '', colorLetra = '', abreviaturaRuta = '', numeroUnidad = '', idUnidad = '', idConductor = '' } = params;

  const defaultIdRuta = idRuta || '';
  const defaultColor = color || '';
  const defaultNombre = nombre || '';
  const defaultColorLetra = colorLetra || '';
  const defaultAbreviaturaRuta = abreviaturaRuta || '';
  const defaultNumeroUnidad = numeroUnidad || '';
  const defaultIdUnidad = idUnidad || '';
  const defaultIdConductor = idConductor || '';


  const { t } = useTranslation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleOther, setModalVisibleOther] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAccept = () => {
    // Aquí puedes hacer algo con la opción seleccionada, como enviarla a un servidor, etc.
    const fechaActual = new Date().toISOString();


    const requestData = {
      "idConductor": defaultIdConductor,
      "fecha": fechaActual,
      "reporte": selectedOption,
      "idRuta": defaultIdRuta,
      "idUnidad": defaultIdUnidad
    };
    // Aquí puedes hacer algo con el valor del TextInput, como enviarlo a un servidor, etc.
    console.log('Valor ingresado:', selectedOption);
    axios.post('https://beautiful-mendel.68-168-208-58.plesk.page/api/ReporteConductor', requestData)
      .then(response => {
        Alert.alert('Reporte', 'Se ha enviado correctamente el reporte.');
      })
      .catch(error => {
        console.error('Error fetching units:', error);
        Alert.alert('Error', 'No se ha podido enviar el reporte.');
      });
    toggleModal();
  };

  const toggleModalOther = () => {
    setModalVisibleOther(!isModalVisibleOther);
  };

  const handleAcceptOther = () => {

    const fechaActual = new Date().toISOString();

    const requestData = {
      "idConductor": defaultIdConductor,
      "fecha": fechaActual,
      "reporte": inputValue,
      "idRuta": defaultIdRuta,
      "idUnidad": defaultIdUnidad
    };
    // Aquí puedes hacer algo con el valor del TextInput, como enviarlo a un servidor, etc.
    console.log('Valor ingresado:', inputValue);
    axios.post('https://beautiful-mendel.68-168-208-58.plesk.page/api/ReporteConductor', requestData)
      .then(response => {
        Alert.alert('Reporte', 'Se ha enviado correctamente el reporte.');
      })
      .catch(error => {
        console.error('Error fetching units:', error);
        Alert.alert('Error', 'No se ha podido enviar el reporte.');
      });
    toggleModalOther();
  };

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
    <View style={styles.container}>
      <View>
        <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 30 }}>
        <TouchableOpacity style={{ position: 'absolute', paddingLeft: 300 }} onPress={() => setShowModal2(true)}>
          <Ionicons name="help-circle-outline" size={40} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.rowRoutes}>
        <FontAwesome5 name="exclamation-triangle" size={100} color='red' style={{ paddingBottom: 20 }} />
        <SquareRoute contentColor={defaultColorLetra === null ? 'black' : defaultColorLetra} bgColor={defaultColor === null ? 'white' : defaultColor} content={defaultAbreviaturaRuta === null ? 'S/R' : defaultAbreviaturaRuta} />
        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 23, paddingTop: 15, paddingBottom: 20 }}>
          {defaultNumeroUnidad === null ? 'Sin Unidad' : `U - ${defaultNumeroUnidad}`}
        </Text>
        <TouchableOpacity style={[styles.button1]}>
          <View style={[styles.content1]}>
            <Text style={styles.text1} >
              Falla Mecánica
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button1]}>
          <View style={[styles.content1]}>
            <Text style={styles.text1} onPress={toggleModal} >
              Cambio de Ruta
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button1]} onPress={toggleModalOther}>
          <View style={[styles.content1]}>
            <Text style={styles.text1}>
              Otro
            </Text>
          </View>
        </TouchableOpacity>


      </View>
      <Modal2 isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={{ backgroundColor: 'white', padding: 16 }}>
          <Text style={styles.text1}>Selecciona una opción:</Text>

          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}
          >
            <Picker.Item style={styles.text1} label="Opciones" value="Accidentes" />
            <Picker.Item style={styles.text1} label="Accidentes" value="Accidentes" />
            <Picker.Item style={styles.text1} label="Obras Públicas" value="Obras Publicas" />
            <Picker.Item style={styles.text1} label="Manifestación" value="Manifestacion" />
          </Picker>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <TouchableOpacity onPress={toggleModal} style={{ backgroundColor: 'red', padding: 8, borderRadius: 10 }}>
              <Text style={styles.text2}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAccept} style={{ backgroundColor: '#20BF27', padding: 8, borderRadius: 10 }}>
              <Text style={styles.text2}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal2>

      <Modal2 isVisible={isModalVisibleOther} onBackdropPress={toggleModalOther}>
        <View style={{ backgroundColor: 'white', padding: 16 }}>
          <Text style={[styles.text1, { paddingBottom: 10 }]}>Ingresa un Descripción:</Text>

          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            style={{ borderColor: 'gray', borderWidth: 2, paddingHorizontal: 8, marginBottom: 16, borderRadius: 5, fontSize: 20 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={toggleModalOther} style={{ backgroundColor: 'red', padding: 8, borderRadius: 10 }}>
              <Text style={styles.text2}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAcceptOther} style={{ backgroundColor: '#20BF27', padding: 8, borderRadius: 10 }}>
              <Text style={styles.text2}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal2>

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




    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
    height: 480

  },
  button1: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 20,
  },
  content1: {
    paddingVertical: 10,
    paddingHorizontal: 80
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
