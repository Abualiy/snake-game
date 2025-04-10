// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveNewScore = async (score: number) => {
    try {
        const scores = await getHighScores();
        if (scores.length === 0 || score > scores[0]) {
            await AsyncStorage.setItem('highScores', JSON.stringify([score]));
        }
    } catch (error) {
        console.error('Error saving new score', error);
    }
};

export const getHighScores = async (): Promise<number[]> => {
    try {
        const scores = await AsyncStorage.getItem('highScores');
        return scores ? JSON.parse(scores) : [0];
    } catch (error) {
        console.error('Error getting high scores', error);
        return [];
    }
};

// Add a function to clear high scores
export const resetHighScores = async () => {
    try {
        await AsyncStorage.removeItem('highScores');
    } catch (error) {
        console.error('Error resetting high scores', error);
    }
};
