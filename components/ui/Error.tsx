import { StyleSheet, Text } from "react-native";

export default function Error({ errorMessage }: { errorMessage: string }) {
    if (!errorMessage) {
        return null
    } else return (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
    )
}

const styles = StyleSheet.create({
    errorMessage: {
        color: "red"
    }
})