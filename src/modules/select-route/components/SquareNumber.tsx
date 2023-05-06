import { FC } from 'react';
import { Text, View, StyleSheet } from "react-native"

interface Props {
    number: number,
    numberColor?: string,
    bgColor?: string,
    width?: number,
    height?: number,
}

const SquareNumber: FC<Props> = ({ number, numberColor = '#000', bgColor = '#FFF', width = 70, height = 70 }) => {

    return (
        <View style={[styles.square, { backgroundColor: bgColor, width, height }]}>
            <Text style={[styles.number, { color: numberColor }]}>{number}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    square: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    number: {
        fontSize: 35,
        fontWeight: 'bold',
    }
})

export default SquareNumber