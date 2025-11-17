import React from "react";
import { BackHandler } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { LoginForm, LoginFormProps } from "./LoginForm";

type LoginScreenProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenProp>();

  // Handle hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          AsyncStorage.getItem("FistLoginIn").then((val) => {
            if (val === "true") {
              BackHandler.exitApp();
            } else {
              navigation.navigate("Login"); // navigate to Login screen in stack
            }
          });
          return true;
        }
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  const onSubmit: LoginFormProps["onSubmit"] = async (data) => {
    await AsyncStorage.setItem("FistLoginIn", "true");
    // Navigate to your app stack after login
    // Example:
    // navigation.replace("App"); // if you have a RootStack with App stack
  };

  return <LoginForm onSubmit={onSubmit} />;
};

export default LoginScreen;
