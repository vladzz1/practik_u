import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface ProfileModel {
    email: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
}

export default function ProfileScreen() {
    const [profile, setProfile] = useState<ProfileModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const url = "https://webpd411.itstep.click/api/account/profile";

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);

                const token = await SecureStore.getItemAsync('userToken');

                if (!token) {
                    router.replace('/login');
                    return;
                }

                const response = await axios.get<ProfileModel>(url, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });

                setProfile(response.data);
            } catch (error: any) {
                console.error("Помилка завантаження профілю:", error);

                if (error.response?.status === 401) {
                    await SecureStore.deleteItemAsync('userToken');
                    router.replace('/login');
                } else {
                    Alert.alert("Помилка", "Не вдалося завантажити дані профілю.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center">
                <ActivityIndicator size="large" color="#ff5500" />
            </SafeAreaView>
        );
    }

    const getAvatarLetter = () => {
        if (profile?.firstName) return profile.firstName.charAt(0).toUpperCase();
        if (profile?.email) return profile.email.charAt(0).toUpperCase();
        return "U";
    };

    const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || 'Користувач';

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <ScrollView
                className="flex-1"
                contentContainerClassName="px-6 py-10"
            >
                <View className="flex-row items-center justify-between mb-8">
                    <Pressable onPress={() => router.back()} className="active:opacity-70 py-2">
                        <Text className="text-base text-gray-400">Назад</Text>
                    </Pressable>

                    <Text className="text-xl font-bold text-white">
                        Мій профіль
                    </Text>
                    
                    <View className="w-10" />
                </View>

                <View className="items-center mb-8">
                    <View className="mb-4 h-28 w-28 items-center justify-center rounded-full bg-[#1c1c1c] border-2 border-[#333] overflow-hidden">
                        {profile?.image ? (
                            <Image 
                                source={{ uri: `https://webpd411.itstep.click/images/${profile.image}_1280.webp` }} 
                                className="h-full w-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="h-full w-full bg-[#ff5500] items-center justify-center">
                                <Text className="text-4xl font-bold text-white">
                                    {getAvatarLetter()}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text className="text-2xl font-bold text-white text-center">
                        {fullName}
                    </Text>
                </View>

                <View className="rounded-2xl bg-[#1c1c1c] p-5 mb-6 border border-[#242424]">

                    <View className="mb-4 border-b border-[#242424] pb-3">
                        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Ім'я
                        </Text>
                        <Text className="text-base font-semibold text-white">
                            {profile?.firstName || 'Не вказано'}
                        </Text>
                    </View>

                    <View className="mb-4 border-b border-[#242424] pb-3">
                        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Прізвище
                        </Text>
                        <Text className="text-base font-semibold text-white">
                            {profile?.lastName || 'Не вказано'}
                        </Text>
                    </View>

                    <View className="pb-1">
                        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Електронна пошта
                        </Text>
                        <Text className="text-base font-semibold text-white">
                            {profile?.email}
                        </Text>
                    </View>
                </View>

                <View className="space-y-4">
                    

                    <Pressable
                        onPress={async () => {
                            await SecureStore.deleteItemAsync('userToken')
                            router.replace("/login")
                        }}
                        className="items-center rounded-xl bg-transparent border border-[#333] py-4 active:bg-[#1c1c1c]"
                    >
                        <Text className="text-base font-semibold text-red-500">
                            Вийти з акаунту
                        </Text>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}