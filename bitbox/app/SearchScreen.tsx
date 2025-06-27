import React, { useState, useEffect } from 'react';
import {
    View, TextInput, StyleSheet, Text, TouchableOpacity, FlatList, Image
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:5000";

export default function SearchScreen() {
    const [playlists, setPlaylists] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [item, setItem] = useState(null)
    const [searchName, setSearchName] = useState("")

    //Gather playlist information per user account.
    //Needed to add a searched song to a playlist.
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/playlists");
                const data = await response.json();
                setPlaylists(data);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };
        fetchPlaylists();
    }, []);

    // GET request -- fetch a searched song.
    const fetchSongs = async() => {
        try {
            const response = await axios.get(`${API_BASE_URL}/songs/${searchName}/search`);
            const formattedResponse = [{
                id: response.data[0].toString(),    // Flatlist object expects string objects(props)
                title: response.data[1],
                artist: response.data[2],
                genre: response.data[3],
                durationSec: response.data[4].toString(),   // Flatlist object expects string objects(props)
                audioFileName: response.data[5],
                similarFileName: response.data[6]
            }];
            console.log(formattedResponse); // Show backend response for debugging
            setFiltered(formattedResponse); // Must be an array to be used in setFiltered()
            console.log(`Fetched ${searchName} successfully!`);
        }
        catch (err) {
            console.error(`Error fetching ${searchName}`, err);
        }
    }

    return (
        <View style={styles.container}>
            {/*JSX code for the back button*/}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/home")}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/*JSX code for the search button*/}
            <TouchableOpacity
                style={styles.searchButton}
                onPress={() => fetchSongs()}
            >
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Search Music</Text>
            <TextInput
                style={styles.input}
                placeholder="Search for playlists..."
                placeholderTextColor="#999"
                value={searchName}
                onChangeText={setSearchName}
            />

            {searchName ? (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.resultItem}
                            onPress={() => router.push({
                                pathname: "/MusicPlayer/",
                                params: { songId: item.id }
                            })}
                        >
                            <Text style={styles.resultText}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.placeholder}>Nothing yet!</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6495ed',
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    backButton: {
        backgroundColor: "#191970",
        position: 'absolute',
        top: 40,
        left: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#111',
        color: '#fff',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#444',
    },
    searchButton: {
        backgroundColor: "#191970",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: "right",
        marginLeft: "auto", // Pushes it as far right as possible
    },
    searchButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    placeholder: {
        marginTop: 20,
        color: 'white',
        fontSize: 16,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#191970',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 40,
    },
    resultImage: {
        width: 48,
        height: 48,
        borderRadius: 6,
        marginRight: 12,
    },
    resultText: {
        color: '#fff',
        fontSize: 18,
    },
});
