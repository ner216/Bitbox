import React, { useState, useEffect } from 'react';
import {
    View, TextInput, StyleSheet, Text, TouchableOpacity, FlatList, Image
} from 'react-native';
import { router } from 'expo-router';

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [filtered, setFiltered] = useState([]);

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

    useEffect(() => {
        const lower = query.toLowerCase();
        setFiltered(
            playlists.filter((p) => p.name.toLowerCase().includes(lower))
        );
    }, [query, playlists]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/home")}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Search Music</Text>
            <TextInput
                style={styles.input}
                placeholder="Search for playlists..."
                placeholderTextColor="#999"
                value={query}
                onChangeText={setQuery}
            />

            {query ? (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.resultItem}
                            onPress={() => router.push(`/playlist/${item.id}`)}
                        >
                            <Image
                                source={{ uri: item.cover }}
                                style={styles.resultImage}
                            />
                            <Text style={styles.resultText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.placeholder}>Try typing something above</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
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
    placeholder: {
        marginTop: 20,
        color: 'white',
        fontSize: 16,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2222ff',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
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
