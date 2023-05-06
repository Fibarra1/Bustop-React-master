import { FC } from 'react';
import { Text, StyleSheet, View, TextInput, Dimensions } from "react-native"


const height1 = Dimensions.get("window").height; //con height se multiplica por ejemp *0.02 y vamos probando por numero para encontrar el tamaño deseado

interface Props {
    placeholder?: string | any,
    value?: string,
    errorMessage?: string,
    onChangeText: (text: string) => void
}

export const MyInput: FC<Props> = ({ placeholder = '', value = '', errorMessage = '', onChangeText }) => {
    return (
        <View style={[styles.containerInput]} >
            <TextInput style={styles.input}
                placeholderTextColor='#FFF'
                placeholder={placeholder}
                autoCorrect={false}
                autoCapitalize='none'
                value={value}
                onChangeText={onChangeText}

            />
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
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
    containerInput: {
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
})