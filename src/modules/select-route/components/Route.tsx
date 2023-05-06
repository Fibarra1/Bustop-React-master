import { ReactNode, FC, useMemo } from 'react';
import { StyleSheet, View, Image } from "react-native"
import SquareNumber from "./SquareNumber"
import { useOrientation } from '../../../hooks/useOrientation';

interface Props {
    iconUrl?: string,
    numberRoutes?: squareNumber[],
    children: ReactNode
}

type squareNumber = {
    number: number,
    bgColor: string,
    numberColor: string
}

const Route: FC<Props> = ({ iconUrl = '', numberRoutes = [], children }) => {
    const { isPortrait } = useOrientation();

    const size: number = useMemo(() => isPortrait ? 70 : 100, [isPortrait])


    return (
        <View style={styles.routes}>
            {
                iconUrl && <Image style={{ width: size, height: size }} source={{
                    uri: iconUrl
                }} />
            }
            {
                numberRoutes && numberRoutes.map((number, index) => (
                    <SquareNumber
                        key={index}
                        number={number.number}
                        bgColor={number.bgColor}
                        numberColor={number.numberColor}
                        width={size}
                        height={size}
                    />
                ))
            }
            <View>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerRoutes: {
        marginTop: 10,
        gap: 20,
    },
    routes: {
        flexDirection: 'row',
        gap: 10,
    },
    routeText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    red: {
        color: 'red',
    }
})

export default Route