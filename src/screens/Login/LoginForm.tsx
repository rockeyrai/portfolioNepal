import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import LinearGradient from 'react-native-linear-gradient';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signInDirect } from '../../core/auth';
import { TokenType } from '../../redux/slices/authSlice';
import GoogleLogo from '../../assets/logo/google_logo.svg';
// import { center } from '@shopify/react-native-skia';
import { useThemeColors } from '../../utils/ColorTheme';
import { useNavigation } from '@react-navigation/native';
import api from '../../services';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, AuthStackParamList } from '../../navigation/types';

const schema = z.object({
  name: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;
export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

type RegisterRoute = NativeStackNavigationProp<AuthStackParamList, 'register'>;
// type HomeRoute = NativeStackNavigationProp<AppStackParamList, "Home">;
type PrivacyRoute = NativeStackNavigationProp<AuthStackParamList, 'privacy'>;

export const LoginForm = ({ onSubmit = () => {} }: any) => {
  const [accepted, setAccepted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useThemeColors();
  const routeRegister = useNavigation<RegisterRoute>();
  // const routeHome = useNavigation<HomeRoute>();
  const routePrivacy = useNavigation<PrivacyRoute>();

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        '287157141099-ku0egg9otts02ncu8d55bg7lau3aoor5.apps.googleusercontent.com',
      webClientId:
        '287157141099-3p136jb5eabfb89hf991pe6t6uo7ehes.apps.googleusercontent.com',
      profileImageSize: 150,
      offlineAccess: true,
    });
  }, []);

  const continueWithGoogle = async (data: any) => {
    try {
      const response = await api.post(`/auth/user/mobile-login`, data);
      return response;
    } catch (err: any) {
      console.error(
        'API Error (mobile-login):',
        err.response?.data || err.message,
      );
      return null;
    }
  };

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      const user = await GoogleSignin.signIn();

      const name = user?.data?.user?.name;
      const email = user?.data?.user?.email;

      if (!email) throw new Error('No email returned from Google Sign-In');

      const response: any = await continueWithGoogle({ name, email });

      if (
        !response?.data?.data?.accessToken ||
        !response?.data?.data?.user_id
      ) {
        console.error('Missing required data from API:', response?.data);
        return;
      }

      const { accessToken, user_id } = response.data.data;

      const token: TokenType = {
        access: accessToken,
        refresh: '',
        user_id: user_id?.toString(),
      };

      signInDirect(token);
      // routeHome.navigate('Home');
    } catch (e: any) {
      console.error('Sign-in Error:', e.message || e);
    }
  };

  const { width } = useWindowDimensions();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 10,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <LinearGradient
              colors={[
                'rgb(254, 219, 55)', // gold
                'white',
                'rgb(189, 161, 86)',
                'rgb(230, 190, 138)',
                'rgb(93, 74, 31)', // deep brown
              ]}
              style={{
                padding: 3, // border thickness
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 50,
                  padding: 4,
                }}
              >
                <Image
                  source={require('../../assets/logo/portfolio.png')}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </LinearGradient>
            {/* App Name & Description */}
            <View style={{ marginBottom: 30 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.text,
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                Portfolio Nepal
              </Text>
              <Text
                style={{
                  color: colors.secondaryText,
                  fontSize: 14,
                  lineHeight: 18,
                  textAlign: 'center',
                }}
              >
                Manage your finances effortlessly{'\n'}all in one place.
              </Text>
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: 20, width: '100%' }}>
              <TextInput
                placeholder="Email"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.card,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 16,
                }}
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 20, width: '100%' }}>
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.card,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 16,
                }}
              />
            </View>

            {/* Terms & Conditions */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                width: '100%',
              }}
            >
              <TouchableOpacity onPress={() => setAccepted(prev => !prev)}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor: accepted ? colors.primary : colors.border,
                    backgroundColor: accepted ? colors.primary : 'transparent',
                    marginRight: 10,
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {accepted && (
                    <View
                      style={{
                        width: 10,
                        height: 5,
                        borderBottomWidth: 2,
                        borderLeftWidth: 2,
                        borderColor: 'white',
                        transform: [{ rotate: '-45deg' }],
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <Text style={{ color: colors.secondaryText, fontSize: 14 }}>
                I accept the{' '}
                <Text
                  style={{
                    color: colors.accent,
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => routePrivacy.navigate('privacy')}
                >
                  Terms and Conditions
                </Text>
              </Text>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={signin}
              disabled={!accepted}
              style={{
                backgroundColor: accepted ? colors.primary : colors.border,
                paddingVertical: 12,
                borderRadius: 16,
                marginBottom: 12,
                width: '100%',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.icon,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              onPress={() => routeRegister.navigate('register')}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                paddingVertical: 12,
                borderRadius: 16,
                width: '100%',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Register
              </Text>
            </TouchableOpacity>

            <View
              style={{
                height: 1,
                backgroundColor: colors.secondBackground,
                width: '100%',
                marginVertical: 20,
              }}
            />

            {/* Google Sign In */}
            <TouchableOpacity
              onPress={signin}
              disabled={!accepted}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
                paddingVertical: 14,
                borderRadius: 50,
                justifyContent: 'center',
                gap: 10,
                width: '100%',
              }}
            >
              <GoogleLogo width={25} height={25} />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.secondaryText,
                }}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* {!accepted && (
          <Text
            style={{
              textAlign: "center",
              fontSize: 13,
              color: colors.negative,
              marginTop: 8,
            }}
          >
            Please accept the Terms and Conditions to continue.
          </Text>
        )} */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
