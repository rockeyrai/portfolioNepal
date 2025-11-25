import React, { useEffect, useRef } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { LoginForm, LoginFormProps } from "./LoginForm";

type LoginScreenProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenProp>();
  const renderCount = useRef(0);
  useEffect(() => {
    console.log('Loginpage mounted');
    return () => console.log('Loginpage unmounted');
  }, []);
  renderCount.current += 1;

  console.log(`Loginpage rendered ${renderCount.current} times`);


  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          AsyncStorage.getItem("FistLoginIn").then((val) => {
            if (val === "true") {
              BackHandler.exitApp();
            } else {
              navigation.goBack(); 
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

    // After login, navigate to App stack inside RootStack
    navigation.getParent()?.navigate("App");
  };

  return <LoginForm onSubmit={onSubmit} />;
};

export default LoginScreen;
