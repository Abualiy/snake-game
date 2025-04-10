import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Button, Text, TouchableOpacity, Image} from 'react-native';
import {icons} from "@/constants/icons";
import {generateFoodPosition} from "@/utils/gameLogic";
import {checkCollision} from "@/utils/gameLogic";
import {getHighScores, saveNewScore} from "@/utils/storage";
import {router} from "expo-router";
import { Audio } from 'expo-av'
// @ts-ignore
import gameOver from '@/assets/sound/game-over.mp3'
// @ts-ignore
import monster from '@/assets/sound/monster.mp3'


const GRID_WiDTH = 20; // 20x40 grid
const GRID_HEIGHT = 40;
const CELL_SIZE = 15;

const difficulties = {
    Easy: 150,
    Medium: 75,
    Hard: 5,
} as const;

type Difficulty = keyof typeof difficulties;

type Position = { x: number; y: number };

const initialSnake: Position[] = [{x: 10, y: 10}];

export default function Game({navigation}: any) {
    const [snake, setSnake] = useState<Position[]>(initialSnake);
    const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
    const [food, setFood] = useState(generateFoodPosition(GRID_WiDTH, GRID_HEIGHT));
    const [score, setScore] = useState(0);
    const [highScores, setHighScores] = useState<number[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

    const gameLoop = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
        if (!difficulty || isGameOver) return;

        const interval = setInterval(moveSnake, difficulties[difficulty]);
        return () => clearInterval(interval);
    }, [snake, direction, difficulty, isGameOver]);

    const moveSnake = async () => {
        const head = {...snake[0]};

        switch (direction) {
            case 'UP':
                head.y -= 1;
                break;
            case 'DOWN':
                head.y += 1;
                break;
            case 'LEFT':
                head.x -= 1;
                break;
            case 'RIGHT':
                head.x += 1;
                break;
        }

        const newSnake = [head, ...snake];

        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            const {sound} = await Audio.Sound.createAsync(monster);
            await sound.playAsync();

            setScore(score + 1);
            setFood(generateFoodPosition(GRID_WiDTH, GRID_HEIGHT));
        } else {
            newSnake.pop(); // Only grow if not eating
        }

        // Check for collisions
        if (checkCollision(head, newSnake, GRID_WiDTH, GRID_HEIGHT)) {
            setIsGameOver(true);
            saveNewScore(score).then(() => getHighScores().then(setHighScores));
            const { sound } = await Audio.Sound.createAsync(gameOver);
            await sound.playAsync();
            return;
        }


        setSnake(newSnake);
    };

    const renderSnake = () => {
        return snake.map((segment, index) => (
            <View
                key={index}
                style={[
                    styles.snake,
                    {
                        left: segment.x * CELL_SIZE,
                        top: segment.y * CELL_SIZE,
                    },
                ]}
            />
        ));
    };

    const renderFood = () => (
        <View
            style={[
                styles.food,
                {
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                },
            ]}
        />
    );

    return (
        <View className={'flex-1 flex-col pt-14  bg-[#000]'}>
            <View className={"relative z-0 w-full h-full items-center"}>
                <View style={styles.board} className={'border-2 border-amber-500 relative p-2'}>
                    <Text className={'text-white  text-2cl'}>Score: {score}</Text>
                    {renderSnake()}
                    {renderFood()}
                </View>

                <View className={'absolute flex-row bottom-9 gap-2 items-center'}>
                    <TouchableOpacity
                        className={'bg-blue-950  w-16 h-16 items-center justify-center rounded-lg'}
                        onPress={() => direction != 'RIGHT' && setDirection('LEFT')}>
                        <Text className={'text-white'} style={{fontSize: 50}}>◀️</Text>
                        {/*<Image source={icons.left} className={'w-12 h-12'}/>*/}
                    </TouchableOpacity>
                    <View className={'flex-col gap-2'}>
                        <TouchableOpacity
                            className={'bg-blue-950 w-16 h-16 items-center justify-center rounded-lg'}
                            onPress={() => direction != 'DOWN' && setDirection('UP')}>
                            <Text className={'text-white'} style={{fontSize: 50}}>🔼</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={'bg-blue-950 w-16 h-16 items-center justify-center rounded-lg'}
                            onPress={() => direction != 'UP' && setDirection('DOWN')}>
                            <Text className={'text-white'} style={{fontSize: 50}}>🔽</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        className={'bg-blue-950 w-16 h-16 items-center justify-center rounded-lg'}
                        onPress={() => direction != 'LEFT' && setDirection('RIGHT')}>
                        <Text className={'text-white'} style={{fontSize: 50}}>▶️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className={'absolute w-full h-full justify-center items-center z-3'}>
                {isGameOver && (
                    <View className={"gap-2 p-2 bg-gray-400 w-9/12 rounded-lg"}>
                        <Text className={'text-center text-3xl font-bold'}>🏆 High Score {highScores[0]}</Text>
                        <Text className={'text-center text-3xl font-bold'}>Your Score {score}</Text>
                        <Button
                            title="Restart Game"
                            onPress={() => {
                                setSnake(initialSnake);
                                setFood(generateFoodPosition(GRID_WiDTH, GRID_HEIGHT));
                                setScore(0);
                                setDirection('RIGHT');
                                setIsGameOver(false);
                            }}
                        />
                        <Button
                            title="Change Difficulty"
                            onPress={() => {
                                setDifficulty(null); // Go back to picker
                                setIsGameOver(false);
                                setSnake(initialSnake);
                                setScore(0);
                            }}
                            color="gray"
                        />
                        <Button
                            title="Exit"
                            onPress={router.back}
                            color="red"
                        />
                    </View>
                )}
            </View>

            <View className={"absolute w-full h-full justify-center left-1/4  z-4"}>
                {!difficulty && (
                    <View className={"gap-2 p-2 bg-gray-400 w-6/12 rounded-lg"}>
                        <Text className={"text-[18px] text-center font-bold"}>Choose Level</Text>
                        {Object.keys(difficulties).map((level) => (
                            <Button key={level} title={level} onPress={() => setDifficulty(level as Difficulty)}/>
                        ))}
                    </View>
                )}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    board: {
        width: GRID_WiDTH * CELL_SIZE,
        height: GRID_HEIGHT * CELL_SIZE,
    },
    snake: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
        borderRadius: 5,
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: CELL_SIZE / 2,
    },

});
