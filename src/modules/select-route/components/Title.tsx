import { FC } from 'react';
import { Text, StyleSheet, View } from "react-native"

interface Props {
    title1: string,
    title2: string,
}

const Title: FC<Props> = ({ title1 = '', title2 = '' }) => {
    return (
        <View style={{
            marginTop: 30,
        }}>
            <Text style={styles.title}>
                {title1}
            </Text>
            <Text style={styles.title}>
                {title2}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        color: '#FFF',
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})

export default Title