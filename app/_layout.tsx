import {StatusBar} from "react-native";
import {Stack} from "expo-router";
import  "./global.css"

export default function RootLayout() {
  return (
      <>
        <StatusBar hidden={true} />

        <Stack>
          <Stack.Screen
            name={"index"}
            options={{
              headerShown: false,
            }}/>
            <Stack.Screen
                name={"screen/game"}
                options={{
                    headerShown: false,
                }}/>
            <Stack.Screen
                name={"screen/highscore"}
                options={{
                    headerShown: false,
                }}/>
        </Stack>
      </>
  )
}