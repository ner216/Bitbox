import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000'; // Replace with your LAN IP if testing on a physical device
const userId = 1; // Change to your actual user ID source

const AccountScreen = () => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/users/${userId}/playlists`);
                setPlaylists(response.data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, []);

    const topPlaylists = playlists
        .sort((a, b) => b.minutes - a.minutes)
        .slice(0, 3);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Username</Text>
            <Text style={styles.subtext}>Total Minutes Listened: {playlists.reduce((sum, p) => sum + (p.minutes || 0), 0)}</Text>
            <Text style={styles.sectionHeader}>My Top Playlists</Text>

            <FlatList
                data={topPlaylists}
                keyExtractor={(item, index) => item.name + index}
                renderItem={({ item }) => (
                    <View style={styles.playlistContainer}>
                        <Image
                            source={{
                                uri: item.coverArt || 'https://via.placeholder.com/100',
                            }}
                            style={styles.coverArt}
                        />
                        <View>
                            <Text style={styles.playlistName}>{item.name}</Text>
                            <Text style={styles.minutesListened}>{item.minutes} minutes</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0000ff',
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtext: {
        fontSize: 16,
        color: 'white',
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    playlistContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff22',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    coverArt: {
        width: 60,
        height: 60,
        borderRadius: 4,
        marginRight: 15,
    },
    playlistName: {
        fontSize: 16,
        color: 'white',
    },
    minutesListened: {
        fontSize: 14,
        color: '#ccc',
    },
});

export default AccountScreen;
