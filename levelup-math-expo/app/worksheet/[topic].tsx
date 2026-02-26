import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MoreVertical, Check, X } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { generateProblems, Problem, Language } from '../../lib/problemGenerators';
import { saveStudyRecord, saveWrongNotes } from '../../lib/studyStorage';
import { useTranslation } from 'react-i18next';
import ShapeRenderer, { ShapeVisual } from '../../components/ShapeRenderer';

export default function WorksheetScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  
  const grade = parseInt(params.grade as string) || 3;
  const termUnit = (params.termUnit as string) || '1학기 1단원 덧셈과 뺄셈';
  const topic = (params.topic as string) || '세 자리 수의 덧셈';

  const [problems, setProblems] = useState<Problem[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [graded, setGraded] = useState(false);
  const [score, setScore] = useState(0);

  const initProblems = useCallback(() => {
    setLoading(true);
    setGraded(false);
    setAnswers({});
    setShowAnswers(false);
    setTimeout(() => {
      const generated = generateProblems(grade, termUnit, topic, 20, 'normal', i18n.language as Language);
      setProblems(generated);
      setLoading(false);
    }, 500);
  }, [grade, termUnit, topic, i18n.language]);

  useEffect(() => {
    initProblems();
  }, [initProblems]);

  const handleGrade = async () => {
    let correctCount = 0;
    const wrongProblems: Problem[] = [];

    problems.forEach((p, i) => {
      const userAnswer = (answers[i] || '').trim().replace(/\s/g, '');
      const correctAnswer = p.answer.trim().replace(/\s/g, '');
      if (userAnswer === correctAnswer) {
        correctCount++;
      } else {
        wrongProblems.push(p);
      }
    });

    const currentScore = Math.round((correctCount / problems.length) * 100);
    setScore(currentScore);
    setGraded(true);

    await saveStudyRecord(grade, topic, 'normal', problems.length, correctCount);
    if (wrongProblems.length > 0) {
      await saveWrongNotes(grade, topic, wrongProblems);
    }

    if (currentScore <= 80) {
      Alert.alert(
        t('common.keep_going'),
        `${t('common.score', { score: currentScore })}\n${t('common.keep_going_desc', { defaultValue: '80점 이하면 재시험을 추천해요. 다시 풀어볼까요?' })}`,
        [
          { text: t('common.later', { defaultValue: '다음에 하기' }), onPress: () => router.push('/(tabs)'), style: 'cancel' },
          { text: t('common.redo'), onPress: initProblems }
        ]
      );
    } else {
      Alert.alert(
        t('common.perfect'),
        `${t('common.score', { score: currentScore })}\n${t('common.perfect_desc', { defaultValue: '훌륭해요! 학습 결과가 성공적으로 저장되었습니다.' })}`,
        [{ text: t('common.confirm', { defaultValue: '확인' }), onPress: () => router.push('/(tabs)') }]
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2db8ff" />
        <Text className="mt-4 text-gray-500 font-bold">{t('common.grading')}</Text>
      </View>
    );
  }

  /**
   * [왜 KaTeX를 제거했는가]
   * react-native-katex는 내부적으로 WebView를 사용하므로
   * ScrollView 안에서 높이가 0으로 잡히거나 레이아웃이 완전히 깨집니다.
   * 순수 React Native의 Text/View 조합으로 분수를 렌더링합니다.
   */

  // 분수 하나를 상하 형태로 렌더링 (예: 3/4 → ³⁄₄ 상하)
  // 색상 클래스를 파라미터로 받아 정답 표시용으로도 사용
  const renderFraction = (num: string, den: string, color = 'text-gray-800') => (
    <View className="items-center justify-center mx-0.5">
      <Text className={`${color} font-bold text-sm leading-tight px-0.5`}>{num}</Text>
      <View className="h-[1.5px] bg-gray-800 w-full my-[1px]" />
      <Text className={`${color} font-bold text-sm leading-tight px-0.5`}>{den}</Text>
    </View>
  );

  // 수식 문자열을 파싱하여 React Native 컴포넌트 배열로 변환
  // "3/4 + 1/2" → [분수(3,4), Text("+"), 분수(1,2)]
  const renderMathExpression = (expr: string, color = 'text-gray-800', fontSize = 'text-xl') => {
    // 토큰화: 분수(숫자/숫자), 연산자, 일반 텍스트로 분리
    const tokens: React.ReactNode[] = [];
    // "과"를 포함한 대분수 처리 (예: "1과 2/3")
    const regex = /(\d+)과\s*(\d+)\/(\d+)|(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)|([^/\d]+|\d+)/g;
    let match;
    let idx = 0;

    while ((match = regex.exec(expr)) !== null) {
      if (match[1] !== undefined && match[2] !== undefined && match[3] !== undefined) {
        // "N과 M/D" 형태 대분수
        tokens.push(
          <View key={idx} className="flex-row items-center">
            <Text className={`${color} font-extrabold ${fontSize}`}>{match[1]}</Text>
            {renderFraction(match[2], match[3], color)}
          </View>
        );
      } else if (match[4] !== undefined && match[5] !== undefined && match[6] !== undefined) {
        // "N M/D" 형태 대분수
        tokens.push(
          <View key={idx} className="flex-row items-center">
            <Text className={`${color} font-extrabold ${fontSize}`}>{match[4]}</Text>
            {renderFraction(match[5], match[6], color)}
          </View>
        );
      } else if (match[7] !== undefined && match[8] !== undefined) {
        // 진분수/가분수
        tokens.push(
          <View key={idx}>{renderFraction(match[7], match[8], color)}</View>
        );
      } else if (match[9] !== undefined) {
        // 일반 텍스트 (숫자, 연산자 등)
        const text = match[9].trim();
        if (text) {
          tokens.push(
            <Text key={idx} className={`${color} font-extrabold ${fontSize}`}> {text} </Text>
          );
        }
      }
      idx++;
    }

    return <View className="flex-row items-center flex-wrap">{tokens}</View>;
  };

  // 문제 텍스트에서 구분자(= 또는 → 약) 앞부분만 추출
  const getSeparator = (question: string) => {
    if (question.includes('→ 약')) return '→ 약';
    if (question.includes('=')) return '=';
    return '=';
  };

  const getCleanQuestion = (question: string) => {
    if (question.includes('→ 약')) return question.split('→ 약')[0].trim();
    if (question.includes('=')) return question.split('=')[0].trim();
    return question.trim();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-4 flex-row justify-between items-center border-b border-gray-100 shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -m-2">
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 line-clamp-1 flex-1 text-center px-4" numberOfLines={1}>
          {t(topic)}
        </Text>
        <TouchableOpacity className="p-2 -m-2">
          <MoreVertical size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Toggle & Title */}
        <View className="px-6 py-6 pb-2">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-gray-600 font-semibold text-sm">{t('common.answer_toggle')}</Text>
            <Switch
              value={showAnswers}
              onValueChange={setShowAnswers}
              trackColor={{ false: '#e5e7eb', true: '#2db8ff' }}
              thumbColor={'#ffffff'}
            />
          </View>
          <View className="flex-row justify-between items-end mb-1 mt-2">
            <Text className="text-2xl font-extrabold text-gray-900 flex-1 pr-4">{t(termUnit)}</Text>
            {graded && (
              <Text className={`text-2xl font-black ${score >= 80 ? 'text-success-main' : 'text-red-500'}`}>
                {t('common.score', { score: score })}
              </Text>
            )}
          </View>
          <Text className="text-gray-500 text-sm">{t('common.instruction_default')}</Text>
        </View>

        {/* Problems List */}
        <View className="px-6 pt-4">
          {problems.map((prob, index) => {
            const isWordProblem = prob.instruction?.includes('문장제') || prob.question.length > 20;
            
            return (
              <View key={index} className="mb-6">
                <View className={`bg-white rounded-3xl p-5 border shadow-sm ${graded && !(answers[index]?.trim().replace(/\s/g, '') === prob.answer.trim().replace(/\s/g, '')) ? 'border-red-200 bg-red-50/10' : 'border-gray-100'}`}>
                  <View className="flex-row">
                    {/* Number Badge */}
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 shrink-0 ${graded ? (answers[index]?.trim().replace(/\s/g, '') === prob.answer.trim().replace(/\s/g, '') ? 'bg-green-100' : 'bg-red-100') : 'bg-blue-50'}`}>
                      {graded ? (
                        answers[index]?.trim().replace(/\s/g, '') === prob.answer.trim().replace(/\s/g, '') ? 
                          <Check size={20} color="#16a34a" /> : <X size={20} color="#dc2626" />
                      ) : (
                        <Text className="text-primary-main font-bold text-base">{index + 1}</Text>
                      )}
                    </View>
                    
                    <View className="flex-1">
                      {/* Top Label */}
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">{prob.instruction}</Text>
                        <View className="px-2 py-0.5 rounded-full border bg-blue-50 text-blue-600 border-blue-200">
                          <Text className="text-[10px] font-bold text-blue-600">{t('common.difficulty_normal', { defaultValue: '보통' })}</Text>
                        </View>
                      </View>

                      {/* Problem Content */}
                      <View className="flex-row items-center flex-wrap gap-x-2">
                        {isWordProblem || prob.visual?.type === 'shape' || prob.visual?.type === 'fraction' || prob.visual?.type === 'grouping' ? (
                          <View className="w-full">
                            <Text className="text-gray-800 text-base leading-relaxed mb-4">
                              {prob.question}
                            </Text>

                            {(prob.visual?.type === 'shape' || prob.visual?.type === 'fraction' || prob.visual?.type === 'grouping') && (
                              <View className="w-full h-auto bg-gray-50 rounded-2xl items-center justify-center mb-4 py-4">
                                <ShapeRenderer visual={prob.visual as any} />
                              </View>
                            )}
                            
                            {showAnswers || graded ? (
                              <View className="items-end w-full">
                                <Text className="text-success-main font-bold text-lg bg-success-light px-4 py-2 rounded-xl border border-success-main/20">
                                  {t('common.answer_label')}: {prob.answer}
                                </Text>
                              </View>
                            ) : (
                              <View className="items-end w-full">
                                <TextInput
                                  className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full h-12 text-gray-900 font-bold items-center bg-gray-50/50"
                                  placeholder={t('common.placeholder_answer')}
                                  value={answers[index] || ''}
                                  onChangeText={(text) => setAnswers(prev => ({ ...prev, [index]: text }))}
                                  keyboardType={prob.answer.includes('/') || prob.answer.match(/[a-zA-Z]/) ? "default" : "numeric"}
                                />
                              </View>
                            )}
                          </View>
                        ) : (
                          /* Equation Style Problem */
                          <View className="w-full flex-row items-center flex-wrap">
                            <View className="mr-1">
                              {renderMathExpression(getCleanQuestion(prob.question))}
                            </View>
                            <Text className="text-gray-400 font-extrabold text-2xl mx-1">
                              {getSeparator(prob.question)}
                            </Text>
                            
                            {showAnswers || graded ? (
                              <View className="ml-1 bg-success-light px-3 py-1.5 rounded-xl border border-success-main/20">
                                {renderMathExpression(prob.answer, 'text-success-main', 'text-lg')}
                              </View>
                            ) : (
                              <TextInput
                                className="ml-1 border-2 border-gray-200 rounded-xl px-4 py-2 min-w-[80px] h-11 text-center text-gray-900 font-extrabold text-lg bg-gray-50/50"
                                placeholder="..."
                                value={answers[index] || ''}
                                onChangeText={(text) => setAnswers(prev => ({ ...prev, [index]: text }))}
                                keyboardType={prob.answer.includes('/') || prob.answer.match(/[a-zA-Z]/) ? "default" : "numeric"}
                              />
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>


      {/* Floating Action Button */}
      {!graded && (
        <View className="absolute bottom-8 left-0 right-0 items-center">
          <TouchableOpacity 
            className="bg-primary-main rounded-full py-4 px-8 flex-row items-center shadow-md shadow-primary-main/30"
            onPress={handleGrade}
          >
            <Check size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">{t('common.submit')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
