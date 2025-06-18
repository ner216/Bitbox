//TouchableOpacity,Image,
import React, {useState} from "react";
import { Text, View, TextInput, StyleSheet, Pressable,Dimensions } from "react-native";
import { Link, router} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import Animated, {useSharedValue, useAnimatedStyle, withTiming, withRepeat, FadeInUp, FadeInDown
} from "react-native-reanimated";
import axios from "axios";

export default function Index() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { width} = Dimensions.get("window");
    // Making a function to go to home page and using this router to do history stack which is to save
    // the screen where the user was visited so it would go back to the page they last visted
    const handleLogin = async () => {
        try {
            // const response = await axios.post("https://your-backend-url.com/login", {
            //     username,
            //     password,
            // });
            const mockResponse = {
                success: username === "ka" && password === "123",
            };

            if (mockResponse.success) {
                router.replace("/home"); // Navigate to home page
            } else {
                setErrorMessage("Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Network error. Please check your connection.");
        }
    };
//     const handleLogin = async () => {
//     try {
//         const response = await axios.post("http://localhost:8000/login", {
//             username,
//             password,
//         });
//
//         if (response.status === 200) {
//             console.log("Login successful:", response.data);
//             router.replace("/home"); // Navigate to home page
//         } else {
//             setErrorMessage(response.data.message || "Invalid credentials. Please try again.");
//         }
//     } catch (error: any) { // Explicitly define error type
//         console.error("Login error:", error);
//
//         if (axios.isAxiosError(error)) {
//             setErrorMessage(error.response?.data?.message || "Invalid credentials. Please try again.");
//         } else {
//             setErrorMessage("Network error. Please check your connection.");
//         }
//     }
// };

    const translateX = useSharedValue(100); // Starts far left

    React.useEffect(() => {
        translateX.value = withRepeat(
            withTiming(width, { duration: 3000 }), // it make it move for 3s
            -1, // To loop infinitely
            true // No alternate direction, making a smooth looping
        );
    }, );
    // Making movement animation
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.background ,animatedStyle]}>
                <LinearGradient
                    colors={["#0000ff", "white"]}
                    start={{ x: 15, y: 0 }}
                    end={{ x: 20, y: 0 }}
                    style={styles.gradient}
                />
            </Animated.View>
            {/*Get the bit box image*/}
            <Animated.Image source={require("../assets/BitBox_Main_Logo-removebg-preview.png")}
                            style={styles.logo}
                            entering={FadeInUp.duration(1000).springify()}
            />
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
            <Text style={styles.title}>Welcome to BitBox!</Text>
            </Animated.View>
            {/*Insert Username and password*/}
            <Animated.View entering={FadeInDown.duration(1000).springify()}>
            <TextInput
                placeholder="Username"
                placeholderTextColor="#fff"
                style={styles.input}
                value={username} onChangeText={setUsername}
            />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
            <TextInput
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry
                style={styles.input}
                value={password} onChangeText={setPassword}
            />
            </Animated.View>
            {/*Making login and the register button*/}
            {/*Make login button change color when press it down*/}
            <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()}>
            <Pressable style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? "#0000dd" : "#2222ff" }
            ]} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In </Text>
            </Pressable>
            </Animated.View>
            {/* Error Message */}
            {errorMessage ? <Text style={{ color: "red", marginTop: 10 }}>{errorMessage}</Text> : null}

            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
            <Text style={styles.newHere}>New Here?</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
            <Link href={"/register"} style={styles.register}>Register Now</Link>
            </Animated.View>
        </View>

    );
}

// These are the style or bascially things to help design the UI
const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        width: "800%",
        height: "100%",
    },
    gradient: {
        flex: 1,
    },
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
        borderRadius: 8,
        marginBottom: 20,
        color: "#fff",
        paddingHorizontal: 12,
        fontSize: 18,
        backgroundColor: "rgba(255,255,255,0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        backgroundColor: "#2222ff",
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 8,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: "#fff",
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
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
        fontWeight: "bold",
        textDecorationLine: "underline",
        opacity: 0.8,
    },
});

// const handleLogin = () => {
//     router.replace("/home");
// };
