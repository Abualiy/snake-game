import {View, Text, Button} from 'react-native'
import React, {useEffect, useState} from 'react'
import {getHighScores, resetHighScores} from "@/utils/storage";
import {router} from "expo-router";

const Highscore = () => {
    const [highScores, setHighScores] = useState<number[]>([]);
    const resetScores = () => {
        resetHighScores().then(() => {
            setHighScores([0]);// Clear the high scores from the UI as well
        });

    };

    useEffect(() => {
        getHighScores().then(setHighScores);
    }, []);

    return (
        <View className={'flex-1 flex-col w-full h-full justify-center items-center bg-blue-950'}>
            <View className={'w-9/12 flex-col gap-2 '}>
                <Text className={'font-bold text-4xl text-white text-center'}>🏆 High Scores: {highScores}</Text>

                <Button title="Reset High Scores" onPress={resetScores} color="gray" />
                <Button title="Home" onPress={router.back} color="blue" />
            </View>
        </View>
    )
}
export default Highscore
