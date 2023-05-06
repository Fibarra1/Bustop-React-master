import { ReactNode, FC } from "react";
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import globalStyles from "../../../styles/GlobalStyles";

interface Props {
    children: ReactNode
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: globalStyles.colors.primary,
        paddingTop: 10,
    },
});

export const MainLayout: FC<Props> = ({ children }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {children}
            </ScrollView>
        </SafeAreaView>
    )
}
