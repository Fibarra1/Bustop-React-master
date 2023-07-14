import { useState, useContext, useEffect } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import '../../home/translations/i18n';
import { MainLayout } from '../../layout/components/MainLayout'
import { MyButton } from '../../shared/components/MyButton';
import { MyInput } from '../../shared/components/MyInput';
import { MyPicker } from '../../shared/components/MyPicker';
import { AuthContext } from '../../../context/auth';
import auth from '@react-native-firebase/auth';
import axios from 'axios';


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

    const { user } = useContext(AuthContext)

    const { logout } = useContext(AuthContext)

    const userAuth = auth().currentUser;

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

    if (lastSignInProvider === 'password') {
        console.log('Inicio sesion con correo electronico')
    }

    console.log(user)





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

        // Verificar que la contraseña nueva y la de confirmación coincidan
        if (newPassword.value !== confirmPassword.value) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        // Reautenticar al usuario con su contraseña actual
        const credential = auth.EmailAuthProvider.credential(
            user.usuario[0].correo,
            currentPassword.value
        );

        console.log(credential)

    };




    const onChangeLanguage = () => {
        i18n.changeLanguage(language);
    }


    const onSingOff = () => {
        if (userAuth) {
            auth()
                .signOut()
                .then(() => console.log('Sesión cerrada correctamente.'))
                .catch(error => console.error('Error al cerrar sesión:', error));
        }
        logout(); // Llamar a logout solo una vez si es necesario
    };


    useEffect(() => {
        if (user) {
            setIdUser({ value: user.usuario[0].idUser, errorMessage: '' });
            setToken({ value: user.token, errorMessage: '' });
            setName({ value: user.usuario[0].nombre, errorMessage: '' });
            setApellidoPat({ value: user.usuario[0].apellidoPat, errorMessage: '' });
            setApellidoMat({ value: user.usuario[0].apellidoMat, errorMessage: '' });
            setCorreo({ value: user.usuario[0].correo, errorMessage: '' });
            setCelular({ value: user.usuario[0].telefono, errorMessage: '' });
            setUidUser({ value: user.usuario[0].uid, errorMessage: '' });
            setTipoUser({ value: user.usuario[0].tipoUser, errorMessage: '' });
        }
    }, [user]);







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
                // Manejar la respuesta del servidor aquí
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

                        <MyInput
                            errorMessage={currentPassword.errorMessage}
                            placeholder={t('settings:placeholder:password')}
                            value={currentPassword.value}
                            onChangeText={(value) => setCurrentPassword({ ...currentPassword, value })} />
                        <MyInput
                            errorMessage={newPassword.errorMessage}
                            placeholder={t('settings:placeholder:newPassword')}
                            value={newPassword.value}
                            onChangeText={(value) => setNewPassword({ ...newPassword, value })} />
                        <MyInput
                            errorMessage={confirmPassword.errorMessage}
                            placeholder={t('settings:placeholder:confirmPassword')}
                            value={confirmPassword.value}
                            onChangeText={(value) => setConfirmPassword({ ...confirmPassword, value })} />
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
    }
})

export default SettingsScreen