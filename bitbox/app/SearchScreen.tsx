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
            playlists.filter(p => p.name.toLowerCase().includes(lower))
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
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.resultItem}>
                            <Image source={{ uri: item.cover }} style={styles.resultImage} />
                            <Text style={styles.resultText}>{item.name}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.placeholder}>Try typing something above</Text>
            )}
        </View>
    );
}
