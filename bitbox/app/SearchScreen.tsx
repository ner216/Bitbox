import React, { useState, useEffect } from 'react';
import {
    View, TextInput, StyleSheet, Modal, Text, TouchableOpacity, FlatList, Image
} from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from 'axios';
import { Audio } from 'expo-av';

const API_BASE_URL = "http://127.0.0.1:5000";

export default function SearchScreen() {
    const [playlists, setPlaylists] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [item, setItem] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    //Gets the user ID from routing
    const { userId } = useLocalSearchParams();

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


            const filename = response.data[5]; // Get audio file name from response
            const audioUri = `${API_BASE_URL}/music/${filename}`;

            //Used for troubleshooting the URL
            console.log("Audio URI:", audioUri);

            //Loads sound into memory, false makes it so it doesn't play right away
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: false }
            );

            //Stores the sound object in a state
            setSound(sound);
        }
        catch (err) {
            console.error(`Error fetching ${searchName}`, err);
        }
    }

    //This is the play and pause function
    const togglePlayback = async () => {
        if (!sound) return;
        isPlaying ? await sound.pauseAsync() : await sound.playAsync();
        setIsPlaying(!isPlaying);
    };

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
                        <View // Main component for the row
                            style={styles.resultItem}
                        >

                            {/* Song title */}
                            <Text style={styles.resultText}>{item.title}</Text>

                            {/* Container for the extra row buttons */}
                            <View style={styles.searchRowButtonContainer}>
                                {/* Play song button */}
                                <TouchableOpacity
                                    style={styles.resultActionButton}
                                    onPress={() => {
                                        togglePlayback()
                                    }}
                                >
                                    <Text style={styles.resultActionButtonText}>Play</Text>
                                </TouchableOpacity>

                                {/* Add to playlist button */}
                                <TouchableOpacity
                                    style={styles.resultActionButton}
                                    onPress={() => {

                                    }}
                                >
                                    <Text style={styles.resultActionButtonText}>Add</Text>
                                </TouchableOpacity>

                                {/* Find similar songs button */}
                                <TouchableOpacity
                                    style={styles.resultActionButton}
                                    onPress={() => {

                                    }}
                                >
                                    <Text style={styles.resultActionButtonText}>Similar</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    )}
                />
            ) : (
                <Text style={styles.placeholder}>Nothing yet!</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // Style the main page contianer--background/layout
    container: {
        backgroundColor: '#6495ed',
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    // Style the back button
    backButton: {
        backgroundColor: "#191970",
        position: 'absolute',
        top: 40,
        left: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    // Style the back button text
    backButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    // Style the page title
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    // Style the search fild text box
    input: {
        backgroundColor: '#111',
        color: '#fff',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#444',
    },
    // Style the search button text
    searchButton: {
        backgroundColor: "#191970",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: "right",
        marginLeft: "auto", // Pushes it as far right as possible
    },
    // Style the search button text
    searchButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    // Use to style icons on buttons
    buttonIcon: {
        width: 20, // Adjust size as needed
        height: 20,
        resizeMode: 'contain',
    },
    // Style the buttons on each of the search result song containers
    resultActionButton: {
        backgroundColor: "#191970",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginLeft: 10,
        justifyContent: "center",
        flexDirection: 'row', // Arrange buttons horizontally
        alignItems: 'center', // Vertically center buttons
    },
    // Style the text for buttons on each of the search result song containers
    resultActionButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    // Style text that shows when search box is empty
    placeholder: {
        marginTop: 20,
        color: 'white',
        fontSize: 16,
    },
    // Style the container that holds each search song result
    resultItem: {
        flexDirection: 'row', // Arrange buttons horizontally
        alignItems: 'center',
        justifyContent: 'space-between', // Pushes content to edges: text to left, buttons to right
        backgroundColor: '#191970',
        minHeight: 60, // Give the row a minimum height for better touch area
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 40,
    },
    // Style container view that holds resultItem buttons
    searchRowButtonContainer: {
        flexDirection: 'row', // Arrange buttons horizontally
    },
    // Style the text for the song titles in search results
    resultText: {
        color: '#fff',
        fontSize: 18,
    },
});
