import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {SafeAreaView} from 'react-native-safe-area-context';
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterSchema} from "@/schemas/RegisterSchema";
import {IRegister} from "@/types/register/IRegister";
import {router} from "expo-router";
import * as ImagePicker from "expo-image-picker"
import {ImagePickerButton} from "@/components/form/ImagePickerButton";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function RegisterScreen() {
  const defaultValues: IRegister = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    // reset,
    formState: {errors},
  } = useForm<IRegister>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: defaultValues,
  });

  const image = watch("imageFile");

  const pickImage = async () => {
    // console.log("Pick image");
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Доступ до галереї потрібен для вибору фото.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      setValue("imageFile", {
        uri: asset.uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      });
    }
  }

  const url = "https://webpd411.itstep.click/api/account/register";

  const myOnSubmit = async (data: IRegister) => {
    //console.log("Register user in Form", data);
    try {
      const formData = new FormData();
      
      formData.append('FirstName', data.firstName);
      formData.append('LastName', data.lastName);
      formData.append('Email', data.email);
      formData.append('Password', data.password);
      formData.append('ConfirmPassword', data.confirmPassword);
      if (data.imageFile) {
        formData.append('ImageFile', {
            uri: data.imageFile.uri,
            name: data.imageFile.name || 'avatar.jpg',
            type: data.imageFile.type || 'image/jpeg'
        } as any);
      }

      const result = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const token = result.data.token;
      if (token) {
        await SecureStore.setItemAsync('userToken',  result.data.token);
        router.replace("/home")
      }
      //console.log("Login user in Form", result);
    } catch (e) {
      console.log("Register request error", e);
    }
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
                  onPress={() => router.replace("/login")}
                  className={`flex-1 items-center rounded-lg py-3 bg-transparent`}
              >
                <Text
                    className={`font-semibold text-white`}
                >
                  Login
                </Text>
              </Pressable>

              <Pressable
                  onPress={() => console.log("To Register")}
                  className={`flex-1 items-center rounded-lg py-3 bg-[#ff5500]`}
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

              <View className="items-center my-6">
                <ImagePickerButton
                    imageUri={image?.uri ?? null}
                    onPress={pickImage}
                />
                <Text className="text-zinc-400 dark:text-zinc-300 mt-2">
                  Натисніть, щоб обрати фото
                </Text>
              </View>

              {/* LastName */}
              <View className="mb-5">
                <Text className="mb-2 text-sm font-medium text-gray-300">
                  Прізвище
                </Text>

                <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Enter your LastName"
                            placeholderTextColor="#777"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white"
                        />
                    )}
                />
                {errors.lastName && (
                    <Text className="mt-1 text-xs text-red-500">{errors.lastName.message}</Text>
                )}
              </View>

              {/* FirstName */}
              <View className="mb-5">
                <Text className="mb-2 text-sm font-medium text-gray-300">
                  Ім'я
                </Text>

                <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Enter your FirstName"
                            placeholderTextColor="#777"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white"
                        />
                    )}
                />
                {errors.firstName && (
                    <Text className="mt-1 text-xs text-red-500">{errors.firstName.message}</Text>
                )}
              </View>

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

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className="mb-2 text-sm font-medium text-gray-300">
                  Підтвердіть пароль
                </Text>

                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Enter your confirmPassword"
                            placeholderTextColor="#777"
                            secureTextEntry
                            className="rounded-xl border border-[#333] bg-[#242424] px-4 py-4 text-base text-white"
                        />
                    )}
                />
                {errors.confirmPassword && (
                    <Text className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</Text>
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
                Do you already have an account?
              </Text>

              <Pressable onPress={() => router.replace("/login")}>
                <Text className="text-sm font-bold text-[#ff5500]">
                  Login
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}