import { Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { useOrientation } from '../../../hooks/useOrientation';
import { useMemo } from 'react';

const SquareRoute = ({ content = '', contentColor = '#000', bgColor = '#FFF', onPress = () => { }, onPressIn= () => {}, onPressOut= () => {} }) => {
    const { isPortrait } = useOrientation();

    const size: number = useMemo(() => isPortrait ? 100 : 150, [isPortrait])
    return (
        <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <View style={[styles.square, { backgroundColor: bgColor, width: size, height: size }]}>
                <Text style={[styles.content, { color: contentColor }]}>{content}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    square: {
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    content: {
        fontSize: 45,
        fontWeight: 'bold',
    }
})

export default SquareRoute