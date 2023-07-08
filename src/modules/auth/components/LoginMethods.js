import React from 'react'
import { Button, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, useWindowDimensions, PermissionsAndroid, ScrollView, Dimensions } from 'react-native'

import '../translations/i18n';
import { useTranslation } from 'react-i18next';
import img1 from '../../../assets/logoentrada.png';
import imgGoolge from '../icons/googleIcon.png';
import imgFacebook from '../icons/facebookIcon.png';
import imgEmail from '../icons/email.png';
import globalStyles from '../../../styles/GlobalStyles';
import Login from './Login';
import { useContextAuth } from '../../../context/auth';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { BannerAd, TestIds, BannerAdSize } from '@react-native-admob/admob';

var height1 = Dimensions.get("window").height; //con height se multiplica por ejemp *0.02 y vamos probando por numero para encontrar el tamaño deseado
var width1 = Dimensions.get("window").width;

const LoginMethods = ({ navigation }) => {





  const { t, i18n } = useTranslation();

  const { loginWithGoogle, loginWithFacebook } = useContextAuth()

  const changeLanguage = value => {
    i18n.changeLanguage(value)
      .then(() => {
        console.log('LENGUAJE ALTERADO')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Bustop',
            message: 'Bustop necesita acceso a su ubicación para funcionar correctamente.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permiso de ubicación concedido.');
        } else {
          console.log('Permiso de ubicación denegado.');
        }
      } else {
        Geolocation.requestAuthorization('whenInUse').then((result) => {
          console.log('Permiso de ubicación concedido.');
        }).catch((error) => {
          console.log('Permiso de ubicación denegado.');
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestLocationPermission();


  // const handleFacebookLogin = async () => {
  //   try {
  //     const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  //     if (result.isCancelled) {
  //       throw new Error('El inicio de sesión con Facebook fue cancelado.');
  //     }

  //     const data = await AccessToken.getCurrentAccessToken();

  //     if (!data) {
  //       throw new Error('No se ha proporcionado ningún token de acceso de Facebook.');
  //     }

  //     const credential = auth.FacebookAuthProvider.credential(data.accessToken);

  //     await auth().signInWithCredential(credential);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const handleFacebookLogin = async () => {
    // Solicita los permisos necesarios a través del LoginButton
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result) => {
        if (result.isCancelled) {
          console.log('Inicio de sesión cancelado');
        } else {
          // Obtiene el token de acceso de Facebook
          AccessToken.getCurrentAccessToken().then((data) => {
            const facebookCredential = auth.FacebookAuthProvider.credential(
              data.accessToken
            );

            // Inicia sesión en Firebase con las credenciales de Facebook
            auth()
              .signInWithCredential(facebookCredential)
              .then((userCredential) => {
                // El usuario ha iniciado sesión correctamente
                const user = userCredential.user;
                console.log('Usuario de Firebase:', user);
              })
              .catch((error) => {
                console.log('Error al iniciar sesión:', error);
              });
          });
        }
      },
      (error) => {
        console.log('Error al iniciar sesión con Facebook:', error);
      }
    );
  };


  // async function onFacebookButtonPress() {
  //   // Attempt login with permissions
  //   const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  //   if (result.isCancelled) {
  //     throw 'User cancelled the login process';
  //   }

  //   // Once signed in, get the users AccesToken
  //   const data = await AccessToken.getCurrentAccessToken();

  //   if (!data) {
  //     throw 'Something went wrong obtaining access token';
  //   }

  //   // Create a Firebase credential with the AccessToken
  //   const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(facebookCredential);
  // }



  return (
    <SafeAreaView style={styles.contenedor} >
      <ScrollView>

        <View style={styles.centrarImgLogo} >
          <Image style={styles.imagen}
            source={img1}
          ></Image>
        </View>

        <View style={styles.contenedorForm} >
          <Pressable style={[styles.btnLogins, styles.btnGoogle]}

            onPress={() => loginWithGoogle()}

          >
            <View style={styles.btnContenedor}>
              <Image style={styles.btnIcon} source={imgGoolge} />
              <Text style={styles.btnTextoGoogle} >{t('loginmethod:google')}</Text>
            </View>
          </Pressable>
          <Pressable style={[styles.btnLogins, styles.btnFacebook]}

            onPress={() => loginWithFacebook()}

          >
            <View style={styles.btnContenedor} >
              <Image style={styles.btnIcon} source={imgFacebook} />
              <Text style={styles.btnTexto} >{t('loginmethod:facebook')}</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.btnLogins, styles.btnCorreo]}
            onPress={() => navigation.navigate('Login')}
          >
            <View style={styles.btnContenedor} >
              <Image style={styles.btnIcon} source={imgEmail} />
              <Text style={styles.btnTexto} >{t('loginmethod:email')}</Text>
            </View>
          </Pressable>


        </View>

        <View style={styles.contenedorRegis} >
          <Text style={styles.textoReg} >{t('loginmethod:letacount')}</Text>
          <Pressable
            onPress={() => {
              navigation.navigate('RegistroDeUsuarios')
            }}
          >
            <Text style={styles.btnTextRegis} >{t('loginmethod:letreg')}</Text>
          </Pressable>

          <Pressable style={[styles.btnLogins, styles.btnCorreo]}
            onPress={() => navigation.navigate('RestablecerPass')}
          >
            <View style={styles.btnContenedor} >
              <Text style={styles.btnTexto} >{t('Recuperar Contraseña')}</Text>
            </View>
          </Pressable>
        </View>

        <View>
          <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={TestIds.BANNER} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%',
    ...globalStyles.contenedor

  },

  contenedorForm: {
    marginTop: '10%'
  },

  contenedorRegis: {
    marginBottom: 30,
  },

  centrarImgLogo: {
    alignItems: 'center'
  },

  imagen: {
    width: 210,
    height: 225,
    marginTop: 30
  },

  btnLogins: {
    marginHorizontal: '20%',
    paddingVertical: '1%',
    marginTop: 10,
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },

  btnContenedor: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  btnGoogle: {
    backgroundColor: '#FFF',
    alignItems: 'center'

  },

  btnFacebook: {
    backgroundColor: '#1877F2',
    alignItems: 'center'
  },

  btnCorreo: {
    ...globalStyles.btnColor,
    alignItems: 'center'
  },

  btnTexto: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: height1 * 0.02
  },

  btnTextoGoogle: {
    color: '#000000',
    fontWeight: '700',
    fontSize: height1 * 0.02
  },

  btnIcon: {
    width: 24,
    height: 24,
    marginEnd: 4,

  },

  textoReg: {
    color: '#A52A2A',
    fontSize: height1 * 0.02,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '18%'
  },

  btnTextRegis: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: height1 * 0.02,
    fontWeight: 'bold'
  },

})

export default LoginMethods