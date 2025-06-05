import React, { useRef } from "react";
import {View, Text, StyleSheet, Image, Animated, Pressable,} from "react-native";

export default function AccountScreen() {
    // Creates an animated scale for each box
    const createScale = () => useRef(new Animated.Value(1)).current;

    const scale1 = createScale();
    const scale2 = createScale();
    const scale3 = createScale();

    // Animation when hovering over
    const onHoverIn = (scale: Animated.Value) => {
        Animated.spring(scale, {
            toValue: 1.05,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    // Animation when hovering out
    const onHoverOut = (scale: Animated.Value) => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 3,
        }).start();
    };

    const AnimatedBox = Animated.createAnimatedComponent(View);

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/BitBox_Main_Logo.png")}
                style={styles.image}
                resizeMode="contain"
            />

            {/*Account Details*/}
            <Text style={styles.header}>Account Details:</Text>
            <Text style={styles.subHeader}>Keegan S.</Text>

            <Text style={styles.label}>Minutes Listened:</Text>
            <Text style={styles.value}>123</Text>

            <Text style={styles.label}>My Top Playlists:</Text>

            {/*The boxes for the playlists, *pressable* makes them clickable*/}
            <View style={styles.playlistRow}>
                {/* Box 1 */}
                <Pressable
                    onHoverIn={() => onHoverIn(scale1)}
                    onHoverOut={() => onHoverOut(scale1)}
                >
                    <AnimatedBox
                        style={[styles.playlistBox, { transform: [{ scale: scale1 }] }]}
                    />
                </Pressable>

                {/* Box 2 */}
                <Pressable
                    onHoverIn={() => onHoverIn(scale2)}
                    onHoverOut={() => onHoverOut(scale2)}
                >
                    <AnimatedBox
                        style={[styles.playlistBox, { transform: [{ scale: scale2 }] }]}
                    />
                </Pressable>

                {/* Box 3 */}
                <Pressable
                    onHoverIn={() => onHoverIn(scale3)}
                    onHoverOut={() => onHoverOut(scale3)}
                >
                    <AnimatedBox
                        style={[styles.playlistBox, { transform: [{ scale: scale3 }] }]}
                    />
                </Pressable>
            </View>
        </View>
    );
}

// Stylesheet for the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(0, 0, 255)",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 60,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    subHeader: {
        fontSize: 20,
        color: "#fff",
        marginBottom: 30,
    },
    label: {
        fontSize: 18,
        color: "#fff",
        marginTop: 10,
    },
    value: {
        fontSize: 18,
        color: "#fff",
        marginBottom: 20,
    },
    playlistRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "30%",
        marginTop: 20,
    },
    playlistBox: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: "#fff",
        marginHorizontal: 10,
    },
});
