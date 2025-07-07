import React, { useState, useEffect } from 'react';
import {
    View, 
    TextInput, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    FlatList, 
    Image, 
    Modal, 
    ModalBody, 
    ModalFooter, 
    ModalHeader
} from 'react-native';
import { useLocalSearchParams, useRouter, router } from "expo-router";
import axios from 'axios';
import { Audio } from 'expo-av';

const API_BASE_URL = "http://127.0.0.1:5000";

export default function SearchScreen() {
    // Stores all playlists that a user has
    const [playlists, setPlaylists] = useState([]);
    // Store song data results from search
    const [searchResultData, setSearchResultData] = useState([]);
    // Stores the search result song info
    const [item, setItem] = useState(null);
    // Stores the search bar query
    const [searchName, setSearchName] = useState("");
    // Selected sound audio to be played
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    // Store song info for the song audio to be played
    const [isPlaying, setIsPlaying] = useState(false);
    // Store status of the 'add to playlist' Modal menu
    const [openPlaylistModal, setOpenPlaylistModal] = useState(false);
    // Store status of the similar song Modal menu
    const [openSimilarModal, setOpenSimilarModal] = useState(false);
    // Used to store similar song info
    const [similarSongs, setSimilarSongs] = useState([])
    // Used for adding a song from the search results to a playlist
    const [selectedSong, setSelectedSong] = useState([])


    //Gets the user ID from routing
    const { userId } = useLocalSearchParams();

    //Gather playlist information per user account.
    //Needed to add a searched song to a playlist.
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/${userId}/playlists`)
                // Set map object of playlist info to Playlist hook
                setPlaylists(response.data);

            } 
            catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };
        fetchPlaylists();
    }, []);

    // GET request -- fetch a searched song.
    // Use searchName hook for search data for request
    async function fetchSearchResults() {
        try {
            const response = await axios.get(`${API_BASE_URL}/songs/${searchName}/search`);
            
            // Add search results to searchResultData
            setSearchResultData(response.data); // Must be an array to be used in setSearchResultData()
            console.log(searchResultData.map(item => item.song_id))
            console.log(`PRINT SEARCHDATA: ${searchResultData[0]}`)
            console.log(`Fetched results for ${searchName} successfully!`);
        }
        catch (err) {
            console.error(`Error fetching ${searchName}`, err);
        }
    }

    // GET request -- fetch the song audio file from the backend
    // Uses the 'selectedSong' hook to get song information for audio file request
    async function fetchSound() {
        const audioUri = `${API_BASE_URL}/music/${selectedSong.audio_file_url}`;
        try {
            //Loads sound into memory, false makes it so it doesn't play right away
                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: false }
                );

            //Stores the sound object in a state
            setSound(sound);
        }
        catch (err) {
            console.error(`Error loading song audio for ${selectedSong.title}`)
        }
        
    }

    // GET request -- get similar songs
    async function getSimilar(songId: number) {
        try {
            const response = await axios.get(`${API_BASE_URL}/similar/${songId}`);

            setSimilarSongs(response.data);
        }
        catch (err) {
            console.error(`Error fetching ${songId}`, err);
        }

        return null;
    }

    // POST request -- Add song to playlist
    async function addSongToPlaylist(playlist_id: number) {
        try {
            const response = await axios.post(`${API_BASE_URL}/playlist/${playlist_id}/add_song/${selectedSong.song_id}`);
        }
        catch (err) {
            console.error(`Error adding song(${selectedSong.song_id}) to playlist(${playlist_id})`)
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
                onPress={() => fetchSearchResults()}
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

            {searchResultData ? (
                <FlatList
                    data={searchResultData}
                    keyExtractor={(item) => item.song_id}
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
                                        // Select the song in flatlist
                                        setSelectedSong(item)
                                        // Load audio file
                                        fetchSound()
                                        // Play song
                                        togglePlayback()
                                    }}
                                >
                                    <Text style={styles.resultActionButtonText}>Play</Text>
                                </TouchableOpacity>

                                {/* Add to playlist button */}
                                <TouchableOpacity
                                    style={styles.resultActionButton}
                                    onPress={() => {
                                        setSelectedSong(item)
                                        setOpenPlaylistModal(true)
                                        
                                    }}
                                >
                                    <Text style={styles.resultActionButtonText}>Add</Text>
                                </TouchableOpacity>

                                {/* Find similar songs button */}
                                <TouchableOpacity
                                    style={styles.resultActionButton}
                                    onPress={() => {
                                        getSimilar(item.song_id)
                                        setOpenSimilarModal(true)
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

            {/* Modal Menu for playlist selection */}
            <Modal
                animationType="fade"
                visible={openPlaylistModal}
                transparent={true}
                onRequestClose={() => setOpenPlaylistModal(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* Modal Menu title */}
                        <Text style={styles.modalTitle}>Add to Playlist</Text>

                        {/* Playlist flatlist */}
                        {playlists ? (
                            <FlatList
                                data={playlists}
                                keyExtractor={(item) => item.playlist_id}
                                renderItem={({ item }) => (
                                    <View style={styles.resultItem}>
                                            <Text style={styles.resultText}>{item.name}</Text>
                                            <View style={styles.searchRowButtonContainer}>
                                                {/* Add song to playlist button */}
                                                <TouchableOpacity
                                                    style={styles.resultActionButton}
                                                    onPress={() => {
                                                        addSongToPlaylist(item.playlist_id)
                                                    }}
                                                >
                                                    <Text style={styles.resultActionButtonText}>Add</Text>
                                                </TouchableOpacity>
                                            </View>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text>No Playlists</Text>
                        )}

                        {/* Modal Menu cancel button */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setOpenPlaylistModal(false)}
                            >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </Modal>
            
            {/* Modal Menu to show similar songs */}
            <Modal
                animationType="fade"
                visible={openSimilarModal}
                transparent={true}
                onRequestClose={() => setOpenSimilarModal(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* Modal Menu title */}
                        <Text style={styles.modalTitle}>Similar Tunes</Text>

                        {/* Playlist flatlist */}
                        {similarSongs ? (
                            <FlatList
                                data={similarSongs}
                                keyExtractor={(item) => item.song_id}
                                renderItem={({ item }) => (
                                    <View style={styles.resultItem}>
                                            <Text style={styles.resultText}>{item.title}</Text>
                                            <View style={styles.searchRowButtonContainer}>
                                                {/* Add song to playlist button */}
                                                <TouchableOpacity
                                                    style={styles.resultActionButton}
                                                    onPress={() => {
                                                        // Select the song in flatlist
                                                        setSelectedSong(item)
                                                        // Load audio file
                                                        fetchSound()
                                                        // Play song
                                                        togglePlayback()
                                                    }}
                                                >
                                                    <Text style={styles.resultActionButtonText}>Play</Text>
                                                </TouchableOpacity>

                                                {/* Play song button */}
                                                <TouchableOpacity
                                                    style={styles.resultActionButton}
                                                    onPress={() => {
                                                        //addToPlaylist()
                                                    }}
                                                >
                                                    <Text style={styles.resultActionButtonText}>Add</Text>
                                                </TouchableOpacity>
                                            </View>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text>No Similar Songs</Text>
                        )}

                        {/* Modal Menu cancel button */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setOpenSimilarModal(false)}
                            >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

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
    cancelButton: {
        backgroundColor: "#191970",
        //position: 'absolute',
        //top: 40,
        //left: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    buttonText: {
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
    modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
    },
    centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    }
});
