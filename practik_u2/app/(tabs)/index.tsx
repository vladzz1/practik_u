import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import {ILoginType} from "@/types/login/ILoginType";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema} from "@/schemas/LoginSchema";

export default function HomeScreen() {
  const defaultValues : ILoginType = {
    email: "",
    password: ""
  }
  const {
    control,
    handleSubmit,
    // reset,
    formState: {errors},
  } = useForm<ILoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultValues,
  });

  const myOnSubmit = (data: ILoginType) => {
    console.log("Login user in Form", data);
  };

  return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="flex-grow justify-center px-6 py-10"
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <View className="mb-10 items-center">
                        <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-[#ff5500]">
                            <Text className="text-3xl font-bold text-white">
                                M
                            </Text>
                        </View>

                        <Text className="text-3xl font-bold text-white">
                            My Awesome App
                        </Text>

                        <Text className="mt-2 text-center text-sm text-gray-400">
                            Sign in to continue listening
                        </Text>
                    </View>

                    {/* Login / Register switch */}
                    <View className="mb-7 flex-row rounded-xl bg-[#242424] p-1">
                        <Pressable
                            onPress={() => console.log("To login")}
                            className={`flex-1 items-center rounded-lg py-3 bg-[#ff5500]`}
                        >
                            <Text
                                className={`font-semibold text-white`}
                            >
                                Login
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => console.log("To register")}
                            className={`flex-1 items-center rounded-lg py-3 bg-transparent`}
                        >
                            <Text
                                className={`font-semibold text-white`}
                            >
                                Register
                            </Text>
                        </Pressable>
                    </View>

                    {/* Form */}
                    <View className="rounded-2xl bg-[#1c1c1c] p-5">
                        {/* Email */}
                        <View className="mb-5">
                            <Text className="mb-2 text-sm font-medium text-gray-300">
                                Електронна пошта
                            </Text>

                          <Controller
                              control={control}
                              name="email"
                              render={({ field: { onChange, onBlur, value } }) => (
                                  <TextInput
                                      value={value}
                                      onChangeText={onChange}
                                      onBlur={onBlur}
                                      placeholder="Enter your email"
                                      placeholderTextColor="#777"
                                      keyboardType="email-address"
                                      autoCapitalize="none"
                                      className="rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white"
                                  />
                              )}
                          />
                          {errors.email && (
                              <Text className="mt-1 text-xs text-red-500">{errors.email.message}</Text>
                          )}
                        </View>

                        {/* Password */}
                        <View className="mb-6">
                            <Text className="mb-2 text-sm font-medium text-gray-300">
                                Пароль
                            </Text>

                          <Controller
                              control={control}
                              name="password"
                              render={({ field: { onChange, onBlur, value } }) => (
                                  <TextInput
                                      value={value}
                                      onChangeText={onChange}
                                      onBlur={onBlur}
                                      placeholder="Enter your password"
                                      placeholderTextColor="#777"
                                      secureTextEntry
                                      className="rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white"
                                  />
                              )}
                          />
                          {errors.password && (
                              <Text className="mt-1 text-xs text-red-500">{errors.password.message}</Text>
                          )}
                        </View>

                        <Pressable className="mb-6 self-end">
                            <Text className="text-sm font-medium text-[#ff5500]">
                                Відновити пароль?
                            </Text>
                        </Pressable>


                        {/* Submit */}
                        <Pressable
                            onPress={handleSubmit(myOnSubmit)}
                            className="items-center rounded-xl bg-[#ff5500] py-4 active:opacity-80"
                        >
                            <Text className="text-base font-bold text-white">
                                Sign In
                            </Text>
                        </Pressable>
                    </View>

                    {/* Bottom text */}
                    <View className="mt-7 flex-row justify-center">
                        <Text className="text-sm text-gray-400">
                            Don't have an account?
                        </Text>

                        <Pressable onPress={() => console.log("To register")}>
                            <Text className="text-sm font-bold text-[#ff5500]">
                                Register
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}