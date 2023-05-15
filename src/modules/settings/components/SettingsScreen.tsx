import { useState, useContext } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import '../../home/translations/i18n';
import { MainLayout } from '../../layout/components/MainLayout'
import { MyButton } from '../../shared/components/MyButton';
import { MyInput } from '../../shared/components/MyInput';
import { MyPicker } from '../../shared/components/MyPicker';
import { AuthContext } from '../../../context/auth';
import auth from '@react-native-firebase/auth';


const languageOptions = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' },
]

const SettingsScreen = () => {
    const [language, setLanguage] = useState('es')
    const { t, i18n } = useTranslation()
    const [name, setName] = useState({ value: '', errorMessage: '' })
    const [currentPassword, setCurrentPassword] = useState({ value: '', errorMessage: '' })
    const [newPassword, setNewPassword] = useState({ value: '', errorMessage: '' })
    const [confirmPassword, setConfirmPassword] = useState({ value: '', errorMessage: '' })


    const user = auth().currentUser;

    const currentUser = auth().currentUser;

    const { logout } = useContext(AuthContext)


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

    const onChangeLanguage = () => {
        i18n.changeLanguage(language);
    }


    const onSingOff = () => {
        logout()
        auth()
            .signOut()
            .then(() => console.log('Sesión cerrada correctamente.'))
            .catch(error => console.error('Error al cerrar sesión:', error));
    }

    console.log(currentUser)



    // const providerData = user.providerData;
    // const lastSignInProviderId = providerData[providerData.length - 1].providerId;

    // console.log('El último inicio de sesión fue realizado con:', lastSignInProviderId);

    // Verifica si el usuario está autenticado
    if (currentUser) {
        // Obtén información sobre los proveedores de autenticación utilizados para iniciar sesión
        const providers = currentUser.providerData.map((provider) => provider.providerId);
        console.log(providers)

        // Verifica si el usuario inició sesión mediante correo electrónico
        if (providers.includes('password')) {
            console.log('El usuario inició sesión con correo electrónico');
        }

        // Verifica si el usuario inició sesión con Google
        if (providers.includes('google.com')) {
            console.log('El usuario inició sesión con Google');
        }

        // Verifica si el usuario inició sesión con Facebook
        if (providers.includes('facebook.com')) {
            console.log('El usuario inició sesión con Facebook');
        }

        // Verifica si el usuario inició sesión con otro proveedor de autenticación
        if (providers.filter((provider) => provider !== 'password' && provider !== 'google.com' && provider !== 'facebook.com').length > 0) {
            console.log('El usuario inició sesión con otro proveedor de autenticación');
        }
    } else {
        // El usuario no está autenticado

        console.log('El usuario no está autenticado');
    }



    return (
        <MainLayout>
            <Text style={styles.title}>{t('settings:title')}</Text>
            <View style={styles.settingsContainer} >

                {!user &&


                    <View>
                        <Text style={styles.subtitle}>{t('settings:subtitle1')}</Text>
                        <MyInput
                            errorMessage={name.errorMessage}
                            placeholder={t('settings:placeholder:name')}
                            value={name.value}
                            onChangeText={(value) => setName({ ...name, value })} />
                        <MyButton onPress={onChangeName} content={'Guardar'} />

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
                        <MyButton onPress={onChangePassword} content={'Guardar'} />
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