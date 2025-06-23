import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router, Link } from "expo-router";
// Just create data for demonstration, fetch by ID
export default function PlaylistPage() {
    const { playlistID } = useLocalSearchParams();
    // const playlist = playlistsData[playlistId as string] || { name: "Unknown Playlist", songs: [] };
    // const [songs, setSongs] = useState(playlist.songs);

    const [playlist, setPlaylist] = useState<{ name: string; songs: { id: string; title: string; artist: string }[] } | null>(null);
    const [songs, setSongs] = useState<{ id: string; title: string; artist: string }[]>([]);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/playlist/${playlistID}/songs`);
                if (!response.ok) throw new Error("Failed to fetch playlist songs");

                const songs = await response.json();
                console.log("Fetched Songs:", songs);
                setSongs(songs);
            } catch (error) {
                console.error("Error fetching playlist:", error);
            }
        };

        if (playlistID) fetchPlaylist();
    }, [playlistID]);


    // This is to delete a song
    // const handleRemoveSong = (id: string) => {
    //     setSongs(songs.filter(song => song.id !== id));
    // };
    const handleRemoveSong = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/playlist/${playlistID}/songs`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ songs: songs.filter(song => song.id !== id) })
            });


            if (!response.ok) throw new Error("Failed to remove song");

            const updatedPlaylist = await response.json();
            setSongs(updatedPlaylist.songs); // Sync songs with backend
        } catch (error) {
            console.error("Error removing song:", error);
        }
    };


    // This is well to find similar music (In the description)
    const handleFindSimilar = (title: string) => {
        Alert.alert("Find Similar", `Search for songs similar to "${title}"`);
    };

    // Add new song
    // const handleAddSong = () => {
    //     const newId = (songs.length + 1).toString();
    //     setSongs([
    //         ...songs,
    //         { id: newId, title: `New Song ${newId}`, artist: "Unknown Artist" },
    //     ]);
    // };
    const handleAddSong = async () => {
        if (!playlistID) return;

        const newSong = {
            title: `New Song ${songs.length + 1}`,
            artist: "Unknown Artist"
        };

        try {
            const response = await fetch(`http://localhost:5000/playlist/${playlistID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSong),
            });

            if (!response.ok) throw new Error("Failed to add song");

            const updatedSongs = await response.json();
            console.log("Updated songs from backend:", updatedSongs);
            setSongs(updatedSongs); // Refresh the list from backend
        } catch (error) {
            console.error("Error adding song:", error);
        }
    };

    // Play playlist
    const handlePlay = () => {
        Alert.alert("Play Playlist", "Playing all songs in order!");
    };

    // Shuffle playlist
    const handleShuffle = () => {
        const shuffled = [...songs].sort(() => Math.random() - 0.5);
        setSongs(shuffled);
        Alert.alert("Shuffle Playlist", "Playlist shuffled!");
    };

    return (
        <View style={styles.container}>
            {/*Showing the playlist name*/}
            {/*<Text style={styles.title}>{playlist.name}</Text>*/}
            {playlist ? (
                <>
                    <Text style={styles.title}>{playlist.name}</Text>
                    <Text style={styles.songCount}>
                        {songs.length} {songs.length === 1 ? "song" : "songs"}
                    </Text>
                </>
            ) : (
                <Text style={styles.title}>Loading...</Text>
            )}

            {/*These are the feature buttons for the playlist page*/}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
                    <Text style={styles.actionText}>▶ Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shuffleButton} onPress={handleShuffle}>
                    <Text style={styles.actionText}>🔀 Shuffle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addSongButton} onPress={handleAddSong}>
                    <Text style={styles.addSongText}>+ Add Song</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={songs}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.songList}
                renderItem={({ item }) => (
                    <View style={styles.songRow}>
                        {/*<View>*/}
                        <Link href={{
                            pathname: "/MusicPlayer",
                            params: { playlistID, songID: item.id } // Pass playlistID correctly
                        }}>
                            <View>
                                <Text style={styles.songTitle}>{item.title}</Text>
                                <Text style={styles.songArtist}>{item.artist}</Text>
                            </View>
                        </Link>
                        {/*</View>*/}
                        <View style={styles.songActions}>
                            <TouchableOpacity
                                style={styles.songActionButton}
                                onPress={() => handleFindSimilar(item.title)}
                            >
                                <Text style={styles.songActionText}>Find Similar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.songActionButton, { backgroundColor: "#ff4444" }]}
                                onPress={() => handleRemoveSong(item.id)}
                            >
                                <Text style={styles.songActionText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyMsg}>No songs in this playlist. Add some!</Text>
                }
            />
            {/* The back button well to go back to home page */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/home")}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0000ff", padding: 18, paddingTop: 40 },
    title: { color: "#fff", fontSize: 26, fontWeight: "bold", marginBottom: 2, paddingTop: 40, },
    songCount: { color: "#b0b0ff", fontSize: 16, marginBottom: 18 },
    actionRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18, alignItems: "center" },
    playButton: { backgroundColor: "#00cc44", paddingVertical: 10, paddingHorizontal: 26, borderRadius: 8, marginRight: 10 },
    shuffleButton: { backgroundColor: "#2222ff", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginRight: 10 },
    addSongButton: { backgroundColor: "#2222ff", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
    actionText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    addSongText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    songList: { paddingBottom: 60 },
    songRow: { backgroundColor: "#2222ff", flexDirection: "row", alignItems: "center", borderRadius: 10, padding: 14, marginBottom: 10, justifyContent: "space-between" },
    songTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
    songArtist: { color: "#b0b0ff", fontSize: 15 },
    songActions: { flexDirection: "row", alignItems: "center" },
    songActionButton: { backgroundColor: "#00cc44", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginLeft: 8 },
    songActionText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
    emptyMsg: { color: "#fff", textAlign: "center", marginTop: 30, fontSize: 16 },
    backButton: { position: "absolute", left: 16, top: 40, backgroundColor: "#2222ff", padding: 8, borderRadius: 8 },
    backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
// const playlistsData: { [key: string]: { name: string; songs: { id: string; title: string; artist: string }[] } } = {
//     "1": {
//         name: "My Favorites",
//         songs: [
//             { id: "a", title: "Song A", artist: "Artist 1" },
//             { id: "b", title: "Song B", artist: "Artist 2" },
//         ],
//     },
//     "2": {
//         name: "Workout Beats",
//         songs: [
//             { id: "c", title: "Song C", artist: "Artist 3" },
//             { id: "d", title: "Song D", artist: "Artist 4" },
//         ],
//     },
// };