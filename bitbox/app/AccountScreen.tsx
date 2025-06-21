import React, { useRef } from "react";
import {View, Text, StyleSheet, Image, Animated, Pressable, TouchableOpacity,} from "react-native";
import {router} from "expo-router";

export default function AccountScreen() {
    // Creates an animated scale for each box
    // const createScale = () => useRef(new Animated.Value(1)).current;
    // const scale1 = createScale();
    // const scale2 = createScale();
    // const scale3 = createScale();
    const scale1 = useRef(new Animated.Value(1)).current;
    const scale2 = useRef(new Animated.Value(1)).current;
    const scale3 = useRef(new Animated.Value(1)).current;
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

    const playlists = [
        { name: "Playlist 1", minutes: 88,  coverArt: "https://backend.com/images/something.jpg"},
        { name: "Playlist 2", minutes: 45, coverArt: "https://backend.com/images/something2.jpg"},
        { name: "Playlist 3", minutes: 73, coverArt: "https://backend.com/images/something3.jpg"},
        { name: "Playlist 4", minutes: 31, coverArt: "https://backend.com/images/something4.jpg"},
    ];

    const topPlaylists = playlists
        .sort((a, b) => b.minutes - a.minutes)
        .slice(0, 3);


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/home")}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Image
                source={require("../assets/BitBox_Main_Logo-removebg-preview.png")}
                style={styles.image}
                resizeMode="contain"
            />

            {/*Account Details*/}
            <Text style={styles.header}>Account Details:</Text>
            <Text style={styles.subHeader}>Keegan S.</Text>
            <Text style={styles.label}>My Top Playlists:</Text>

            {/*The boxes for the playlists, *pressable* makes them clickable*/}
            <View style={styles.playlistContainer}>
                {topPlaylists.map((playlist, index) => {
                    const scale = [scale1, scale2, scale3][index];
                    return (
                        <Pressable
                            key={playlist.name}
                            onHoverIn={() => onHoverIn(scale)}
                            onHoverOut={() => onHoverOut(scale)}
                        >
                            <AnimatedBox
                                style={[styles.playlistBox, { transform: [{ scale }] }]}
                            >
                                <Image
                                    source={{ uri: playlist.coverArt }}
                                    style={styles.albumImage}
                                />
                            </AnimatedBox>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

// Stylesheet for the screen
const styles = StyleSheet.create({
    backButton: { position: "absolute", left: 16, top: 40, backgroundColor: "#2222ff", padding: 8, borderRadius: 8 },
    backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
    },

    playlistText: {
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
        marginTop: 10,
    },

    playlistContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },

    albumImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        resizeMode: 'cover',
    },

});
