import { Text, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Picker } from "@react-native-picker/picker";

interface Props {
    label: string;
    value: string;
    onValueChange: (value: string, index: number) => void;
    pickerItems: PickerItem[];
    labelStyles?: StyleProp<ViewStyle>;
    pickerStyles?: StyleProp<ViewStyle>;
}
type PickerItem = { label: string, value: string }

const styles = StyleSheet.create({
    picker: {
        backgroundColor: 'white',
        width: '100%',
        padding: 10,
    },
    label: {
        color: 'white',
        fontSize: 20,
        marginVertical: 10,
    }
})

export const MyPicker = ({ label, pickerItems, value, labelStyles, pickerStyles, onValueChange }: Props) => {
    return (
        <View>
            <Text style={[styles.label, labelStyles]}>{label}</Text>
            <Picker
                selectedValue={value}
                onValueChange={onValueChange}
                mode="dropdown" // Android only
                style={[styles.picker, pickerStyles]}
            >
                {
                    pickerItems.map(({ label, value }, index) => (
                        <Picker.Item key={label} label={label} value={value} />
                    ))
                }
            </Picker>
        </View>
    )
}
