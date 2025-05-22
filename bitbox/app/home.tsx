import React, { useState } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

// Images to test the cover
const playlistCovers = [
    "https://celebmix.com/wp-content/uploads/2023/04/alan-walker-takes-it-back-to-the-beginning-with-his-new-single-dreamer-which-pays-homage-to-his-breakthrough-hits-faded-and-alone-01-scaled.jpg",
    "https://th.bing.com/th/id/OIP.8aBvRSzqVkWWgM6TFPC4IQHaE7?rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/OIP.hIBTTQYyM62dGKLKRwNEVgHaE8?rs=1&pid=ImgDetMain",
    "https://yt3.googleusercontent.com/TzxKREFGZv5Y5gC6Xfn6tBmZaxvH5drZkb85nlsOGz8ZS7JP5cH9Eq7RojqzMeR4lEP8X31VdA=s160-c-k-c0x00ffffff-no-rj",
    "https://yt3.googleusercontent.com/ytc/AIdro_loWQXLsqV3P69g6rJcCH-pddw2GiF7HvoMWXuLOsRLLw=s160-c-k-c0x00ffffff-no-rj"
];

export default function Home() {
    // Here are some playlist name
    const [playlists, setPlaylists] = useState([
        { id: "1", name: "My Favorites", cover: playlistCovers[0] },
        { id: "2", name: "Workout Beats", cover: playlistCovers[1] },
        { id: "3", name: "Chill Vibes", cover: playlistCovers[2] },
        { id: "4", name: "Party Time", cover: playlistCovers[3] }
    ]);

    const [featured, setFeatured] = useState([
        { id: "a", name: "Top Hits", cover: playlistCovers[4] },
        { id: "b", name: "Discover Weekly", cover: playlistCovers[2] },
        { id: "c", name: "Release Radar", cover: playlistCovers[1] }
    ]);

    // This is to delete the playlist you don't want
    const handleDelete = (id: string) => {
        setPlaylists(playlists.filter(pl => pl.id !== id));
    };

    // Well this is to add the playlist, maybe thinking to change name as well but for now default will be
    // New Playlist with the id number
    const handleAddPlaylist = () => {
        const newIdNum = playlists.length + 1;
        setPlaylists([
            ...playlists,
            {
                id: newIdNum.toString(),
                name: `New Playlist ${newIdNum}`,
                cover: playlistCovers[newIdNum % playlistCovers.length]
            }
        ]);

    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.greeting}>Welcome to Bitbox!</Text>
                {/*This is for the account button*/}
                <Link href={"/"} asChild>
                    <TouchableOpacity style={styles.accountButton}>
                        <Text style={styles.accountIcon}>👤</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Thi is  Featured Playlists */}
            <Text style={styles.sectionTitle}>Featured</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                {featured.map(item => (
                    <View key={item.id} style={styles.featuredCard}>
                        <Image source={{ uri: item.cover }} style={styles.featuredImg} />
                        <Text style={styles.featuredText}>{item.name}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* The user playlist that they can scroll through */}
            <Text style={styles.sectionTitle}>Your Playlists</Text>
            <FlatList
                data={playlists}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.playlistList}
                renderItem={({ item }) => (
                    <View style={styles.playlistRow}>
                        <Image source={{ uri: item.cover }} style={styles.playlistImg} />
                        <Text style={styles.playlistName}>{item.name}</Text>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No playlists yet.</Text>}
            />

            {/*To make the new playlist*/}
            <TouchableOpacity style={styles.addButton} onPress={handleAddPlaylist}>
                <Text style={styles.addButtonText}>+ Create New Playlist</Text>
            </TouchableOpacity>

            {/* Searching for music but waiting for the backend */}
            <View style={styles.bottomRow}>
                <Link href={"/"} asChild>
                    <TouchableOpacity style={styles.bottomNavButton}>
                        <Text style={styles.bottomNavText}>🔍 Search</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0000ff",
        paddingHorizontal: 20,
        paddingTop: 42,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    greeting: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },
    accountButton: {
        backgroundColor: "#2222ff",
        borderRadius: 50,
        padding: 10,
    },
    accountIcon: {
        fontSize: 22,
        color: "#fff",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
    },
    featuredScroll: {
        maxHeight: 130,
        marginBottom: 8,
    },
    featuredCard: {
        width: 110,
        height: 120,
        marginRight: 14,
        backgroundColor: "#2222ff",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
    },
    featuredImg: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginBottom: 6,
    },
    featuredText: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 14,
        textAlign: "center",
    },
    playlistList: {
        flexGrow: 0,
        marginBottom: 8,
    },
    playlistRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2222ff",
        borderRadius: 10,
        marginBottom: 12,
        padding: 10,
    },
    playlistImg: {
        width: 48,
        height: 48,
        borderRadius: 7,
        marginRight: 14,
    },
    playlistName: {
        color: "#fff",
        fontSize: 17,
        flex: 1,
        fontWeight: "500",
    },
    deleteButton: {
        backgroundColor: "#ff4444",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
        marginLeft: 8,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    addButton: {
        backgroundColor: "#00cc44",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 22,
        marginBottom: 10,
    },
    bottomNavButton: {
        backgroundColor: "#2222ff",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    bottomNavText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "500",
    },
    empty: {
        color: "#fff",
        textAlign: "center",
        marginTop: 30,
        fontSize: 16,
    },
});
