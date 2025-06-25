import React,  { useState }  from "react";
import {View, Text, TextInput, StyleSheet,Pressable, Dimensions} from "react-native";
import { Link, router } from "expo-router"
import axios from "axios";
import Animated, {useSharedValue,useAnimatedStyle,withTiming,withRepeat,FadeInUp,
    FadeInDown} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";

//, Image
export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const { width} = Dimensions.get("window");
    const translateX = useSharedValue(100); // Starts far left

    React.useEffect(() => {
        translateX.value = withRepeat(
            withTiming(width, { duration: 3000 }), // it make it move for 3s
            -1, // To loop infinitely
            true // No alternate direction, making smooth looping
        );
    }, );

    // Making movement animation
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    // Function to handle registration
    // const handleRegister = async () => {
    //     try {
    //         // const response = await axios.post("https://your-backend-url.com/register", {
    //         //     username,
    //         //     email,
    //         //     password,
    //         // });
    //         const mockResponse = {
    //             success: username.length > 3 && email.includes("@") && password.length > 5,
    //         };
    //         if (mockResponse.success) {
    //             setMessage("Registration successful! Redirecting to login...");
    //             setTimeout(() => router.replace("/login"), 2000);
    //         } else {
    //             setMessage("Registration failed. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error("Registration error:", error);
    //         setMessage("Network error. Please check your connection.");
    //     }
    // };
    const handleRegister = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/users", {
                username,
                password
            });

            if (response.status === 201) {
                setMessage("Registration successful! Redirecting to login...");
                setTimeout(() => router.replace("/login"), 2000);
            } else {
                setMessage("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("Network error. Please check your connection.");
        }
    };
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
            {/*So this is for the mascot image*/}
            <Animated.Image source={require("../assets/BitBox_Main_Logo-removebg-preview.png")}
                            style={styles.logo}
                            entering={FadeInUp.duration(1000).springify()}
            />
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
                <Text style={styles.title}>Register for BitBox!</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.duration(1000).springify()}>
                {/*These are the input that user need to register, i don't know if we need anything else yet*/}
                <TextInput placeholder="Username" placeholderTextColor="#fff" style={styles.input} value={username} onChangeText={setUsername}  />
            </Animated.View>
            {/*<Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>*/}
            {/*<TextInput placeholder="Email" placeholderTextColor="#fff" style={styles.input} value={email} onChangeText={setEmail} />*/}
            {/*</Animated.View>*/}
            <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()}>
                <TextInput placeholder="Password" placeholderTextColor="#fff" secureTextEntry style={styles.input} value={password} onChangeText={setPassword}  />
            </Animated.View>

            {/* Register Button */}
            <Pressable style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
            {/* Display message (success or error) */}
            {message ? <Text style={{ color: "red", marginTop: 10 }}>{message}</Text> : null}
            {/*And this is just to get back to the login screen*/}
            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
                <Link href="/login" style={styles.register}>If you have account already why you here? Login</Link>
            </Animated.View>
        </View>
    );
}

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
