import React, { useContext, useEffect, useState } from 'react'
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Dimensions, Alert } from 'react-native'

import globalStyles from '../../../styles/GlobalStyles';
import logo from '../../../assets/logoentrada.png';
import Icon from 'react-native-vector-icons/FontAwesome';
//importando el translate
import '../translations/i18n';
import { useTranslation } from 'react-i18next';
import { postLogin, getLogin, postLoginDriver } from '../services/AuthServices'
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../../context/auth';
import auth from '@react-native-firebase/auth';


var height1 = Dimensions.get("window").height; //con height se multiplica por ejemp *0.02 y vamos probando por numero para encontrar el tamaño deseado
var width1 = Dimensions.get("window").width;

const LoginDrivers = ({ navigation }) => {



    const { t, i18n } = useTranslation();//funcion para pasar el valor del translate
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [showPassword, setShowPassword] = useState(true); //tru es se ve contraseña y false es no se ve contraseña
    const [emailError, setEmailError] = useState(''); //var para guardar el error de email
    const [passError, setPassError] = useState(''); //var para guardar el error de pass
    const [isLoading, setIsLoading] = useState(false);// ESTADO DE CUANDO SERA VISIBLE EL PROGRES BAR
    const [user, setUser] = useState();


    const { loginWithEmail, login } = useContext(AuthContext)
    /* AQI ES UN EJEMPLO DE COMO LLAMR A MS METODOS 
    DE AXIOS PARA EL API */
    /*  useEffect(() => {
       
       const handleLogin = async () => {
         try {
           const data = await postLogin();
           console.log(data);
         } catch (error) {
           console.error(error);
         }
       };
       handleLogin();
     }, []); */

    /* ARMANDO 23/02/2023
    ESTA FUNCION CAMBIA EL ESTADO
    DE MI VARIBALE SHOWPASSWORD PARA ASI
    MOSTRAR O OCULTAR LA CONTRASEÑA */
    const togglePassword = () => {
        setShowPassword(!showPassword)
        console.log(showPassword)
    }


    /* ARMANDO GOMEZ 23/02/2023
    ESTA FUNCION ES LA VALIDACION 
    DEL FORMILARIO */
    const validarForm = () => {

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;// validacion de correo validos

        if (correo === '') {
            //error
            console.log('Usuario esta vacio')
            setEmailError(t('loginEmail:messageError:emailVacio'));
            return false

        } else if (!emailRegex.test(correo)) {
            console.log('invalid: ', correo)
            setEmailError(t('loginEmail:messageError:emailInvalid'));
        } else if (pass === '') {
            //error pass
            console.log('Password vacio')
            setPassError(t('loginEmail:messageError:passVacio'));
            return false
        } else if (pass.length < 6) {
            console.log('entra')
            setPassError(t('loginEmail:messageError:passInvalid'));
        } else if (correo !== '' && pass !== '' || emailRegex.test(correo) || pass > 6) {
            setEmailError('');
            setPassError('');
            return true;
        }

    }

    const sendLogin = async () => {
        if (validarForm()) {
            console.log(correo)
            console.log(pass)

            setIsLoading(true)

            try {
                const response = await postLoginDriver(correo.trim(), pass.toString().trim());
                if (response.status === 200) {
                    console.log(response.status);
                    console.log(response.data);
                    navigation.navigate('Chofer', {
                        idConductor: response.data === null ? '' : response.data[0].idConductor,
                    });
                } else {
                    Alert.alert('Error al Iniciar Sesión', 'El correo electrónico o contraseña que ingresaste es incorrecto. Por favor, intenta nuevamente.');
                }
                setIsLoading(false)
            } catch (error) {
                console.error(error);
            }
        } else {
            //no hace nada 
        }
    }





    return (
        <SafeAreaView style={styles.contenedor} >
            <ScrollView>
                <View style={styles.centrarImgLogo} >

                    <Image style={styles.imagen}
                        source={logo}
                    >
                    </Image>
                    <Text style={{
                        color: '#FFF',
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: '700'
                    }} >{t('loginmethod:drivers')}</Text>
                </View>

                <View style={[styles.contenedorForm, { marginTop: height1 * 0.03 }]} >
                    <Text style={styles.texto} >{t('loginEmail:textViews:tv1')}</Text>
                    <TextInput style={styles.input}
                        placeholderTextColor='#FFF'
                        placeholder={t('loginEmail:holders:email')}
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        value={correo}
                        onChangeText={setCorreo}
                    />
                    {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
                </View>

                {/* ES EL PROGRES BAR DE CARGANDO */}
                <Spinner visible={isLoading} />

                <View style={styles.contenedorForm} >

                    <Text style={styles.texto} >{t('loginEmail:textViews:tv2')}</Text>

                    <View style={[styles.contentPass, styles.contentPass2]} >

                        <TextInput style={styles.inputPass}
                            placeholderTextColor='#FFF'
                            placeholder={t('loginEmail:holders:pass')}
                            autoCorrect={false}
                            autoCapitalize='none'
                            secureTextEntry={showPassword}
                            value={pass}
                            onChangeText={setPass}
                        />

                        <Pressable style={styles.btnShowPass}
                            onPress={() => {
                                togglePassword()
                                console.log('clic')
                            }} >
                            {!showPassword ? (<Image style={styles.iconEye}
                                source={require('../icons/eye.png')}
                            />) :
                                <Image style={styles.iconEye}
                                    source={require('../icons/eye-of.png')}
                                />
                            }
                        </Pressable>

                    </View>
                    {passError ? <Text style={styles.error}>{passError}</Text> : null}

                </View>

                <View style={styles.contenedorForm} >

                    <Pressable style={styles.btnInitSesion}
                        onPress={() => {
                            sendLogin()

                        }}
                    >
                        <Text style={styles.btnTexto}  >{t('loginEmail:btns:btnStartSesion')}</Text>
                    </Pressable>

                </View>

                <View style={styles.contenedorForm} >
                    <Text style={styles.textoRest} >{t('loginEmail:textViews:tv3')}</Text>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('RestablecerPass')
                        }}
                    >
                        <Text style={styles.btnTextRest} >{t('loginEmail:btns:btnRestPass')}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        width: '100%',
        height: '100%',
        marginBottom: '10%',
        ...globalStyles.contenedor

    },

    contenedorForm: {
        marginTop: height1 * 0.0001,
        marginBottom: '8%'
    },

    centrarImgLogo: {
        alignItems: 'center'
    },

    imagen: {
        width: 210,
        height: 225,
        marginTop: 30
    },

    texto: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: height1 * 0.018,
        fontWeight: '500'
    },

    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 4,
        fontSize: height1 * 0.025,
        color: '#FFF',
        marginTop: 30,
        marginHorizontal: width1 * 0.1,
        paddingVertical: 10,
    },

    inputPass: {
        flex: 12,
        fontSize: height1 * 0.025,
        color: '#FFF',
    },

    btnInitSesion: {
        ...globalStyles.btnColor,
        marginHorizontal: '30%',
        padding: 10,
        marginTop: 10,
        borderRadius: 10,
    },

    btnTexto: {
        color: '#FFF',
        fontSize: height1 * 0.02,
        fontWeight: '900',
        textAlign: 'center'
    },

    textoRest: {
        color: '#A52A2A',
        fontSize: height1 * 0.02,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10
    },

    btnTextRest: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: height1 * 0.02,
        fontWeight: 'bold'
    },

    iconEye: {
        height: 30,
        width: 30,
    },

    btnShowPass: {
        flex: 1,
        marginTop: 5
    },

    contentPass: {
        flexDirection: 'row'
    },

    contentPass2: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 4,
        marginTop: 30,
        marginHorizontal: width1 * 0.1,
        paddingVertical: 10,
    },

    error: {
        color: 'red',
        marginTop: 5,
        textAlign: 'center'
    },
})

export default LoginDrivers