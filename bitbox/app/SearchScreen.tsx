import React, { useState } from 'react';
import {View, TextInput, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {router} from "expo-router";

export default function SearchScreen() {
    const [query, setQuery] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search Music</Text>
            <TextInput
                style={styles.input}
                placeholder="Search for songs or artists..."
                placeholderTextColor="#999"
                value={query}
                onChangeText={setQuery}
            />
            <Text style={styles.resultText}>
                {query ? `Searching for: ${query}` : 'Try typing something above'}
            </Text>
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
    backButton: { position: "absolute", left: 16, top: 40, backgroundColor: "#2222ff", padding: 8, borderRadius: 8 },
    backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    container: {
        flex: 1,
        backgroundColor: '#0000ff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    resultText: {
        marginTop: 20,
        color: 'white',
        fontSize: 16,
    },
});
