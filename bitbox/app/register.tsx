import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

export default function Register() {
    return (
        <View style={styles.container}>
            {/*So this is for the mascot image*/}
            <Image source={require("../assets/image-removebg-preview.png")} style={styles.logo} />
            <Text style={styles.title}>Register for BitBox!</Text>
            {/*These are the input that user need to register, i don't know if we need anything else yet*/}
            <TextInput placeholder="Username" placeholderTextColor="#fff" style={styles.input} />
            <TextInput placeholder="Email" placeholderTextColor="#fff" style={styles.input} />
            <TextInput placeholder="Password" placeholderTextColor="#fff" secureTextEntry style={styles.input} />
            {/*And this is just to get back to the login screen*/}
            <Link href="/" style={styles.register}>If you have account already why you here? Login</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0000ff",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 180,
        height: 120,
        marginBottom: 20,
        resizeMode: "contain",
    },
    title: {
        color: "#fff",
        fontSize: 28,
        marginBottom: 40,
        fontWeight: "bold",
    },
    input: {
        width: 250,
        height: 40,
        borderColor: "#fff",
        borderWidth: 2,
        borderRadius: 4,
        marginBottom: 20,
        color: "#fff",
        paddingHorizontal: 12,
        fontSize: 18,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    button: {
        backgroundColor: "#2222ff",
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 4,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: "#fff",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
    },
    register: {
        color: "#fff",
        fontSize: 16,
        textDecorationLine: "underline",
        marginTop: 8,
    },
});
