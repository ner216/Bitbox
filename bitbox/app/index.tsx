import {StyleSheet, View, Image, Dimensions} from "react-native";
// import {useVideoPlayer} from "expo-video";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function Intro() {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => router.replace("/login"), 2001);
    }, );

    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    return (
        <View style={styles.container}>
            <Image source={require("../assets/newintro.gif")}
                   style={{ width: windowWidth,height: windowHeight, alignSelf:'center'}}
                   resizeMode="cover"
                   />
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1,justifyContent: "center",alignItems: "center", overflow: "hidden" },
    video: { width: "100%", height: "100%" },
});

// backgroundColor: "#000"
// const localSource = require("../assets/intro.mp4");
// const player = useVideoPlayer(localSource, (player) =>{
//     player.staysActiveInBackground = true;
//     player.play();
// })

// app/index.tsx (was intro.tsx)
{/*<VideoView*/}
{/*    source={require("../assets/intro.mp4")}*/}
{/*    autoPlay*/}
{/*    loop={false}*/}
{/*    player={player}*/}
{/*    style={{*/}
{/*        width: Dimensions.get("window").width,*/}
{/*        height: Dimensions.get("window").height,*/}
{/*    }}*/}
{/*    allowsFullscreen*/}
{/*    allowsPictureInPicture*/}
{/*    startsPictureInPictureAutomatically*/}
{/*/>*/}




