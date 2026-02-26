import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Bell, Search, ArrowRight, BookOpen, Layers, Star, Clock } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRICULUM_HIERARCHY } from '../../lib/problemGenerators';
import { getStudyStats, StudyStats } from '../../lib/studyStorage';

export default function TopicsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { grade } = useLocalSearchParams();
  const selectedGrade = grade ? parseInt(grade as string) : 3;
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

  const currentUnits = CURRICULUM_HIERARCHY[selectedGrade] || [];

  // 단원 아이콘 결정 - 번역 키가 아닌 원본 키 기반으로 분류
  const getIconForUnit = (unitKey: string) => {
    // 번역된 텍스트로도 확인할 수 있도록 번역된 이름도 체크
    const translated = t(unitKey);
    if (translated.match(/덧셈|뺄셈|연산|Add|Sub|たし算|ひき算|곱셈|Mul|かけ算|나눗셈|Div|わり算|분수|Frac|分数|소수|Dec|小数|혼합|Mixed|混合|약수|배수|Factor|약분|통분|Simp|비례|Prop|비율|Ratio/i)) return <Layers color="#2563eb" size={24} />;
    if (translated.match(/도형|각도|삼각형|Angle|Triangle|Shape|Plane|図形|角度|三角形|넓이|Area|面積|부피|Volume|体積|원|Circle|円/i)) return <BookOpen color="#059669" size={24} />;
    if (translated.match(/시간|시각|Time|時/i)) return <Clock color="#9333ea" size={24} />;
    return <Star color="#eab308" size={24} />;
  };

  const getBgForUnit = (index: number) => {
    const colors = ['bg-blue-100', 'bg-emerald-100', 'bg-purple-100', 'bg-orange-100', 'bg-pink-100'];
    return colors[index % colors.length];
  };

  const handleNotImplemented = () => Alert.alert(t('common.notification_title'), t('common.notification_not_ready'));

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Top Banner */}
        <View className="bg-primary-main rounded-b-[40px] px-6 pt-16 pb-12 shadow-sm">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mr-3">
                <Text className="text-white font-bold text-xl">+-</Text>
              </View>
              <Text className="text-white text-xl font-bold tracking-tight">{t('topics.title')}</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center" onPress={handleNotImplemented}>
                <Bell size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white/20 rounded-2xl px-4 py-3">
            <Search size={20} color="rgba(255,255,255,0.7)" />
            <TextInput 
              placeholder={t('topics.search_placeholder')}
              placeholderTextColor="rgba(255,255,255,0.7)"
              className="flex-1 ml-3 text-white font-medium outline-none"
            />
          </View>
        </View>

        <View className="px-6 -mt-6">
          {/* Your Progress */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">{t('topics.progress_title')}</Text>
            <TouchableOpacity>
              <Text className="text-primary-main font-semibold">{t('common.all_view')}</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between mb-8">
            <View className="bg-orange-100 rounded-3xl p-5 w-[31%] h-32 justify-between border border-white">
              <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center">
                <Text className="text-white text-lg">⭐</Text>
              </View>
              <View>
                <Text className="text-gray-900 font-extrabold text-2xl">{stats ? stats.totalCorrect * 10 : 0}</Text>
                <Text className="text-gray-600 text-[10px] font-medium">{t('topics.collected_stars')}</Text>
              </View>
            </View>

            <View className="bg-emerald-100 rounded-3xl p-5 w-[31%] h-32 justify-between border border-white">
              <View className="w-8 h-8 bg-emerald-500 rounded-full items-center justify-center">
                <Text className="text-white text-lg">🏆</Text>
              </View>
              <View>
                <Text className="text-gray-900 font-extrabold text-xl">Lv {Math.floor((stats?.totalSessions || 0) / 3) + 1}</Text>
                <Text className="text-gray-600 text-[10px] font-medium">{t('topics.current_rank')}</Text>
              </View>
            </View>

            <View className="bg-purple-100 rounded-3xl p-5 w-[31%] h-32 justify-between border border-white">
              <View className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center">
                <Text className="text-white text-lg">⏱️</Text>
              </View>
              <View>
                <Text className="text-gray-900 font-extrabold text-xl">{stats ? stats.totalSessions * 5 : 0}m</Text>
                <Text className="text-gray-600 text-[10px] font-medium">{t('topics.study_time')}</Text>
              </View>
            </View>
          </View>

          {/* Choose a Topic */}
          <Text className="text-xl font-bold text-gray-800 mb-4">{t('topics.select_unit', { grade: selectedGrade })}</Text>
          
          <View className="pb-10">
            {currentUnits.map((unit, index) => (
              <View key={index} className="mb-6">
                 <Text className="text-lg font-bold text-gray-700 mb-3 ml-2">{t(unit.termUnit)}</Text>
                 {unit.topics.map((topic, topicIdx) => (
                    <TouchableOpacity 
                      key={topicIdx}
                      className="bg-white rounded-3xl p-4 flex-row items-center mb-3 border border-gray-100 shadow-sm"
                      onPress={() => router.push({
                        pathname: '/worksheet/[topic]',
                        params: { grade: selectedGrade, termUnit: unit.termUnit, topic: topic.name }
                      })}
                    >
                      <View className={`w-14 h-14 ${getBgForUnit(index + topicIdx)} rounded-2xl items-center justify-center mr-4`}>
                        {getIconForUnit(unit.termUnit)}
                      </View>
                      <View className="flex-1 pr-2">
                        <Text className="text-gray-800 font-bold text-base leading-snug">{t(topic.name)}</Text>
                      </View>
                      <View className="bg-primary-50 pl-4 py-2 pr-3 rounded-full flex-row items-center">
                        <Text className="text-primary-main font-bold mr-1">{t('topics.start')}</Text>
                        <ArrowRight size={16} color="#2db8ff" />
                      </View>
                    </TouchableOpacity>
                 ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
