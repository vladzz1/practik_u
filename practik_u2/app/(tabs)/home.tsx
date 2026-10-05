import {useState} from 'react'
import {Pressable, ScrollView, Text, TextInput, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {router} from 'expo-router'

type Track = {
    id: string
    title: string
    artist: string
    duration: string
    color: string
}

const recent: Track[] = [
    {id: '1', title: 'Нічний драйв', artist: 'Lumen', duration: '3:42', color: '#ff5500'},
    {id: '2', title: 'Тиша', artist: 'Okean', duration: '4:10', color: '#3b82f6'},
    {id: '3', title: 'Весна', artist: 'Dakh', duration: '2:58', color: '#10b981'},
    {id: '4', title: 'Хвилі', artist: 'Nova', duration: '3:25', color: '#a855f7'},
];

const playlists = [
    {id: 'p1', title: 'Ранковий настрій', count: 24, color: '#f59e0b'},
    {id: 'p2', title: 'Фокус', count: 31, color: '#06b6d4'},
    {id: 'p3', title: 'Спорт', count: 18, color: '#ef4444'},
    {id: 'p4', title: 'Вечір', count: 27, color: '#8b5cf6'},
];

const forYou: Track[] = [
    {id: '5', title: 'Містами', artist: 'Lumen', duration: '3:12', color: '#ec4899'},
    {id: '6', title: 'Світанок', artist: 'Okean', duration: '4:01', color: '#14b8a6'},
    {id: '7', title: 'Дорога додому', artist: 'Dakh', duration: '3:36', color: '#f97316'},
    {id: '8', title: 'Інший берег', artist: 'Nova', duration: '2:49', color: '#6366f1'},
];

export default function HomeScreen() {
    const [query, setQuery] = useState('');
    const [current, setCurrent] = useState<Track>(recent[0]);
    const [playing, setPlaying] = useState(false);

    const play = (track: Track) => {
        setCurrent(track);
        setPlaying(true);
    };

    const filteredForYou = forYou.filter(
        (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.artist.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
            <ScrollView
                className="flex-1"
                contentContainerClassName="px-6 pt-4 pb-32"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="mb-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-sm text-gray-400">Вітаємо знову</Text>
                        <Text className="text-3xl font-bold text-white">Що слухаємо?</Text>
                    </View>

                    <Pressable
                        onPress={() => router.replace('/login')}
                        className="h-12 w-12 items-center justify-center rounded-full bg-[#ff5500] active:opacity-80"
                    >
                        <Text className="text-lg font-bold text-white">M</Text>
                    </Pressable>
                </View>

                {/* Search */}
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Пошук треків та виконавців"
                    placeholderTextColor="#777"
                    className="mb-8 rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white"
                />

                {/* Recent */}
                <Text className="mb-4 text-xl font-bold text-white">Нещодавно</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-8 -mx-6"
                    contentContainerClassName="px-6 gap-4"
                >
                    {recent.map((track) => (
                        <Pressable
                            key={track.id}
                            onPress={() => play(track)}
                            className="w-36 active:opacity-80"
                        >
                            <View
                                className="mb-3 h-36 w-36 items-end justify-end rounded-2xl p-3"
                                style={{backgroundColor: track.color}}
                            >
                                <View className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
                                    <Text className="text-xs text-white">▶</Text>
                                </View>
                            </View>
                            <Text className="font-semibold text-white" numberOfLines={1}>
                                {track.title}
                            </Text>
                            <Text className="text-xs text-gray-400" numberOfLines={1}>
                                {track.artist}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Playlists */}
                <Text className="mb-4 text-xl font-bold text-white">Плейлисти</Text>
                <View className="mb-8 flex-row flex-wrap justify-between">
                    {playlists.map((p) => (
                        <Pressable
                            key={p.id}
                            onPress={() => console.log('Open playlist', p.id)}
                            className="mb-4 w-[48%] overflow-hidden rounded-2xl bg-[#1c1c1c] active:opacity-80"
                        >
                            <View className="h-24" style={{backgroundColor: p.color}} />
                            <View className="p-3">
                                <Text className="font-semibold text-white" numberOfLines={1}>
                                    {p.title}
                                </Text>
                                <Text className="text-xs text-gray-400">{p.count} треків</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* For you */}
                <Text className="mb-4 text-xl font-bold text-white">Для тебе</Text>
                <View className="rounded-2xl bg-[#1c1c1c] p-2">
                    {filteredForYou.length === 0 && (
                        <Text className="p-4 text-center text-sm text-gray-400">
                            Нічого не знайдено. Спробуй інший запит.
                        </Text>
                    )}
                    {filteredForYou.map((track) => {
                        const active = current.id === track.id;
                        return (
                            <Pressable
                                key={track.id}
                                onPress={() => play(track)}
                                className="flex-row items-center rounded-xl p-3 active:bg-[#242424]"
                            >
                                <View
                                    className="mr-4 h-12 w-12 rounded-lg"
                                    style={{backgroundColor: track.color}}
                                />
                                <View className="flex-1">
                                    <Text
                                        className={`font-semibold ${active ? 'text-[#ff5500]' : 'text-white'}`}
                                        numberOfLines={1}
                                    >
                                        {track.title}
                                    </Text>
                                    <Text className="text-xs text-gray-400" numberOfLines={1}>
                                        {track.artist}
                                    </Text>
                                </View>
                                <Text className="text-xs text-gray-400">{track.duration}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Mini player */}
            <View className="absolute bottom-6 left-4 right-4 flex-row items-center rounded-2xl border border-[#333] bg-[#242424] p-3">
                <View
                    className="mr-3 h-12 w-12 rounded-lg"
                    style={{backgroundColor: current.color}}
                />
                <View className="flex-1">
                    <Text className="font-semibold text-white" numberOfLines={1}>
                        {current.title}
                    </Text>
                    <Text className="text-xs text-gray-400" numberOfLines={1}>
                        {current.artist}
                    </Text>
                </View>
                <Pressable
                    onPress={() => setPlaying((p) => !p)}
                    className="h-11 w-11 items-center justify-center rounded-full bg-[#ff5500] active:opacity-80"
                >
                    <Text className="text-base font-bold text-white">{playing ? '❚❚' : '▶'}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}