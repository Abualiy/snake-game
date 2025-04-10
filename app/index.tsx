import {View, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import {red} from "react-native-reanimated/lib/typescript/Colors";
import {Link} from "expo-router";
import {icons} from "@/constants/icons";

const Index = () => {
    return (
        <View className={"flex-1 flex-col gap-10 justify-center items-center bg-green-300"}>
            <View className={'flex-col gap-2 justify-center items-center w-full'}>
                <Image source={icons.bg} className={'w-9/12 rounded-lg'}/>
                <Text className={'text-[4rem] text-blue-950 font-bold'}>Anaconda</Text>
                <Text className={'text-[2rem] text-blue-950 font-bold mt-[-1rem]'}>Snake Game</Text>

            </View>

            <View className={'flex-col gap-5 justify-center items-center w-full'}>
                <Link href="/screen/game" asChild>
                    <TouchableOpacity
                        className="w-6/12 bg-blue-950 rounded-lg flex-row justify-center items-center gap-2 px-5 py-2">
                        <Image source={icons.game} className="w-16 h-12"/>
                        <Text className="text-3xl text-white font-bold">Play</Text>
                    </TouchableOpacity>
                </Link>

                <Link href={'/screen/highscore'} asChild>
                    <TouchableOpacity
                        className="w-6/12 bg-blue-950 rounded-lg flex-row justify-center items-center gap-2 px-5 py-2">
                        <Image source={icons.score} className="w-16 h-12"/>
                        <Text className="text-3xl text-white font-bold">High Score</Text>
                    </TouchableOpacity>
                </Link>


            </View>
            <View className={'absolute bottom-5'}>
                <Text className={'text-base text-gray-600 font-bold'}>By Akrem Muktar(Abu_Aliy) &copy; 2025 G.C</Text>
            </View>
        </View>
    )
}
export default Index
