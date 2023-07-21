import { useState, useContext, useEffect } from 'react';
import { Text, StyleSheet, View, Alert, TextInput, Pressable, Dimensions, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import '../../home/translations/i18n';
import { MainLayout } from '../../layout/components/MainLayout'
import { MyButton } from '../../shared/components/MyButton';
import { MyInput } from '../../shared/components/MyInput';
import { MyPicker } from '../../shared/components/MyPicker';
import { AuthContext } from '../../../context/auth';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

var height1 = Dimensions.get("window").height; //con height se multiplica por ejemp *0.02 y vamos probando por numero para encontrar el tamaño deseado
var width1 = Dimensions.get("window").width;



const languageOptions = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' },
]

const SettingsScreen = () => {
    const [language, setLanguage] = useState('es')
    const { t, i18n } = useTranslation()
    const [idUser, setIdUser] = useState({ value: '', errorMessage: '' })
    const [token, setToken] = useState({ value: '', errorMessage: '' })
    const [name, setName] = useState({ value: '', errorMessage: '' })
    const [apellidoPat, setApellidoPat] = useState({ value: '', errorMessage: '' })
    const [apellidoMat, setApellidoMat] = useState({ value: '', errorMessage: '' })
    const [correo, setCorreo] = useState({ value: '', errorMessage: '' })
    const [celular, setCelular] = useState({ value: '', errorMessage: '' })
    const [uidUser, setUidUser] = useState({ value: '', errorMessage: '' })
    const [tipoUser, setTipoUser] = useState({ value: '', errorMessage: '' })
    const [currentPassword, setCurrentPassword] = useState({ value: '', errorMessage: '' })
    const [newPassword, setNewPassword] = useState({ value: '', errorMessage: '' })
    const [confirmPassword, setConfirmPassword] = useState({ value: '', errorMessage: '' })
    const [lastSignInProvider, setLastSignInProvider] = useState('');
    const [showPassword, setShowPassword] = useState(true); //tru es se ve contraseña y false es no se ve contraseña
    const [showPassword2, setShowPassword2] = useState(true); //tru es se ve contraseña y false es no se ve contraseña
    const [showPassword3, setShowPassword3] = useState(true); //tru es se ve contraseña y false es no se ve contraseña


    const { user } = useContext(AuthContext)

    const { logout } = useContext(AuthContext)

    const userAuth = auth().currentUser;

    const navigation = useNavigation();
    // const checkLoginMethod = () => {
    //     const user = auth().currentUser;
    //     if (user) {
    //       user.providerData.forEach((userInfo) => {
    //         if (userInfo.providerId === 'facebook.com') {
    //           console.log('El usuario inició sesión con Facebook');
    //         } else if (userInfo.providerId === 'google.com') {
    //           console.log('El usuario inició sesión con Google');
    //         } else if (userInfo.providerId === 'password') {
    //           console.log('El usuario inició sesión con correo electrónico y contraseña');
    //         }
    //       });
    //     } else {
    //       console.log('No se ha iniciado sesión');
    //     }
    //   };

    //   checkLoginMethod()


    useEffect(() => {
        const fetchLastSignInProvider = async () => {
            try {
                const user = auth().currentUser;
                if (user) {
                    const signInMethods = await auth().fetchSignInMethodsForEmail(user.email);
                    if (signInMethods.length > 0) {
                        setLastSignInProvider(signInMethods[0]);
                    }
                }
            } catch (error) {
                console.log('Error al obtener el proveedor de inicio de sesión:', error);
            }
        };

        fetchLastSignInProvider();
    }, []);

    // if (lastSignInProvider === 'password') {
    //     console.log('Inicio sesion con correo electronico')
    // }






    const resetPasswordInputs = () => {
        setCurrentPassword({ value: '', errorMessage: '' })
        setNewPassword({ value: '', errorMessage: '' })
        setConfirmPassword({ value: '', errorMessage: '' })
    }

    const validationsPassword = () => {
        if (!currentPassword.value) {
            setCurrentPassword({ ...currentPassword, errorMessage: t('settings:errorMessage:requiredPassword') })
            return false
        } else {
            setCurrentPassword({ ...currentPassword, errorMessage: '' })
        }
        if (!newPassword.value) {
            setNewPassword({ ...newPassword, errorMessage: t('settings:errorMessage:requiredPassword') })
            return false
        } else if (newPassword.value.length < 8) {
            setNewPassword({ ...newPassword, errorMessage: t('settings:errorMessage:lengthPassword') })
            return false
        } else {
            setNewPassword({ ...newPassword, errorMessage: '' })
        }
        if (!confirmPassword.value) {
            setConfirmPassword({ ...confirmPassword, errorMessage: t('settings:errorMessage:requiredPassword') })
            return false
        } else if (confirmPassword.value !== newPassword.value) {
            setConfirmPassword({ ...confirmPassword, errorMessage: t('settings:errorMessage:passwordsNotMatch') })
            return false
        } else {
            setConfirmPassword({ ...confirmPassword, errorMessage: '' })
        }

        return true
    }

    const togglePassword = () => {
        setShowPassword(!showPassword)
        console.log(showPassword)
    }
    const togglePassword2 = () => {
        setShowPassword2(!showPassword2)
        console.log(showPassword2)
    }
    const togglePassword3 = () => {
        setShowPassword3(!showPassword3)
        console.log(showPassword3)
    }

    const onChangeName = () => {
        if (!name.value) {
            setName({ ...name, errorMessage: t('settings:errorMessage:requiredName') })
            return
        }
        console.log({ name: name.value })
        setName({ value: '', errorMessage: '' })
    }

    const onChangePassword = () => {
        if (!validationsPassword()) return
        console.log({
            currentPassword: currentPassword.value,
            newPassword: newPassword.value,
            confirmPassword: confirmPassword.value,
        })
        resetPasswordInputs()
    }

    const handleChangePassword = () => {
        const user = auth().currentUser;

        // Validar que los campos no estén vacíos
        if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        // Validar que la nueva contraseña y la confirmación coincidan
        if (newPassword.value !== confirmPassword.value) {
            Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden.');
            return;
        }

        // Reautenticar al usuario con su contraseña actual
        if (user) {
            const credential = auth.EmailAuthProvider.credential(user.email, currentPassword.value);
            user.reauthenticateWithCredential(credential)
                .then(() => {
                    // Cambiar la contraseña
                    user.updatePassword(newPassword.value)
                        .then(() => {
                            Alert.alert('Éxito', 'La contraseña se ha cambiado correctamente.');
                            setCurrentPassword({ value: '', errorMessage: '' });
                            setNewPassword({ value: '', errorMessage: '' });
                            setConfirmPassword({ value: '', errorMessage: '' });
                        })
                        .catch(error => {
                            Alert.alert('Error', 'No se pudo cambiar la contraseña. Por favor, intenta nuevamente.');
                        });
                })
                .catch(error => {
                    Alert.alert('Error', 'La contraseña actual es incorrecta. Por favor, verifica tus datos.');
                });
        }
    };





    const onChangeLanguage = () => {
        i18n.changeLanguage(language);
    }


    const onSingOff = async () => {
        if (userAuth) {
           await auth()
                .signOut()
                .then(() => console.log('Sesión cerrada correctamente.'))
                .catch(error => console.error('Error al cerrar sesión:', error));
        }
        logout(); // Llamar a logout solo una vez si es necesario
    };


    useEffect(() => {
        if (lastSignInProvider === 'password' && user && Array.isArray(user.usuario)) {
          // Filtramos el arreglo para obtener el primer elemento que no sea undefined
          const validUser = user.usuario.find((u) => u !== undefined);
      
          if (validUser) {
            console.log(validUser)
            // Si encontramos un elemento válido, actualizamos el estado con sus propiedades
            setIdUser({ value: validUser.idUser || '', errorMessage: '' });
            setName({ value: validUser.nombre || '', errorMessage: '' });
            setApellidoPat({ value: validUser.apellidoPat || '', errorMessage: '' });
            setApellidoMat({ value: validUser.apellidoMat || '', errorMessage: '' });
            setCorreo({ value: validUser.correo || '', errorMessage: '' });
            setCelular({ value: validUser.telefono || '', errorMessage: '' });
            setUidUser({ value: validUser.uid || '', errorMessage: '' });
            setTipoUser({ value: validUser.tipoUser || '', errorMessage: '' });
          }
        }
      }, [lastSignInProvider, user]);









    const editarNombreUsuario = async () => {
        if (user) {

            try {
                const url = `https://beautiful-mendel.68-168-208-58.plesk.page/api/Usuarios/${user.usuario[0].idUser}`;
                const datosActualizados = {
                    idUser: user.usuario[0].idUser,
                    nombre: name.value,
                    apellidoPat: apellidoPat.value,
                    apellidoMat: apellidoMat.value,
                    correo: user.usuario[0].correo,
                    telefono: celular.value,
                    uid: user.usuario[0].uid,
                    tipoUser: user.usuario[0].tipoUser
                };
                const response = await axios.put(url, datosActualizados, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                Alert.alert('Éxito', 'Los datos se han actualizado correctamente.');
                console.log('Nombre de usuario editado:', response.data.nombre);

                // Actualizar la interfaz de usuario con el nuevo nombre
                // ...
            } catch (error) {
                console.error('Error al editar el nombre del usuario:', error.response.data);
            }
        }
    };






    return (
        <MainLayout>
            <Text style={styles.title}>{t('settings:title')}</Text>
            <View style={styles.settingsContainer} >

                {lastSignInProvider === 'password' &&


                    <View>
                        <Text style={styles.subtitle}>{t('settings:subtitle1')}</Text>
                        <MyInput
                            errorMessage={name.errorMessage}
                            placeholder={t('settings:placeholder:name')}
                            value={name.value}
                            onChangeText={(value) => setName({ ...name, value })} />
                        <MyInput
                            errorMessage={apellidoPat.errorMessage}
                            placeholder={t('settings:placeholder:appa')}
                            value={apellidoPat.value}
                            onChangeText={(value) => setApellidoPat({ ...apellidoPat, value })} />
                        <MyInput
                            errorMessage={apellidoMat.errorMessage}
                            placeholder={t('settings:placeholder:apma')}
                            value={apellidoMat.value}
                            onChangeText={(value) => setApellidoMat({ ...apellidoMat, value })} />
                        <MyInput
                            errorMessage={celular.errorMessage}
                            placeholder={t('settings:placeholder:cel')}
                            value={celular.value}
                            onChangeText={(value) => setCelular({ ...celular, value })} />
                        <MyButton onPress={editarNombreUsuario} content={'Guardar'} />


                        <View style={[styles.contentPass, styles.contentPass2]} >

                            <TextInput style={styles.inputPass}
                                placeholderTextColor='#FFF'
                                placeholder={t('settings:placeholder:password')}
                                autoCorrect={false}
                                autoCapitalize='none'
                                secureTextEntry={showPassword}
                                value={currentPassword.value}
                                onChangeText={(value) => setCurrentPassword({ ...currentPassword, value })}
                            />

                            <Pressable style={styles.btnShowPass}
                                onPress={() => {
                                    togglePassword()
                                    console.log('clic')
                                }} >
                                {!showPassword ? (<Image style={styles.iconEye}
                                    source={require('../../auth/icons/eye.png')}
                                />) :
                                    <Image style={styles.iconEye}
                                        source={require('../../auth/icons/eye-of.png')}
                                    />
                                }
                            </Pressable>
                        </View>
                        <View style={[styles.contentPass, styles.contentPass2]} >

                            <TextInput style={styles.inputPass}
                                placeholderTextColor='#FFF'
                                placeholder={t('settings:placeholder:newPassword')}
                                autoCorrect={false}
                                autoCapitalize='none'
                                secureTextEntry={showPassword2}
                                value={newPassword.value}
                                onChangeText={(value) => setNewPassword({ ...currentPassword, value })}
                            />

                            <Pressable style={styles.btnShowPass}
                                onPress={() => {
                                    togglePassword2()
                                    console.log('clic')
                                }} >
                                {!showPassword2 ? (<Image style={styles.iconEye}
                                    source={require('../../auth/icons/eye.png')}
                                />) :
                                    <Image style={styles.iconEye}
                                        source={require('../../auth/icons/eye-of.png')}
                                    />
                                }
                            </Pressable>
                        </View>

                        <View style={[styles.contentPass, styles.contentPass2]} >

                            <TextInput style={styles.inputPass}
                                placeholderTextColor='#FFF'
                                placeholder={t('settings:placeholder:confirmPassword')}
                                autoCorrect={false}
                                autoCapitalize='none'
                                secureTextEntry={showPassword3}
                                value={confirmPassword.value}
                                onChangeText={(value) => setConfirmPassword({ ...currentPassword, value })}
                            />

                            <Pressable style={styles.btnShowPass}
                                onPress={() => {
                                    togglePassword3()
                                    console.log('clic')
                                }} >
                                {!showPassword3 ? (<Image style={styles.iconEye}
                                    source={require('../../auth/icons/eye.png')}
                                />) :
                                    <Image style={styles.iconEye}
                                        source={require('../../auth/icons/eye-of.png')}
                                    />
                                }
                            </Pressable>
                        </View>
                        <MyButton onPress={handleChangePassword} content={'Guardar'} />
                    </View>
                }


                <View style={styles.separator}></View>
                <Text style={styles.subtitle}>{t('settings:subtitle2')}</Text>
                <MyPicker
                    label={t('settings:selectLanguage')}
                    value={language}
                    onValueChange={setLanguage}
                    pickerItems={languageOptions} />

                <MyButton onPress={onChangeLanguage} content={t('settings:button:save')} />
                <MyButton onPress={onSingOff} content={t('settings:button:signOff')} />
            </View>
        </MainLayout>
    )
}

const styles = StyleSheet.create({
    title: {
        color: 'white',
        textAlign: 'center',
        fontSize: 50,
    },
    settingsContainer: {
        marginVertical: 20,
        marginHorizontal: 30,
    },
    subtitle: {
        color: 'white',
        fontSize: 30,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '100%',
        backgroundColor: 'red',
    },
    inputPass: {
        flex: 12,
        fontSize: height1 * 0.025,
        color: '#FFF',
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
        fontSize: 25,
        color: '#FFF',
        marginTop: 30,
        paddingVertical: 10,
    },
})

export default SettingsScreen