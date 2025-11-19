import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
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



export const LoginForm = ({ onSubmit = () => {} }: any) => {

  const { colors } = useThemeColors();

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
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Ensure clean session
    await GoogleSignin.revokeAccess().catch(() => {});
    await GoogleSignin.signOut().catch(() => {});
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

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
