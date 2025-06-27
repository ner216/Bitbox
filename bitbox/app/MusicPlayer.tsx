import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';

//Base URL for the backend
const BASE_URL = 'http://127.0.0.1:5000';

//Converts milliseconds to minutes and seconds for the slider bar
const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function MusicScreen() {
    //Gets the song ID from routing
    const { songId } = useLocalSearchParams();

    //React state to manage data, the audio objects, and playback stuff
    const [song, setSong] = useState<any>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(1);
    const [position, setPosition] = useState(0);
    const isSeeking = useRef(false);

    //Gets the song once the screen loads
    useEffect(() => {
        const fetchSong = async () => {
            try {
                //Calls to the backend to get the song data
                const response = await axios.get(`${BASE_URL}/songs/${songId}`);
                const songArray = response.data;

                //Sets the song data
                const songObject = {
                    id: songArray[0],
                    title: songArray[1],
                    artist: songArray[2],
                    genre: songArray[3],
                    duration: songArray[4],
                    audio_file_url: songArray[5],
                    audio_file_name: songArray[6],
                };

                setSong(songObject);

                const filename = songObject.audio_file_url;
                const audioUri = `${BASE_URL}/music/${filename}`;

                //Used for troubleshooting the URL
                console.log("Audio URI:", audioUri);

                //Loads sound into memory, false makes it so it doesn't play right away
                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: false }
                );

                //Playback status updates
                sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

                //Stores the sound object in a state
                setSound(sound);
            } catch (err) {
                console.error("Error loading song:", err);
            }
        };


        //Unloads the song when it's over
        fetchSong();
        return () => {
            sound?.unloadAsync();
        };
    }, []);

    //Updates the position of the slider when the song is going
    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded || isSeeking.current) return;
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
    };

    //This is the play and pause function
    const togglePlayback = async () => {
        if (!sound) return;
        isPlaying ? await sound.pauseAsync() : await sound.playAsync();
        setIsPlaying(!isPlaying);
    };

    //This skips around the song when you move the slider
    const onSliderChange = async (value: number) => {
        if (!sound) return;
        isSeeking.current = true;
        const newPosition = (value / 100) * duration;
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);
        isSeeking.current = false;
    };

    //Using the BitBox logo as album art, dynamic album art was out of the scope of the project
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/Bitbox_logo.png')}
                style={styles.albumArt}
            />

            {/*JSX code for the back button*/}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/home")}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/*Makes the song show '...' when not playing anything*/}
            <Text style={styles.title}>{song?.title || '...'}</Text>
            <Text style={styles.artist}>{song?.artist || '...'}</Text>

            {/*Does the time stamps on the sides of the slider*/}
            <View style={styles.timeRow}>
                <Text style={styles.timestamp}>{formatTime(position)}</Text>
                <Text style={styles.timestamp}>-{formatTime(duration - position)}</Text>
            </View>

            {/*Changes the UI around for mobile, mobile slider still in progress*/}
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

            {/*The controls for the play/pause, fast forward, rewind buttons*/}
            <View style={styles.controls}>
                <Pressable style={styles.controlButton} onPress={() => {}}>
                    <Image
                        source={require('../assets/Bitbox_logo.png')}
                        style={styles.logoIcon}
                    />
                </Pressable>

                {/*Rewind button*/}
                <Pressable style={styles.controlButton}>
                    <Text style={styles.controlSymbol}>⏮</Text>
                </Pressable>

                {/*The play/pause button, changes when playing or paused, and grayed out when no song is available*/}
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

                {/*Fast forward button*/}
                <Pressable style={styles.controlButton}>
                    <Text style={styles.controlSymbol}>⏭</Text>
                </Pressable>

            </View>
        </View>
    );
}

//Style sheet for all the buttons
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(0, 0, 255)',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
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