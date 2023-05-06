import React, {useState} from 'react'
import { SafeAreaView, StyleSheet, Dimensions, Pressable, View, TextInput, Text, ScrollView,Image,Alert } from 'react-native'

var height1 = Dimensions.get("window").height; //con height se multiplica por ejemp *0.02 y vamos probando por numero para encontrar el tamaño deseado
var width1 = Dimensions.get("window").width;

//importando el translate
import '../translations/i18n';
import { useTranslation } from 'react-i18next';
import globalStyles from '../../../styles/GlobalStyles';
import Spinner from 'react-native-loading-spinner-overlay';

//importados de assets
import logo from '../../../assets/logo.png';

const ResetPassword = ({navigation}) => {

    const {t, i18n} = useTranslation();//funcion para pasar el valor del translate
    const [email, setEmail] = useState('');
    const [errorEmail,setErrorEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);// ESTADO DE CUANDO SERA VISIBLE EL PROGRES BAR
    
    const validEmail = () =>{
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;// validacion de correo validos

        if(email === ''){
            setErrorEmail('El campo no puede ser vacio');
            return false;
        }else if(!emailRegex.test(email)){
            setErrorEmail('Correo Invalido');
            return false;
        }

        setErrorEmail('');
        return true

    }

    const postRestePassword = () => {

        console.log(email)
        setIsLoading(false);
        /* AQIU FALTA EL ENDPON DE RESETEAR PASSWORD */
        Alert.alert(
            'Se envio el correo con exito',
            'Verifica en tu correo electronico te llegara una liga con la que podras restablecer tu contraseña',
            [
                {text: 'Aceptar', onPress: () => {
                    console.log('Reenviar a login')
                    //reenviar a login
                    navigation.goBack();
            }},
              ],
              { cancelable: false }
          );

    }

    const sendPassReset = () => {
        if(validEmail()){
            setIsLoading(true);
            postRestePassword()
        }
    }

  return (
    <SafeAreaView style={styles.contenedor} >

            <ScrollView>
                <View>
                    <Text style = {styles.tituloComponent} >{t('resetPassword:title')}</Text>
                </View>

                <View style={styles.centrarImgLogo} >

                    <Image style={styles.imagen}
                        source={logo}
                        >
                    </Image>    
                </View>

                <View style={styles.contenedorForm} >

                

                    <Text style={styles.texto} >{t('resetPassword:textView')}</Text>

                    {/* ES EL PROGRES BAR DE CARGANDO */}
                    <Spinner visible={isLoading} />    

                    <TextInput
                            placeholder={t('resetPassword:holders:email')}
                            placeholderTextColor= '#FFF'
                            style= {styles.input}
                            autoCorrect={false}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            value={email}
                            onChangeText={setEmail}
                        />   
                        {errorEmail ? <Text style={styles.error}>{errorEmail}</Text> : null}
                                    

                    <Pressable style={styles.btn}
                        onPress={ () => {
                            sendPassReset();
                        }}
                    >
                        <Text style = {[styles.btnTexto]} >{t('resetPassword:btnSend')}</Text>
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

    tituloComponent: {
        color: '#FFF',
        textAlignVertical: 'center',
        marginTop: height1*0.09,
        textAlign: 'center',
        fontSize: height1 * 0.05,//asi se consige las letras responsivas
        fontWeight: '700'
    },

    centrarImgLogo: {
        alignItems: 'center',
        marginTop: height1*0.03
      },
    
      imagen:{
        width: width1*0.4,
        height: height1*0.2,
      },
    

    texto: {
        color: '#FFF',
        fontSize: height1*0.03,
        marginBottom: width1*0.05
    },

    contenedorForm: {
        alignItems: 'center',
        marginTop: height1*0.05,
        marginBottom: 10
    },

    input: {
        width: width1*0.8,
        borderBottomColor: 'gray',
        borderBottomWidth: 4,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: height1*0.025,
        color: '#FFF',
        marginTop: height1*0.04,
    },

    btnTexto: {
        color: 'black',
        fontSize: width1*0.05,
        fontWeight: '600',
        textAlign: 'center'
    },

    btn: {
        marginTop: height1*0.08,
        ...globalStyles.btnColor,
        borderRadius: 10,
        padding: 10,
        width: width1*0.5,
        height: height1*0.066
    },

    error: {
        color: 'red',
        marginTop: 5,
        marginBottom: -10,
        textAlign: 'center'
      },
})

export default ResetPassword