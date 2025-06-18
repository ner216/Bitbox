import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";


export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) {
        return null;
    }



    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                 <Stack>
                     <Stack.Screen name="index" options={{ headerShown: false }} />
                     <Stack.Screen name="login" options={{ headerShown: false }}/>
                     <Stack.Screen name="home" options={{ headerShown: false }} />
                     <Stack.Screen name="register" options={{ headerShown: false }}/>
                     <Stack.Screen name="playlist/[playlistID]" options={{ headerShown: false }} />
                     <Stack.Screen name="AccountScreen" options={{ headerShown: false }}/>
                     <Stack.Screen name="SearchScreen" options={{ headerShown: false }}/>
                     <Stack.Screen name="MusicPlayer" options={{ headerShown: false }}/>
                 </Stack>
                 <StatusBar style="auto" />
        </ThemeProvider>
    );
}

// name="(tabs)"
// name="+not-found"