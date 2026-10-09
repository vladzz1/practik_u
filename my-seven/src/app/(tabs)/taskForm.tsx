import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TextInput, View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const url = 'https://webpd411.itstep.click/api/Tasks';

interface TaskFormData {
    title: string;
    description: string;
    statusId: number;
    priorityId: number;
    dueDate: string;
}

export default function TaskFormScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEditMode = !!id;

    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Ініціалізація React Hook Form
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<TaskFormData>({
        defaultValues: {
            title: '',
            description: '',
            statusId: 1,
            priorityId: 1,
            dueDate: ''
        }
    });

    const currentStatusId = watch('statusId');
    const currentPriorityId = watch('priorityId');

    useEffect(() => {
        if (!isEditMode) return;

        const fetchTaskDetails = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const response = await axios.get(`${url}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                const task = response.data;

                setValue('title', task.title);
                setValue('description', task.description || '');
                setValue('statusId', task.statusId);
                setValue('priorityId', task.priorityId);
                if (task.dueDate) {
                    setValue('dueDate', task.dueDate.split('T')[0]);
                }
            } catch (error) {
                console.error('Помилка завантаження задачі:', error);
                Alert.alert('Помилка', 'Не вдалося завантажити дані задачі.');
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchTaskDetails();
    }, [id, isEditMode, setValue]);

    const onSubmit = async (data: TaskFormData) => {
        setSubmitting(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const headers = { Authorization: `Bearer ${token}` };

            const payload = {
                title: data.title,
                description: data.description || null,
                statusId: data.statusId,
                priorityId: data.priorityId,
                dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
            };

            if (isEditMode) {
                await axios.put(`${url}/${id}`, { id: Number(id), ...payload }, { headers });
                Alert.alert('Успіх', 'Задачу успішно оновлено.');
            } else {
                await axios.post(url, payload, { headers });
                Alert.alert('Успіх', 'Задачу успішно створено.');
            }

            router.back();
        } catch (error) {
            console.error('Помилка збереження задачі:', error);
            Alert.alert('Помилка', 'Не вдалося зберегти задачу.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center">
                <ActivityIndicator size="large" color="#ff5500" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView 
                    className="flex-1" 
                    contentContainerClassName="px-6 py-10"
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-row items-center justify-between mb-8">
                        <Pressable onPress={() => router.back()} className="active:opacity-70">
                            <Text className="text-base text-gray-400">Назад</Text>
                        </Pressable>
                        <Text className="text-xl font-bold text-white">
                            {isEditMode ? 'Редагувати задачу' : 'Нова задача'}
                        </Text>
                        <View className="w-10" />
                    </View>

                    <View className="rounded-2xl bg-[#1c1c1c] p-5">

                        <View className="mb-5">
                            <Text className="mb-2 text-sm font-medium text-gray-300">
                                Назва задачі
                            </Text>
                            <Controller
                                control={control}
                                name="title"
                                rules={{ required: 'Назва задачі обовʼязкова' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="Введіть назву задачі"
                                        placeholderTextColor="#777"
                                        className="rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white focus:border-[#ff5500]"
                                    />
                                )}
                            />
                            {errors.title && (
                                <Text className="mt-1 text-xs text-red-500">{errors.title.message}</Text>
                            )}
                        </View>

                        <View className="mb-5">
                            <Text className="mb-2 text-sm font-medium text-gray-300">
                                Опис
                            </Text>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="Додайте опис (необов'язково)"
                                        placeholderTextColor="#777"
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                        className="rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white focus:border-[#ff5500] min-h-[100px]"
                                    />
                                )}
                            />
                        </View>

                        <View className="mb-5">
                            <Text className="mb-2 text-sm font-medium text-gray-300">
                                Пріоритет
                            </Text>
                            <View className="flex-row gap-2">
                                {[
                                    { id: 1, label: 'Низький', color: 'border-[#10b981]', bg: 'bg-[#10b981]' },
                                    { id: 2, label: 'Середній', color: 'border-[#f59e0b]', bg: 'bg-[#f59e0b]' },
                                    { id: 3, label: 'Високий', color: 'border-[#ef4444]', bg: 'bg-[#ef4444]' }
                                ].map((p) => {
                                    const isSelected = currentPriorityId === p.id;
                                    return (
                                        <Pressable
                                            key={p.id}
                                            onPress={() => setValue('priorityId', p.id)}
                                            className={`flex-1 items-center justify-center py-3 rounded-xl border-2 ${p.color} ${isSelected ? p.bg : 'bg-transparent'} active:opacity-80`}
                                        >
                                            <Text className={`text-sm font-semibold ${isSelected ? 'text-black' : 'text-white'}`}>
                                                {p.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="mb-2 text-sm font-medium text-gray-300">
                                Статус
                            </Text>
                            <View className="flex-row gap-2">
                                {[
                                    { id: 1, label: 'Нова' },
                                    { id: 2, label: 'В процесі' },
                                    { id: 3, label: 'Виконано' }
                                ].map((s) => {
                                    const isSelected = currentStatusId === s.id;
                                    return (
                                        <Pressable
                                            key={s.id}
                                            onPress={() => setValue('statusId', s.id)}
                                            className={`flex-1 items-center justify-center py-3 rounded-xl border border-[#333] ${
                                                isSelected ? 'bg-[#ff5500]' : 'bg-[#242424]'
                                            } active:opacity-80`}
                                        >
                                            <Text 
                                                className={`text-sm font-semibold ${
                                                    isSelected ? 'text-white' : 'text-gray-400'
                                                }`}
                                            >
                                                {s.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="mb-2 text-sm font-medium text-gray-300">
                                Дедлайн (РРРР-ММ-ДД)
                            </Text>
                            <Controller
                                control={control}
                                name="dueDate"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="Наприклад: 2026-10-25"
                                        placeholderTextColor="#777"
                                        className="rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white focus:border-[#ff5500]"
                                    />
                                )}
                            />
                        </View>

                        <Pressable
                            onPress={handleSubmit(onSubmit)}
                            disabled={submitting}
                            className="items-center rounded-xl bg-[#ff5500] py-4 active:opacity-80"
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text className="text-base font-bold text-white">
                                    {isEditMode ? 'Зберегти зміни' : 'Створити задачу'}
                                </Text>
                            )}
                        </Pressable>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}