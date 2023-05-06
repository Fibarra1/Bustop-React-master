import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native';

interface Props {
    onPress: () => void;
    content: string;
    buttonStyles?: StyleProp<ViewStyle>;
    contentStyles?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'red',
        borderRadius: 10,
        marginVertical: 20,
    },
    content: {
        paddingVertical: 10,
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        textTransform: 'uppercase',
    }
})


export const MyButton = ({ onPress, content, buttonStyles, contentStyles }: Props) => {
    return (
        <TouchableOpacity style={[styles.button, buttonStyles]} onPress={onPress}>
            <View style={[styles.content, contentStyles]}>
                <Text style={styles.text}>
                    {content}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

