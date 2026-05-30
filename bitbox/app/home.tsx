import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, Pressable, StyleSheet, Image, Animated, Modal, TextInput, Alert } from "react-native";
//import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
// Images to test the cover
const playlistCovers = [
    "https://celebmix.com/wp-content/uploads/2023/04/alan-walker-takes-it-back-to-the-beginning-with-his-new-single-dreamer-which-pays-homage-to-his-breakthrough-hits-faded-and-alone-01-scaled.jpg",
    "https://th.bing.com/th/id/OIP.8aBvRSzqVkWWgM6TFPC4IQHaE7?rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/OIP.hIBTTQYyM62dGKLKRwNEVgHaE8?rs=1&pid=ImgDetMain",
    "https://yt3.googleusercontent.com/TzxKREFGZv5Y5gC6Xfn6tBmZaxvH5drZkb85nlsOGz8ZS7JP5cH9Eq7RojqzMeR4lEP8X31VdA=s160-c-k-c0x00ffffff-no-rj",
    "https://yt3.googleusercontent.com/ytc/AIdro_loWQXLsqV3P69g6rJcCH-pddw2GiF7HvoMWXuLOsRLLw=s160-c-k-c0x00ffffff-no-rj"
]
const router = useRouter(); // Move over to router from Link


export default function Home() {
    // Featured playlists will be derived from the user's playlists
    const [featured, setFeatured] = useState<any[]>([]);

    type Playlist = { id: string; name: string; cover: string };
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    // // For playlist
    // useEffect(() => {
    //     const fetchPlaylists = async () => {
    //         try {
    //             const response = await fetch("http://localhost:3000/playlists");
    //             const data = await response.json();
    //             setPlaylists(data); // Update state with fresh data
    //         } catch (error) {
    //             console.error("Error fetching playlists:", error);
    //         }
    // //     };
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const stored = await AsyncStorage.getItem("user_id");
            if (stored) setUserId(Number(stored));
        };
        fetchUserId();
    }, []);
    const fetchUserPlaylists = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}/playlists`);
            if (!response.ok) throw new Error("Failed to fetch playlists");
            const data = await response.json();
            setPlaylists(data);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };
    const openCreateModal = () => {
        setNewPlaylistName("");
        setShowCreateModal(true);
    };

    const submitCreatePlaylist = async () => {
        if (!userId) return;
        const name = newPlaylistName.trim();
        if (!name) {
            Alert.alert("Please enter a playlist name");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}/playlists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playlist_name: name }),
            });

            if (!response.ok) throw new Error("Failed to add playlist");

            const result = await response.json();
            console.log("Playlist created:", result);
            setShowCreateModal(false);
            setNewPlaylistName("");
            await fetchUserPlaylists();
        } catch (error) {
            console.error("Error adding playlist:", error);
            Alert.alert("Error", "Could not create playlist");
        }
    };
    useEffect(() => {
        if (userId !== null) {
            fetchUserPlaylists();
        }
    }, [userId]);
    const handleDelete = async (id: string) => {
        Alert.alert("Delete playlist", "Are you sure you want to delete this playlist?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await fetch(`http://localhost:5000/playlists/${id}`, {
                            method: "DELETE",
                        });

                        if (!response.ok) throw new Error("Failed to delete playlist");
                        await fetchUserPlaylists();
                    } catch (error) {
                        console.error("Error deleting playlist:", error);
                        Alert.alert("Error", "Could not delete playlist");
                    }
                }
            }
        ]);
    };

    // Derive featured playlists from user's playlists (random picks)
    useEffect(() => {
        if (playlists.length >= 3) {
            const shuffled = [...playlists].sort(() => Math.random() - 0.5).slice(0, 3);
            setFeatured(shuffled);
        } else {
            setFeatured([]);
        }
    }, [playlists]);

    // Animation feature
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.greeting}>Welcome to Bitbox!</Text>
                {/*This is for the account button which would go back to the account page but still
                waiting for it */}
                <TouchableOpacity 
                    style={styles.accountButton}
                    onPress={() => router.push({
                        pathname: "/AccountScreen",
                        params: { userId: userId }
                    })}
                    >
                    <Text style={styles.accountIcon}>👤</Text>
                </TouchableOpacity>
            </View>

            {/* This is  Featured Playlists */}
            <Text style={styles.sectionTitle}>Featured</Text>
            {/*This allow us to scroll if there are a lot of playlist*/}
            <Animated.View style={{ opacity: fadeAnim }}>
                {featured.length >= 3 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                        {featured.map((item) => (
                            <View key={item.id} style={styles.featuredCard}>
                                <Image source={{ uri: item.cover }} style={styles.featuredImg} />
                                <Text style={styles.featuredText}>{item.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.empty}>nothing to see here yet</Text>
                )}
            </Animated.View>
            {/* The user playlist that they can scroll through. Here FlatList use because the user
             can add playlist which would be a lot so Flatlist would render item when they about to
             appear and remove them when they out of screen to save processing time*/}
            <Text style={styles.sectionTitle}>Your Playlists</Text>
            <FlatList
                data={playlists}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.playlistList}
                renderItem={({ item }) => (
                    <View style={styles.playlistHome}>
                        {/*// We use pahtname because now we click on the playlist we got different pages*/}
                        <TouchableOpacity 
                            style={styles.playlistRow} activeOpacity={0.7}
                            onPress={() => router.replace(`/playlist/${item.id}`)}   
                            >
                            <Image source={{ uri: item.cover }} style={styles.playlistImg} />
                            <Text style={styles.playlistName}>{item.name}</Text>
                            {/* This is to prevent the delete button to trigger the navigation */}
                        </TouchableOpacity>
                        <Pressable
                            style={styles.deleteButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => {
                                console.log('delete pressed', item.id);
                                handleDelete(item.id);
                            }}
                        >
                            <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No playlists yet.</Text>}
            />

            {/*To make the new playlist*/}
            <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
                <Text style={styles.addButtonText}>+ Create New Playlist</Text>
            </TouchableOpacity>

            <Modal visible={showCreateModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Playlist</Text>
                        <TextInput
                            value={newPlaylistName}
                            onChangeText={setNewPlaylistName}
                            placeholder="Playlist name"
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setShowCreateModal(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.modalPrimary]} onPress={submitCreatePlaylist}>
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Searching for music but waiting for the backend */}
            <View style={styles.bottomRow}>
                <TouchableOpacity 
                style={styles.bottomNavButton}
                onPress={() => router.push({
                    pathname: "/SearchScreen",
                    params: { userId: userId }
                })}
                >
                    <Text style={styles.bottomNavText}>🔍 Search</Text>
                </TouchableOpacity>
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
        marginBottom: 5,
        // 28
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
        marginTop: 10,
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
        padding: 28,
    },
    featuredImg: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginBottom: 0,
        // 6
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
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2222ff",
        borderRadius: 10,
        marginBottom: 0,
        padding: 10,
        minHeight: 60,
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
        flexShrink: 1,
    },
    deleteButton: {
        backgroundColor: "#ff4444",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 12,
        zIndex: 10,
        minWidth: 70,
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

    playlist: {
        color: "#fff",
        fontSize: 16,
        textDecorationLine: "underline",
    },
    playlistHome: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#2222ff",
        borderRadius: 10,
        marginBottom: 12,
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#1111ff',
        borderRadius: 12,
        padding: 18,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        color: '#000',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginLeft: 8,
        borderRadius: 8,
        backgroundColor: '#ffffff33',
    },
    modalPrimary: {
        backgroundColor: '#00cc44',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
// Here are some playlist names we making different one to test for now
// const [playlists, setPlaylists] = useState([
//     { id: "1", name: "My Favorites", cover: playlistCovers[0] },
//     { id: "2", name: "Workout Beats", cover: playlistCovers[1] },
//     { id: "3", name: "Chill Vibes", cover: playlistCovers[2] },
//     { id: "4", name: "Party Time", cover: playlistCovers[3] }
// ]);
// This is to delete the playlist you don't want
// const handleDelete = (id: string) => {
//     setPlaylists(playlists.filter(pl => pl.id !== id));
// };

// Well this is to add the playlist, maybe thinking to change name as well but for now default will be
// New Playlist with the id number
// const handleAddPlaylist = () => {
//     const newIdNum = playlists.length + 1;
//     setPlaylists([
//         ...playlists,
//         {
//             id: newIdNum.toString(),
//             name: `New Playlist ${newIdNum}`,
//             cover: playlistCovers[newIdNum % playlistCovers.length]
//         }
//     ]);
//
// };
//When back end ready
// useEffect(() => {
//     const fetchPlaylists = async () => {
//         try {
//             const response = await fetch("https://your-backend-api.com/playlists");
//             const data = await response.json();
//             setPlaylists(data); // Set the fetched playlists
//         } catch (error) {
//             console.error("Error fetching playlists:", error);
//         }
//     };
//     fetchPlaylists();
// }, );
//when backend ready
// const handleDelete = async (id: string) => {
//     try {
//         await fetch(`https://your-backend-api.com/playlists/${id}`, {
//             method: "DELETE",
//         });
//         setPlaylists(playlists.filter(pl => pl.id !== id)); // Remove locally after backend confirms
//     } catch (error) {
//         console.error("Error deleting playlist:", error);
//     }
// };
//When backend ready
// const handleAddPlaylist = async () => {
//     const newIdNum = playlists.length + 1;
//     const newPlaylist = {
//         id: newIdNum.toString(),
//         name: `New Playlist ${newIdNum}`,
//         cover: playlistCovers[newIdNum % playlistCovers.length],
//     };
//
//     try {
//         const response = await fetch("https://your-backend-api.com/playlists", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(newPlaylist),
//         });
//
//         if (!response.ok) throw new Error("Failed to add playlist");
//
//         setPlaylists([...playlists, newPlaylist]); // Update frontend if backend succeeds
//     } catch (error) {
//         console.error("Error adding playlist:", error);
//     }
// };const handleAddPlaylist = async () => {
//         const newPlaylist = {
//             name: `New Playlist ${playlists.length + 1}`,
//             cover: playlistCovers[playlists.length % playlistCovers.length],
//         };
//
//         try {
//             const response = await fetch("http://localhost:3000/playlists", { // Use local json-server
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(newPlaylist),
//             });
//
//             if (!response.ok) throw new Error("Failed to add playlist");
//
//             const addedPlaylist = await response.json(); // json-server auto-generates an ID
//             setPlaylists([...playlists, addedPlaylist]); // Add new playlist to state
//         } catch (error) {
//             console.error("Error adding playlist:", error);
//         }
//     };