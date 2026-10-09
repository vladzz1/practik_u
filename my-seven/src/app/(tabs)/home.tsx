import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface TaskModel {
    id: number;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string | null;
    dueDate: string | null;
    completedAt: string | null;
    statusId: number;
    status: string;
    priorityId: number;
    priority: string;
}

const url = 'https://webpd411.itstep.click/api/Tasks';

const DONE_STATUS_ID = 3;

const priorityColors: Record<number, string> = {
    1: '#10b981', // низький
    2: '#f59e0b', // середній
    3: '#ef4444', // високий
};

const statusColors: Record<number, string> = {
    1: '#3b82f6',
    2: '#f59e0b',
    3: '#10b981',
};

const formatDate = (value?: string | null) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toLocaleDateString('uk-UA');
};

export default function TasksScreen() {
    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [image, setImage] = useState<String>("");

    const fetchTasks = useCallback(async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');

            if (!token) {
                router.replace('/login');
                return;
            }

            const response = await axios.get<TaskModel[]>(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const response_image = await axios.get("https://webpd411.itstep.click/api/account/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setImage(response_image.data.image)

            setTasks(response.data);
        } catch (error: any) {
            console.error('Помилка завантаження задач:', error);

            if (error.response?.status === 401) {
                await SecureStore.deleteItemAsync('userToken');
                router.replace('/login');
            } else {
                Alert.alert('Помилка', 'Не вдалося завантажити список задач.');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTasks();
    };

    const handleCreateTask = () => {
        router.push('/taskForm'); 
    };

    const handleEditTask = (task: TaskModel) => {
        router.push({
            pathname: '/taskForm',
            params: { id: task.id }
        });
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center">
                <ActivityIndicator size="large" color="#ff5500" />
            </SafeAreaView>
        );
    }

    const isDone = (t: TaskModel) => t.statusId === DONE_STATUS_ID || !!t.completedAt;
    const isOverdue = (t: TaskModel) => !isDone(t) && !!t.dueDate && new Date(t.dueDate).getTime() < Date.now();

    const doneCount = tasks.filter(isDone).length;

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <ScrollView
                className="flex-1"
                contentContainerClassName="px-6 py-10 pb-28"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#ff5500"
                    />
                }
            >
                <View className="flex-row items-center justify-between mb-8">
                    <View>
                        <Text className="text-2xl font-bold text-white mb-2">Мої задачі</Text>
                        <Text className="text-sm text-gray-400">
                            Виконано {doneCount} з {tasks.length}
                        </Text>
                    </View>
                            
                    <TouchableOpacity
                        onPress={() => router.push('/profile')}
                        activeOpacity={0.8}
                        className="h-12 w-12 items-center justify-center rounded-full bg-[#ff5500] border border-[#333] mr-16 overflow-hidden"
                    >
                        
                        {image ? (
                            <Image 
                                source={{ uri: `https://webpd411.itstep.click/images/${image}_432.webp` }}
                                className="h-full w-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <Text className="text-lg font-bold text-white">
                                U
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {tasks.length === 0 ? (
                    <View className="rounded-2xl bg-[#1c1c1c] p-6 border border-[#242424] items-center">
                        <Text className="text-base font-semibold text-white mb-1">
                            Задач поки немає
                        </Text>
                        <Text className="text-sm text-gray-400 text-center">
                            Потягніть вниз, щоб оновити список.
                        </Text>
                    </View>
                ) : (
                    tasks.map((task) => {
                        const done = isDone(task);
                        const overdue = isOverdue(task);
                        const due = formatDate(task.dueDate);
                        const completed = formatDate(task.completedAt);
                        const priorityColor = priorityColors[task.priorityId] ?? '#777';
                        const statusColor = statusColors[task.statusId] ?? '#777';

                        return (
                            <View
                                key={task.id}
                                className="mb-4 rounded-2xl bg-[#1c1c1c] p-4 border border-[#242424]"
                            >
                                <View className="flex-row justify-between items-start">

                                    <View className="flex-row flex-1 pr-3">
                                        <View
                                            className={`mr-4 mt-0.5 h-6 w-6 items-center justify-center rounded-full border-2 ${
                                                done ? 'bg-[#ff5500] border-[#ff5500]' : 'border-[#333]'
                                            }`}
                                        >
                                            {done && (
                                                <Text className="text-xs font-bold text-white">✓</Text>
                                            )}
                                        </View>
                                        
                                        <View className="flex-1">
                                            <Text
                                                className={`text-base font-semibold ${
                                                    done ? 'text-gray-500 line-through' : 'text-white'
                                                }`}
                                            >
                                                {task.title}
                                            </Text>
                                            
                                            {!!task.description && (
                                                <Text className="mt-1 text-sm text-gray-400">
                                                    {task.description}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                        
                                    <View>
                                        <TouchableOpacity 
                                            onPress={() => handleEditTask(task)}
                                            className="rounded-lg bg-[#242424] px-3 py-1.5 active:bg-[#333]"
                                        >
                                            <Text className="text-xs font-medium text-gray-300">Змінити</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                        
                                <View className="mt-4 flex-row flex-wrap items-center justify-between gap-2">
                                    <View className="flex-row flex-wrap items-center gap-2">
                                        <View
                                            className="rounded-full px-3 py-1"
                                            style={{ backgroundColor: statusColor + '26' }}
                                        >
                                            <Text
                                                className="text-xs font-semibold"
                                                style={{ color: statusColor }}
                                            >
                                                {task.status}
                                            </Text>
                                        </View>
                                        
                                        <View
                                            className="rounded-full px-3 py-1"
                                            style={{ backgroundColor: priorityColor + '26' }}
                                        >
                                            <Text
                                                className="text-xs font-semibold"
                                                style={{ color: priorityColor }}
                                            >
                                                {task.priority}
                                            </Text>
                                        </View>
                                    </View>
                                        
                                    {done && completed ? (
                                        <Text className="text-xs text-gray-500">
                                            Завершено {completed}
                                        </Text>
                                    ) : due ? (
                                        <Text
                                            className={`text-xs ${
                                                overdue ? 'text-red-500' : 'text-gray-500'
                                            }`}
                                        >
                                            {overdue ? 'Прострочено · ' : 'До '}
                                            {due}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
            <TouchableOpacity
                onPress={handleCreateTask}
                activeOpacity={0.85}
                className="absolute bottom-20 right-6 h-14 w-14 items-center justify-center rounded-full bg-[#ff5500] shadow-lg elevation-5"
            >
                <Text className="mb-1 text-3xl font-light text-white">+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}