import { Text, type TextProps, StyleSheet, Button, TouchableOpacity } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'squared';
    title: string,
    disabled?: boolean,
    onPress?: Function
};

export function ThemedButton({
    style,
    lightColor,
    darkColor,
    type = 'default',
    title,
    disabled,
    onPress,
    ...rest
}: ThemedButtonProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'accent2');

    return (
        <TouchableOpacity
            style={{
                backgroundColor: disabled ? "#E3D2DE" : color,
                borderRadius: type === 'squared' ? 0 : 10,
                padding: 10,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                elevation: 5,
            }}
            activeOpacity={disabled ? 1 : 0.7}
            onPress={disabled ? () => { } : onPress}
            {...rest}
        ><Text style={{ color: disabled ? "#000000" : "#ffffff" }}>{title}</Text></TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
});
