import React, { useEffect, useState } from 'react'

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Dimensions, Alert } from 'react-native'
import CheckBox from '@react-native-community/checkbox';

//importando el translate
import '../translations/i18n';
import { useTranslation } from 'react-i18next';
import globalStyles from '../../../styles/GlobalStyles';
import UserRegisterModel from '../models/UserRegisterModel'

import { postRegisterUser } from '../services/AuthServices';
import Spinner from 'react-native-loading-spinner-overlay';


var height1 = Dimensions.get("window").height; //con height se multiplica por ejemp *0.02 y vamos probando por numero para encontrar el tamaño deseado
var width1 = Dimensions.get("window").width;
//https://blog.logrocket.com/complete-guide-textinput-react-native/


const RegisterUser = ({ navigation }) => {

    const { t, i18n } = useTranslation();//funcion para pasar el valor del translate
    const [nombre, setNombre] = useState('');
    const [apPa, setApPa] = useState('');
    const [apMa, setApMa] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [checked, setChecked] = useState(false);
    //mensajes de error del form
    const [errorNombre, setErrorNombre] = useState('');
    const [errorApPa, setErrorApPa] = useState('');
    const [errorApMa, setErrorApMa] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorCel, setErrorCel] = useState('');
    const [errorPass1, setErrorPass1] = useState('');
    const [errorPass2, setErrorPass2] = useState('');
    const [errorCheck, setErrorCheck] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const validFormRegister = () => {

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;// validacion de correo validos

        if (nombre === '') {
            setErrorNombre(t('registeruser:messageError:campoVacio'));
            return false;
        } else if (nombre.length < 3) {
            setErrorNombre(t('registeruser:messageError:nameInvalid'))
            return false;
        } else if (apPa === '') {
            setErrorApPa(t('registeruser:messageError:campoVacio'));
            return false;
        } else if (apPa.length < 3) {
            setErrorApPa(t('registeruser:messageError:apPaInvalid'))
            return false;
        } else if (apMa === '') {
            setErrorApMa(t('registeruser:messageError:campoVacio'));
            return false;
        } else if (apMa.length < 3) {
            setErrorApMa(t('registeruser:messageError:apMaInvalid'));
            return false;
        } else if (email === '') {
            setErrorEmail(t('registeruser:messageError:campoVacio'));
            return false;
        } else if (!emailRegex.test(email)) {
            setErrorEmail(t('registeruser:messageError:emailInvalid'));
            return false;
        } else if (tel.length != 10) {
            setErrorCel(t('registeruser:messageError:celInvalid'));
            return false;
        } else if (pass1.length < 8) {
            setErrorPass1(t('registeruser:messageError:passInvalid')); //VALIDACION DE PASS 1 PASAR POR EL TRADUCTOR
            return false;
        } else if (pass1 !== pass2) {
            setErrorPass2(t('registeruser:messageError:passInvalid2')); //VALIDACION DE PASSWORD1 CON PASS 2
            return false;
        } else if (checked === false) {
            setErrorCheck(t('registeruser:messageError:checkSelect'))
            return false;
        }
        /* PREOVAR LA VALIDACION DE PASSWORDS */

        setErrorNombre('')
        setErrorApPa('')
        setErrorApMa('')
        setErrorEmail('')
        setErrorCel('')
        setErrorPass1('')
        setErrorPass2('')
        setErrorCheck('')
        return true;
    }

    const cleanInputs = () => {
        setNombre('');
        setApMa('');
        setApPa('');
        setEmail('');
        setTel('');
        setPass1('');
        setPass2('');
        setChecked(false)
    }

    const sendFormRegist = async () => {
        if (validFormRegister()) {

            console.log('SE GUARDO CON EXITO', checked)
            console.log(nombre)

            setIsLoading(true)

            const newUser = new UserRegisterModel(nombre, apMa, apPa, email, tel, pass2);
            console.log(newUser)
            //aqui ami funcion de axios le mando este newUser de tipo modelo UserRegisterModels

            try {
                const response = await postRegisterUser(newUser);

                console.log(response.data);
                console.log(response.status);
                setIsLoading(false);
                Alert.alert(
                    'Registro Exitoso',
                    'El usuario se registro exitosamente.....',
                    [
                        {
                            text: 'Aceptar', onPress: () => {
                                console.log('Reenviar a login')
                                cleanInputs();
                                navigation.goBack();
                            }
                        },
                    ],
                    { cancelable: false }
                );

            } catch (error) {
                console.error(error);
            }

        }
    }

    return (
        <SafeAreaView style={styles.contenedor} >

            <ScrollView>

                <View>
                    <Text style={styles.tituloComponent} >{t('registeruser:header:title')}</Text>
                </View>

                <View style={styles.contenedorForm} >

                    <View>
                        <TextInput
                            placeholder={t('registeruser:holders:name')}
                            placeholderTextColor='#FFF'
                            style={styles.input}
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        {errorNombre ? <Text style={styles.error}>{errorNombre}</Text> : null}
                    </View>


                    {/* ES EL PROGRES BAR DE CARGANDO */}
                    <Spinner visible={isLoading} />

                    <TextInput
                        placeholder={t('registeruser:holders:appa')}
                        placeholderTextColor='#FFF'
                        style={styles.input}
                        value={apPa}
                        onChangeText={setApPa}
                    />
                    {errorApPa ? <Text style={styles.error}>{errorApPa}</Text> : null}
                    <TextInput
                        placeholder={t('registeruser:holders:apma')}
                        placeholderTextColor='#FFF'
                        style={styles.input}
                        value={apMa}
                        onChangeText={setApMa}
                    />
                    {errorApMa ? <Text style={styles.error}>{errorApMa}</Text> : null}

                    <TextInput
                        placeholder={t('registeruser:holders:email')}
                        placeholderTextColor='#FFF'
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                    {errorEmail ? <Text style={styles.error}>{errorEmail}</Text> : null}

                    <TextInput
                        placeholder={t('registeruser:holders:cel')}
                        placeholderTextColor='#FFF'
                        style={styles.input}
                        value={tel}
                        onChangeText={setTel}

                    />
                    {errorCel ? <Text style={styles.error}>{errorCel}</Text> : null}

                    <TextInput
                        placeholder={t('registeruser:holders:password')}
                        placeholderTextColor='#FFF'
                        style={styles.input}
                        value={pass1}
                        onChangeText={setPass1}

                    />
                    {errorPass1 ? <Text style={styles.error}>{errorPass1}</Text> : null}

                    <TextInput
                        placeholder={t('registeruser:holders:reppassword')}
                        placeholderTextColor='#FFF'
                        style={styles.input}
                        value={pass2}
                        onChangeText={setPass2}

                    />
                    {errorPass2 ? <Text style={styles.error}>{errorPass2}</Text> : null}

                    <View style={styles.contenedorCheck}  >
                        <CheckBox
                            color="#FFF" // Establece el color del checkbox cuando no está marcado
                            tintColors={{ true: '#368098' }}
                            value={checked}
                            onValueChange={setChecked}
                        ></CheckBox>

                        <Text style={[styles.texto, styles.textoCheck]} >{t('registeruser:letterminos')}</Text>
                        <Pressable style={styles.btnPoliticas} ><Text style={[styles.texto, styles.textoCheckLink]} >{t('registeruser:letterminoslink')}</Text></Pressable>
                    </View>
                    {errorCheck ? <Text style={styles.error}>{errorCheck}</Text> : null}

                    <View style={styles.contenedorBtnGuardar} >
                        <Pressable style={styles.btnGuardar}
                            onPress={() => {


                                sendFormRegist()
                                //Alert.alert(t('registeruser:alert:title'),t('registeruser:alert:body'))
                            }}
                        >
                            <Text style={styles.btnTextGuardar} >{t('registeruser:btns:btnSave')}</Text>
                        </Pressable>
                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        width: '100%',
        height: '100%',
        marginBottom: '10%',
        ...globalStyles.contenedor
    },

    tituloComponent: {
        color: '#FFF',
        textAlignVertical: 'center',
        marginTop: '5%',
        textAlign: 'center',
        fontSize: height1 * 0.06,//asi se consige las letras responsivas
        fontWeight: '900'
    },

    contenedorForm: {
        alignItems: 'center',
        marginTop: height1 * 0.01
    },

    progres: {
        backgroundColor: '#FFFF'
    },

    input: {
        width: width1 * 0.8,
        borderBottomColor: 'gray',
        borderBottomWidth: 4,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: height1 * 0.025,
        color: '#FFF',
        marginTop: height1 * 0.04
    },

    contenedorCheck: {
        width: width1 * 0.9,
        marginTop: height1 * 0.02,
        flexDirection: 'row'
    },

    textoCheck: {
        color: '#FFF',
        textAlignVertical: 'center',
        fontWeight: '700',
    },

    textoCheckLink: {
        color: 'red',
        textAlignVertical: 'center',
    },

    texto: {
        fontSize: height1 * 0.022,
    },

    btnPoliticas: {
        flexDirection: 'row'
    },

    contenedorBtnGuardar: {
        marginTop: height1 * 0.05,
        marginBottom: height1 * 0.02
    },

    btnGuardar: {
        ...globalStyles.btnColor,
        borderRadius: 10,
        padding: 10,
    },

    btnTextGuardar: {
        fontSize: height1 * 0.025,
        fontWeight: '700'
    },

    error: {
        color: 'red',
        marginTop: 5,
        marginBottom: -10,
        textAlign: 'center'
    },
})

export default RegisterUser