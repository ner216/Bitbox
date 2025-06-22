import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { router } from 'expo-router';

const BASE_URL = 'http://127.0.0.1:5000';

const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function MusicScreen() {
    const [song, setSong] = useState<any>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(1);
    const [position, setPosition] = useState(0);
    const isSeeking = useRef(false);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/songs/1`);
                const songData = response.data;
                setSong(songData);

                const audioUri = `${BASE_URL}/music/${songData.audio_file_url}`;

                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: false },
                    onPlaybackStatusUpdate
                );

                setSound(sound);
            } catch (error) {
                console.error('Error loading song:', error);
            }
        };

        fetchSong();
        return () => {
            sound?.unloadAsync();
        };
    }, []);

    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded || isSeeking.current) return;
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
    };

    const togglePlayback = async () => {
        if (!sound) return;
        isPlaying ? await sound.pauseAsync() : await sound.playAsync();
        setIsPlaying(!isPlaying);
    };

    const onSliderChange = async (value: number) => {
        if (!sound) return;
        isSeeking.current = true;
        const newPosition = (value / 100) * duration;
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);
        isSeeking.current = false;
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/BitBox_Main_Logo-removebg-preview.png')}
                style={styles.albumArt}
            />

            <Text style={styles.title}>{song?.title || '...'}</Text>
            <Text style={styles.artist}>{song?.artist || '...'}</Text>

            <View style={styles.timeRow}>
                <Text style={styles.timestamp}>{formatTime(position)}</Text>
                <Text style={styles.timestamp}>-{formatTime(duration - position)}</Text>
            </View>

            {Platform.OS === 'web' ? (
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={(position / duration) * 100}
                    onChange={(e) => onSliderChange(Number(e.target.value))}
                    style={styles.webSlider}
                />
            ) : (
                <Text style={{ color: 'white' }}>Mobile slider placeholder</Text>
            )}

            <View style={styles.controls}>
                <Pressable style={styles.controlButton} onPress={() => {}}>
                    <Image
                        source={require('../assets/BitBox_Main_Logo-removebg-preview.png')}
                        style={styles.logoIcon}
                    />
                </Pressable>

                <Pressable style={styles.controlButton}>
                    <Text style={styles.controlSymbol}>⏮</Text>
                </Pressable>

                <Pressable
                    onPress={togglePlayback}
                    style={({ pressed }) => [
                        styles.controlButton,
                        pressed && styles.pressedButton,
                        !sound && { opacity: 0.5 },
                    ]}
                >
                    <Text style={styles.controlSymbol}>{isPlaying ? '⏸' : '▶'}</Text>
                </Pressable>

                <Pressable style={styles.controlButton}>
                    <Text style={styles.controlSymbol}>⏭</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(0, 0, 255)',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
    },
    albumArt: {
        width: 250,
        height: 250,
        marginBottom: 20,
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 20,
    },
    timeRow: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        paddingHorizontal: 4,
    },
    timestamp: {
        color: '#fff',
        fontSize: 14,
    },
    webSlider: {
        width: '80%',
        marginBottom: 30,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    controlButton: {
        marginHorizontal: 20,
    },
    controlSymbol: {
        fontSize: 32,
        color: '#fff',
    },
    pressedButton: {
        transform: [{ scale: 0.9 }],
    },
    logoIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginHorizontal: 10
    },
});
