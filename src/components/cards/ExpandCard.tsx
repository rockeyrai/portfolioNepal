import { ChevronDown, LogOut, Plus } from "lucide-react-native";
import React, { useRef, useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  Pressable,
  Animated,
  Platform,
  UIManager,
  LayoutChangeEvent,
  Easing,
} from "react-native";
import { useDispatch } from "react-redux";
import { useThemeColors } from "../../utils/ColorTheme";
import { AppDispatch } from "../../redux/store";
import { signOutDirect } from "../../core/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type LoginRoute = NativeStackNavigationProp<AuthStackParamList, 'Login'>;


const ExpandCard = () => {
  const { colors } = useThemeColors();
  const otheraccount = [1, 2];

  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const [contentHeight, setContentHeight] = useState(0);
  const [buttonHeight, setButtonHeight] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const routerLogin = useNavigation<LoginRoute>();

  const handleLogout = async () => {
    await dispatch(signOutDirect());
    routerLogin.navigate("Login");
  };
  const toggleExpand = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: willOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(heightAnim, {
        toValue: willOpen ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(borderAnim, {
        toValue: willOpen ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  };

  const onButtonLayout = (e: LayoutChangeEvent) => {
    setButtonHeight(e.nativeEvent.layout.height);
  };

  const onContentLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h !== contentHeight && h > 0) {
      setContentHeight(h);
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const borderRadiusInterpolate = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [buttonHeight / 2 || 25, 25],
  });

  // Use maxHeight instead of height for better mobile compatibility
  const maxHeightInterpolate = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight || 500], // fallback to 500 if contentHeight not measured yet
  });

  return (
    <View style={{ padding: 16 }}>
      <Animated.View
        // className="space-y-2"
        style={{
          borderRadius: borderRadiusInterpolate,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Pressable
          onLayout={onButtonLayout}
          onPress={toggleExpand}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: colors.background,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {isOpen ? "Hide accounts" : "Switch accounts"}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {!isOpen && (
              <Image
                source={require("../../assets/logo/portfolio.png")}
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: colors.secondBackground,
                }}
              />
            )}
            <Animated.View
              style={{ transform: [{ rotate: rotateInterpolate }] }}
            >
              <ChevronDown size={20} color={colors.text} />
            </Animated.View>
          </View>
        </Pressable>

        {/* Expandable Content */}
        <Animated.View
          style={{
            maxHeight: maxHeightInterpolate,
            overflow: "hidden",
          }}
        >
          <View onLayout={onContentLayout} style={{ gap: 2, marginTop: 2 }}>
            {otheraccount.map((_, index) => (
              <Pressable
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  backgroundColor: colors.background,
                  borderTopColor: colors.border || "rgba(0,0,0,0.1)",
                }}
              >
                <Image
                  source={require("../../assets/logo/portfolio.png")}
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 9999,
                    borderWidth: 1,
                    borderColor: colors.secondBackground,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      fontWeight: "500",
                      lineHeight: 14,
                    }}
                  >
                    Rockey Rai
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 12,
                      opacity: 0.7,
                      lineHeight: 12,
                    }}
                  >
                    rockeyraio234@gmail.com
                  </Text>
                </View>
              </Pressable>
            ))}

            {/* Add Account */}
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 10,
                backgroundColor: colors.background,
                borderTopColor: colors.border || "rgba(0,0,0,0.1)",
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 9999,
                  backgroundColor: colors.secondaryText || "#007AFF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={20} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Add another account
              </Text>
            </Pressable>

            {/* Sign Out */}
            <Pressable
            onPress={handleLogout}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: colors.background,
                borderTopColor: colors.border || "rgba(0,0,0,0.1)",
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 9999,
                  backgroundColor: "#FF3B30",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LogOut size={20} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  color: "#FF3B30",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Sign out
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default ExpandCard;