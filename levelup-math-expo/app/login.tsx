import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isLoginMode) {
        await signIn(email, password);
        Alert.alert('로그인 성공', '환영합니다!');
        router.replace('/(tabs)');
      } else {
        await signUp(email, password);
        Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('에러 발생', error.message || '인증에 실패했습니다.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      Alert.alert('구글 로그인', '구글 계정으로 로그인했습니다.');
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('구글 로그인 실패', error.message || '구글 연동에 실패했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-8 justify-center">
        <View className="mb-10 items-center">
          <View className="w-20 h-20 bg-primary-100 rounded-3xl items-center justify-center mb-6">
            <Text className="text-primary-main font-bold text-4xl">+-</Text>
          </View>
          <Text className="text-3xl font-extrabold text-gray-900 mb-2">레벨업 수학</Text>
          <Text className="text-gray-500 text-center text-base">
            {isLoginMode ? '다시 오신 것을 환영해요!' : '새로운 여정을 시작해볼까요?'}
          </Text>
        </View>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">이메일</Text>
            <TextInput
              className="bg-gray-50 rounded-2xl p-4 text-base border border-gray-100 placeholder:text-gray-400"
              placeholder="hello@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View className="mt-4">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">비밀번호</Text>
            <TextInput
              className="bg-gray-50 rounded-2xl p-4 text-base border border-gray-100 placeholder:text-gray-400"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          className="bg-primary-main py-4 rounded-2xl items-center shadow-sm mb-4"
          onPress={handleAuth}
        >
          <Text className="text-white font-bold text-lg">
            {isLoginMode ? '이메일로 로그인하기' : '이메일로 가입하기'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="px-4 text-gray-400 text-sm font-medium">또는</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <TouchableOpacity 
          className="bg-white border border-gray-200 py-4 rounded-2xl items-center shadow-sm flex-row justify-center mt-2"
          onPress={handleGoogleAuth}
        >
          {/* using text based logo symbol for simplicity or replace with SVG */}
          <Text className="text-gray-700 font-bold text-lg">
            Google 계정으로 계속하기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="mt-6 items-center"
          onPress={() => setIsLoginMode(!isLoginMode)}
        >
          <Text className="text-gray-500 font-medium">
            {isLoginMode ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
            <Text className="text-primary-main font-bold">
              {isLoginMode ? ' 회원가입' : ' 로그인'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
