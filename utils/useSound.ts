// utils/useSound.ts
import { Audio } from 'expo-av';

export async function playSound(uri: any) {
    const { sound } = await Audio.Sound.createAsync(uri);
    await sound.playAsync();
    return sound;
}
