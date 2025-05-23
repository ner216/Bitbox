import React from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Link, router  } from "expo-router";

export default function Index() {
    // Making a function to go to home page and using this router to do history stack which is to save
    // the screen where the user was visited so it would go back to the page they last visted
    const handleLogin = () => {
        router.replace("/home");
    };

    return (
        <View style={styles.container}>
             {/*Get the bit box image*/}
            <Image source={require("../assets/image-removebg-preview.png")} style={styles.logo} />
            <Text style={styles.title}>Welcome to BitBox!</Text>
            {/*Insert Username and password*/}
            <TextInput
                placeholder="Username"
                placeholderTextColor="#fff"
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry
                style={styles.input}
            />
            {/*Making login and the register button*/}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In </Text>
            </TouchableOpacity>

            <Text style={styles.newHere}>New Here?</Text>
            <Link href={"/register"} style={styles.register}>Register Now</Link>
        </View>
    );
}

// These are the style or bascially things to help design the UI
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
    newHere: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 8,
    },
    register: {
        color: "#fff",
        fontSize: 16,
        textDecorationLine: "underline",
    },
});
