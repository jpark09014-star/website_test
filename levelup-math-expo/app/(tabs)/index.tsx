import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Settings, Play, Bell, Globe } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { getStudyStats, StudyStats } from '../../lib/studyStorage';
import AdBanner from '../../components/AdBanner';

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<StudyStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchStats = async () => {
        const data = await getStudyStats();
        if (isActive) setStats(data);
      };
      fetchStats();
      return () => { isActive = false; };
    }, [])
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return t('home.night');
    if (hour < 12) return t('home.morning');
    if (hour < 18) return t('home.afternoon');
    if (hour < 22) return t('home.evening');
    return t('home.night');
  };

  const displayName = user?.email?.split('@')[0] || t('home.student');
  const problemsSolvedToday = stats ? stats.totalProblems : 0; // 임시: 전체 풀이 수
  const goal = 10;
  const progressPercent = Math.min(Math.round((problemsSolvedToday / goal) * 100), 100);

  const grades = [
    { id: 1, name: t('home.grade_1'), desc: t('home.grade_1_desc'), color: 'bg-red-50', text: 'text-red-500', iconBg: 'bg-red-400' },
    { id: 2, name: t('home.grade_2'), desc: t('home.grade_2_desc'), color: 'bg-orange-50', text: 'text-orange-500', iconBg: 'bg-orange-400' },
    { id: 3, name: t('home.grade_3'), desc: t('home.grade_3_desc'), color: 'bg-green-50', text: 'text-green-500', iconBg: 'bg-green-400' },
    { id: 4, name: t('home.grade_4'), desc: t('home.grade_4_desc'), color: 'bg-purple-50', text: 'text-purple-500', iconBg: 'bg-purple-400' },
    { id: 5, name: t('home.grade_5'), desc: t('home.grade_5_desc'), color: 'bg-blue-50', text: 'text-blue-500', iconBg: 'bg-blue-400' },
    { id: 6, name: t('home.grade_6'), desc: t('home.grade_6_desc'), color: 'bg-teal-50', text: 'text-teal-500', iconBg: 'bg-teal-400' },
  ];

  const handleNotImplemented = () => Alert.alert(t('common.coming_soon_title'), t('common.coming_soon_msg'));

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    if (currentLang.startsWith('ko')) i18n.changeLanguage('en');
    else if (currentLang.startsWith('en')) i18n.changeLanguage('ja');
    else i18n.changeLanguage('ko');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View className="bg-primary-main rounded-b-[40px] px-6 pt-16 pb-12 shadow-sm">
        <View className="flex-row justify-between items-center mb-8">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mr-3">
              <Text className="text-white font-bold text-xl">+-</Text>
            </View>
            <Text className="text-white text-xl font-bold tracking-tight">{t('home.grade_select')}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              onPress={toggleLanguage}
            >
              <Globe size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              onPress={handleNotImplemented}
            >
              <Bell size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              onPress={() => {
                Alert.alert(t('common.logout'), t('common.logout_confirm'), [
                  { text: t('common.cancel'), style: 'cancel' },
                  { text: t('common.logout'), style: 'destructive', onPress: signOut }
                ]);
              }}
            >
              <Settings size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="text-white/80 text-lg mb-1">{getGreeting()}</Text>
          <Text className="text-white text-3xl font-extrabold tracking-tight">{displayName} {t('home.user_suffix')}</Text>
        </View>
      </View>

      <View className="px-6 -mt-8">
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-8 border border-gray-100">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <View className="bg-yellow-100 self-start px-3 py-1 rounded-full mb-3">
                <Text className="text-yellow-700 text-xs font-bold uppercase tracking-wider">{t('home.daily_goal')}</Text>
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-1">{goal}{t('home.problems_solved')}</Text>
              <Text className="text-gray-500">{t('home.solved_total', { count: problemsSolvedToday })}</Text>
            </View>
            {/* Circular Progress Placeholder */}
            <View className="w-16 h-16 rounded-full border-4 border-gray-100 items-center justify-center relative">
              {/* Fake progress arc */}
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-full" />
              <Text className="text-sm font-bold text-yellow-500">{progressPercent}%</Text>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-primary-main py-4 rounded-2xl flex-row justify-center items-center gap-2"
            onPress={() => router.push({ pathname: '/topics', params: { grade: grades[0].id } })}
          >
            <Play fill="white" size={16} color="white" />
            <Text className="text-white font-bold text-base">{t('topics.start')}</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">{t('home.grade_select')}</Text>
          <TouchableOpacity onPress={handleNotImplemented}>
            <Text className="text-primary-main font-semibold">{t('common.all_view')}</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {grades.map((grade) => (
            <TouchableOpacity 
              key={grade.id} 
              className={`w-[48%] ${grade.color} rounded-3xl p-5 mb-4 border border-white/50`}
              onPress={() => router.push({ pathname: '/topics', params: { grade: grade.id } })}
            >
              <View className={`w-8 h-8 ${grade.iconBg} rounded-lg items-center justify-center mb-3`}>
                <Text className="text-white font-bold text-sm">{grade.id}</Text>
              </View>
              <Text className="text-gray-800 font-bold text-lg mb-1">{grade.name}</Text>
              <Text className="text-gray-500 text-xs">{grade.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-xl font-bold text-gray-800 mt-2 mb-4">{t('home.study_summary')}</Text>
        <View className="flex-row justify-between pb-8">
          <View className="bg-white rounded-3xl p-4 items-center w-[30%] shadow-sm border border-gray-100">
            <View className="w-12 h-12 rounded-full bg-yellow-100 items-center justify-center mb-2">
              <Text className="text-xl">🔥</Text>
            </View>
            <Text className="text-gray-800 font-bold text-xs text-center mb-1">{t('home.days_unit', { count: stats?.streakDays || 0 })}</Text>
            <Text className="text-gray-400 text-[10px] text-center">{t('home.streak')}</Text>
          </View>
          <View className="bg-white rounded-3xl p-4 items-center w-[30%] shadow-sm border border-gray-100">
            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
              <Text className="text-xl">🎯</Text>
            </View>
            <Text className="text-gray-800 font-bold text-xs text-center mb-1">{stats?.accuracy || 0}%</Text>
            <Text className="text-gray-400 text-[10px] text-center">{t('home.accuracy')}</Text>
          </View>
          <View className="bg-white rounded-3xl p-4 items-center w-[30%] shadow-sm border border-gray-100">
            <View className="w-12 h-12 rounded-full bg-pink-100 items-center justify-center mb-2">
              <Text className="text-xl">📝</Text>
            </View>
            <Text className="text-gray-800 font-bold text-xs text-center mb-1">{t('home.sessions_unit', { count: stats?.totalSessions || 0 })}</Text>
            <Text className="text-gray-400 text-[10px] text-center">{t('home.sessions_done')}</Text>
          </View>
        </View>

        {/* 배너 광고 (학습 요약 카드 하단) */}
        <AdBanner />

      </View>
    </ScrollView>
  );
}

