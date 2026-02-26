import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// 번역 데이터 (UI용 + 커리큘럼 용어)
const resources = {
  ko: {
    translation: {
      "home": {
        "greeting": "안녕하세요!",
        "morning": "기분 좋은 아침이에요!",
        "afternoon": "활기찬 오후예요!",
        "evening": "저녁엔 복습해봐요!",
        "night": "밤에도 대단해요!",
        "stars": "별",
        "rank": "등급",
        "study_time": "공부 시간",
        "daily_goal": "오늘의 목표",
        "problems_solved": "문제 풀기",
        "grade_select": "학년 선택",
        "grade_1": "1학년",
        "grade_2": "2학년",
        "grade_3": "3학년",
        "grade_4": "4학년",
        "grade_5": "5학년",
        "grade_6": "6학년",
        "grade_1_desc": "9까지의 수",
        "grade_2_desc": "구구단",
        "grade_3_desc": "나눗셈과 분수",
        "grade_4_desc": "분수와 도형",
        "grade_5_desc": "소수와 합동",
        "grade_6_desc": "비례식과 부피",
        "user_suffix": "님!",
        "student": "학생",
        "solved_total": "지금까지 총 {{count}}문제를 풀었어요!",
        "study_summary": "학습 요약",
        "streak": "출석",
        "accuracy": "정답률",
        "sessions_done": "학습 완료",
        "days_unit": "{{count}}일",
        "sessions_unit": "{{count}}회"
      },
      "topics": {
        "title": "수학 학습",
        "search_placeholder": "'도형' 같은 단원을 검색해 보세요...",
        "progress_title": "나의 진행 상황",
        "select_unit": "{{grade}}학년 단원 선택",
        "start": "시작",
        "collected_stars": "모은 별",
        "current_rank": "현재 랭크",
        "study_time": "학습 시간"
      },
      "common": {
        "back": "뒤로",
        "submit": "채점하기",
        "redo": "재시험 보기",
        "grading": "문제를 생성하고 있어요...",
        "perfect": "훌륭해요!",
        "keep_going": "아쉬워요! 다시 풀어볼까요?",
        "score": "점수: {{score}}점",
        "answer_toggle": "정답 보기",
        "instruction_default": "아래 문제들을 풀어보세요!",
        "placeholder_answer": "정답 입력",
        "all_view": "전체 보기",
        "lang_ko": "한국어",
        "lang_en": "English",
        "lang_ja": "日本語",
        "switch_lang": "언어 변경",
        "notification_not_ready": "아직 알림 기능은 준비 중입니다!",
        "notification_title": "알림",
        "answer_label": "정답",
        "difficulty_normal": "보통",
        "coming_soon_title": "준비 중",
        "coming_soon_msg": "곧 추가될 기능입니다!",
        "logout": "로그아웃",
        "logout_confirm": "정말 로그아웃 하시겠습니까?",
        "cancel": "취소"
      },
      // ─── 커리큘럼 번역 (학년 → 학기단원 → 세부주제) ───
      "curriculum": {
        "g1": {
          "u1": { "title": "1학기 - 9까지의 수", "t1": "가르기와 모으기" },
          "u2": { "title": "1학기 - 덧셈과 뺄셈(1)", "t1": "한 자리 덧셈", "t2": "한 자리 뺄셈" },
          "u3": { "title": "1학기 - 50까지의 수", "t1": "50까지의 수 세기" },
          "u4": { "title": "1학기 - 비교하기", "t1": "수의 크기 비교" },
          "u5": { "title": "2학기 - 덧셈과 뺄셈(2)", "t1": "받아올림 없는 덧셈", "t2": "합이 9 이하인 덧셈" },
          "u6": { "title": "2학기 - 덧셈과 뺄셈(3)", "t1": "받아올림 없는 두 자리 덧셈", "t2": "받아내림 없는 두 자리 뺄셈" },
          "u7": { "title": "2학기 - 100까지의 수", "t1": "100까지의 수 덧셈", "t2": "100까지의 수 뺄셈" }
        },
        "g2": {
          "u1": { "title": "1학기 - 세 자리 수", "t1": "세 자리 수 읽기·쓰기" },
          "u2": { "title": "1학기 - 덧셈과 뺄셈", "t1": "받아올림 있는 덧셈", "t2": "받아내림 있는 뺄셈", "t3": "덧셈/뺄셈 서술형" },
          "u3": { "title": "1학기 - 곱셈 개념", "t1": "같은 수 더하기 → 곱셈" },
          "u4": { "title": "2학기 - 네 자리 수", "t1": "네 자리 수 읽기·쓰기" },
          "u5": { "title": "2학기 - 곱셈구구", "t1": "2단", "t2": "3단", "t3": "4단", "t4": "5단", "t5": "혼합 구구" }
        },
        "g3": {
          "u1": { "title": "1학기 - 덧셈과 뺄셈", "t1": "세 자리 수 덧셈", "t2": "세 자리 수 뺄셈" },
          "u2": { "title": "1학기 - 평면도형", "t1": "도형의 기본 성질" },
          "u3": { "title": "1학기 - 나눗셈", "t1": "나눗셈 기초" },
          "u4": { "title": "1학기 - 곱셈", "t1": "두 자리 × 한 자리", "t2": "곱셈 서술형" },
          "u5": { "title": "1학기 - 분수와 소수", "t1": "분수의 개념" },
          "u6": { "title": "2학기 - 곱셈(2)", "t1": "두 자리 × 두 자리" },
          "u7": { "title": "2학기 - 나눗셈(2)", "t1": "나머지 있는 나눗셈" },
          "u8": { "title": "2학기 - 분수", "t1": "대분수 → 가분수", "t2": "가분수 → 대분수" }
        },
        "g4": {
          "u1": { "title": "1학기 - 큰 수", "t1": "만 단위 수 읽기·쓰기" },
          "u2": { "title": "1학기 - 곱셈과 나눗셈", "t1": "세 자리 × 두 자리", "t2": "나눗셈", "t3": "나눗셈 서술형" },
          "u3": { "title": "1학기 - 각도", "t1": "각도 계산" },
          "u4": { "title": "1학기 - 삼각형", "t1": "삼각형의 분류" },
          "u5": { "title": "2학기 - 분수의 덧셈과 뺄셈", "t1": "같은 분모 분수 덧셈", "t2": "같은 분모 분수 뺄셈" },
          "u6": { "title": "2학기 - 소수의 덧셈과 뺄셈", "t1": "소수의 덧셈", "t2": "소수의 뺄셈" }
        },
        "g5": {
          "u1": { "title": "1학기 - 혼합 계산", "t1": "사칙연산 혼합" },
          "u2": { "title": "1학기 - 약수와 배수", "t1": "약수와 배수 구하기" },
          "u3": { "title": "1학기 - 약분과 통분", "t1": "약분" },
          "u4": { "title": "1학기 - 분수의 덧셈과 뺄셈", "t1": "이분모 분수 덧셈", "t2": "분수 서술형" },
          "u5": { "title": "1학기 - 넓이", "t1": "넓이 구하기" },
          "u6": { "title": "2학기 - 수의 범위와 어림", "t1": "반올림" },
          "u7": { "title": "2학기 - 분수의 곱셈", "t1": "분수 × 자연수" },
          "u8": { "title": "2학기 - 소수의 곱셈", "t1": "소수 × 자연수" }
        },
        "g6": {
          "u1": { "title": "1학기 - 분수의 나눗셈", "t1": "분수 ÷ 자연수" },
          "u2": { "title": "1학기 - 소수의 나눗셈", "t1": "소수 ÷ 자연수" },
          "u3": { "title": "1학기 - 비와 비율", "t1": "비를 분수로" },
          "u4": { "title": "1학기 - 원의 넓이", "t1": "원의 넓이 구하기" },
          "u5": { "title": "1학기 - 직육면체의 부피", "t1": "부피 구하기" },
          "u6": { "title": "2학기 - 분수의 나눗셈(2)", "t1": "분수 나눗셈 심화" },
          "u7": { "title": "2학기 - 소수의 나눗셈(2)", "t1": "소수 나눗셈 심화" },
          "u8": { "title": "2학기 - 비례식과 비례배분", "t1": "비례식 풀기" }
        }
      }
    }
  },
  en: {
    translation: {
      "home": {
        "greeting": "Hello!",
        "morning": "Good morning!",
        "afternoon": "Good afternoon!",
        "evening": "Good evening!",
        "night": "Studying late? Great!",
        "stars": "Stars",
        "rank": "Rank",
        "study_time": "Study Time",
        "daily_goal": "Daily Goal",
        "problems_solved": "Problems Solved",
        "grade_select": "Select Grade",
        "grade_1": "Grade 1",
        "grade_2": "Grade 2",
        "grade_3": "Grade 3",
        "grade_4": "Grade 4",
        "grade_5": "Grade 5",
        "grade_6": "Grade 6",
        "grade_1_desc": "Numbers up to 9",
        "grade_2_desc": "Times Tables",
        "grade_3_desc": "Division & Fractions",
        "grade_4_desc": "Fractions & Shapes",
        "grade_5_desc": "Decimals & Congruence",
        "grade_6_desc": "Proportions & Volume",
        "user_suffix": "!",
        "student": "Student",
        "solved_total": "You've solved {{count}} problems so far!",
        "study_summary": "Study Summary",
        "streak": "Streak",
        "accuracy": "Accuracy",
        "sessions_done": "Completed",
        "days_unit": "{{count}}d",
        "sessions_unit": "{{count}}x"
      },
      "topics": {
        "title": "Math Learning",
        "search_placeholder": "Search units like 'geometry'...",
        "progress_title": "My Progress",
        "select_unit": "Grade {{grade}} Units",
        "start": "Start",
        "collected_stars": "Stars Earned",
        "current_rank": "Current Rank",
        "study_time": "Study Time"
      },
      "common": {
        "back": "Back",
        "submit": "Grade",
        "redo": "Retake",
        "grading": "Generating problems...",
        "perfect": "Great job!",
        "keep_going": "Keep trying! Retake the test?",
        "score": "Score: {{score}}",
        "answer_toggle": "Show Answers",
        "instruction_default": "Solve the problems below!",
        "placeholder_answer": "Answer here",
        "all_view": "View All",
        "lang_ko": "한국어",
        "lang_en": "English",
        "lang_ja": "日本語",
        "switch_lang": "Change Language",
        "notification_not_ready": "Notifications not ready yet!",
        "notification_title": "Notice",
        "answer_label": "Answer",
        "difficulty_normal": "Normal",
        "coming_soon_title": "Coming Soon",
        "coming_soon_msg": "This feature is coming soon!",
        "logout": "Log Out",
        "logout_confirm": "Are you sure you want to log out?",
        "cancel": "Cancel"
      },
      "curriculum": {
        "g1": {
          "u1": { "title": "Sem 1 - Numbers up to 9", "t1": "Splitting and Combining" },
          "u2": { "title": "Sem 1 - Addition & Subtraction (1)", "t1": "Single-digit Addition", "t2": "Single-digit Subtraction" },
          "u3": { "title": "Sem 1 - Numbers up to 50", "t1": "Counting to 50" },
          "u4": { "title": "Sem 1 - Comparing", "t1": "Comparing Numbers" },
          "u5": { "title": "Sem 2 - Addition & Subtraction (2)", "t1": "Addition without Carrying", "t2": "Addition (sum ≤ 9)" },
          "u6": { "title": "Sem 2 - Addition & Subtraction (3)", "t1": "Two-digit Addition (no carry)", "t2": "Two-digit Subtraction (no borrow)" },
          "u7": { "title": "Sem 2 - Numbers up to 100", "t1": "Addition up to 100", "t2": "Subtraction up to 100" }
        },
        "g2": {
          "u1": { "title": "Sem 1 - Three-digit Numbers", "t1": "Reading & Writing 3-digit Numbers" },
          "u2": { "title": "Sem 1 - Addition & Subtraction", "t1": "Addition with Carrying", "t2": "Subtraction with Borrowing", "t3": "Word Problems (Add/Sub)" },
          "u3": { "title": "Sem 1 - Multiplication Basics", "t1": "Repeated Addition → Multiplication" },
          "u4": { "title": "Sem 2 - Four-digit Numbers", "t1": "Reading & Writing 4-digit Numbers" },
          "u5": { "title": "Sem 2 - Multiplication Tables", "t1": "2× Table", "t2": "3× Table", "t3": "4× Table", "t4": "5× Table", "t5": "Mixed Tables" }
        },
        "g3": {
          "u1": { "title": "Sem 1 - Addition & Subtraction", "t1": "3-digit Addition", "t2": "3-digit Subtraction" },
          "u2": { "title": "Sem 1 - Plane Figures", "t1": "Basic Properties of Shapes" },
          "u3": { "title": "Sem 1 - Division", "t1": "Basic Division" },
          "u4": { "title": "Sem 1 - Multiplication", "t1": "2-digit × 1-digit", "t2": "Multiplication Word Problems" },
          "u5": { "title": "Sem 1 - Fractions & Decimals", "t1": "Fraction Concepts" },
          "u6": { "title": "Sem 2 - Multiplication (2)", "t1": "2-digit × 2-digit" },
          "u7": { "title": "Sem 2 - Division (2)", "t1": "Division with Remainder" },
          "u8": { "title": "Sem 2 - Fractions", "t1": "Mixed → Improper", "t2": "Improper → Mixed" }
        },
        "g4": {
          "u1": { "title": "Sem 1 - Large Numbers", "t1": "Reading & Writing 10,000s" },
          "u2": { "title": "Sem 1 - Multiplication & Division", "t1": "3-digit × 2-digit", "t2": "Long Division", "t3": "Division Word Problems" },
          "u3": { "title": "Sem 1 - Angles", "t1": "Angle Calculations" },
          "u4": { "title": "Sem 1 - Triangles", "t1": "Triangle Classification" },
          "u5": { "title": "Sem 2 - Fraction Add & Sub", "t1": "Same Denominator Addition", "t2": "Same Denominator Subtraction" },
          "u6": { "title": "Sem 2 - Decimal Add & Sub", "t1": "Decimal Addition", "t2": "Decimal Subtraction" }
        },
        "g5": {
          "u1": { "title": "Sem 1 - Mixed Operations", "t1": "Order of Operations" },
          "u2": { "title": "Sem 1 - Factors & Multiples", "t1": "Finding Factors & Multiples" },
          "u3": { "title": "Sem 1 - Simplifying Fractions", "t1": "Reducing Fractions" },
          "u4": { "title": "Sem 1 - Fraction Add & Sub", "t1": "Unlike Denominator Addition", "t2": "Fraction Word Problems" },
          "u5": { "title": "Sem 1 - Area", "t1": "Calculating Area" },
          "u6": { "title": "Sem 2 - Estimation", "t1": "Rounding" },
          "u7": { "title": "Sem 2 - Fraction Multiplication", "t1": "Fraction × Whole Number" },
          "u8": { "title": "Sem 2 - Decimal Multiplication", "t1": "Decimal × Whole Number" }
        },
        "g6": {
          "u1": { "title": "Sem 1 - Fraction Division", "t1": "Fraction ÷ Whole Number" },
          "u2": { "title": "Sem 1 - Decimal Division", "t1": "Decimal ÷ Whole Number" },
          "u3": { "title": "Sem 1 - Ratios", "t1": "Ratio as Fraction" },
          "u4": { "title": "Sem 1 - Circle Area", "t1": "Calculating Circle Area" },
          "u5": { "title": "Sem 1 - Volume", "t1": "Calculating Volume" },
          "u6": { "title": "Sem 2 - Fraction Division (2)", "t1": "Advanced Fraction Division" },
          "u7": { "title": "Sem 2 - Decimal Division (2)", "t1": "Advanced Decimal Division" },
          "u8": { "title": "Sem 2 - Proportions", "t1": "Solving Proportions" }
        }
      }
    }
  },
  ja: {
    translation: {
      "home": {
        "greeting": "こんにちは！",
        "morning": "おはようございます！",
        "afternoon": "こんにちは！",
        "evening": "こんばんは！",
        "night": "夜も頑張ってますね！",
        "stars": "スター",
        "rank": "ランク",
        "study_time": "学習時間",
        "daily_goal": "今日の目標",
        "problems_solved": "問題数",
        "grade_select": "学年選択",
        "grade_1": "1年生",
        "grade_2": "2年生",
        "grade_3": "3年生",
        "grade_4": "4年生",
        "grade_5": "5年生",
        "grade_6": "6年生",
        "grade_1_desc": "9までの数",
        "grade_2_desc": "九九",
        "grade_3_desc": "わり算と分数",
        "grade_4_desc": "分数と図形",
        "grade_5_desc": "小数と合同",
        "grade_6_desc": "比例式と体積",
        "user_suffix": "さん！",
        "student": "生徒",
        "solved_total": "今まで全部で{{count}}問解きました！",
        "study_summary": "学習まとめ",
        "streak": "出席",
        "accuracy": "正答率",
        "sessions_done": "完了",
        "days_unit": "{{count}}日",
        "sessions_unit": "{{count}}回"
      },
      "topics": {
        "title": "算数の学習",
        "search_placeholder": "「図形」などの単元を検索...",
        "progress_title": "学習の状況",
        "select_unit": "{{grade}}年生の単元選択",
        "start": "開始",
        "collected_stars": "獲得スター",
        "current_rank": "現在のランク",
        "study_time": "学習時間"
      },
      "common": {
        "back": "戻る",
        "submit": "採点する",
        "redo": "もう一度解く",
        "grading": "問題を生成しています...",
        "perfect": "素晴らしいです！",
        "keep_going": "おしいです！もう一度挑戦しましょうか？",
        "score": "点数: {{score}}点",
        "answer_toggle": "答え合わせ",
        "instruction_default": "問題を解いてみましょう！",
        "placeholder_answer": "答えを入力",
        "all_view": "すべて見る",
        "lang_ko": "한국어",
        "lang_en": "English",
        "lang_ja": "日本語",
        "switch_lang": "言語変更",
        "notification_not_ready": "通知機能はまだ準備中です！",
        "notification_title": "お知らせ",
        "answer_label": "正解",
        "difficulty_normal": "普通",
        "coming_soon_title": "準備中",
        "coming_soon_msg": "もうすぐ追加される機能です！",
        "logout": "ログアウト",
        "logout_confirm": "本当にログアウトしますか？",
        "cancel": "キャンセル"
      },
      "curriculum": {
        "g1": {
          "u1": { "title": "前期 - 9までの数", "t1": "分解と合成" },
          "u2": { "title": "前期 - たし算とひき算(1)", "t1": "1桁のたし算", "t2": "1桁のひき算" },
          "u3": { "title": "前期 - 50までの数", "t1": "50までの数を数える" },
          "u4": { "title": "前期 - くらべる", "t1": "数の大きさ比較" },
          "u5": { "title": "後期 - たし算とひき算(2)", "t1": "くり上がりなしのたし算", "t2": "和が9以下のたし算" },
          "u6": { "title": "後期 - たし算とひき算(3)", "t1": "2桁のたし算(くり上がりなし)", "t2": "2桁のひき算(くり下がりなし)" },
          "u7": { "title": "後期 - 100までの数", "t1": "100までのたし算", "t2": "100までのひき算" }
        },
        "g2": {
          "u1": { "title": "前期 - 3桁の数", "t1": "3桁の数の読み書き" },
          "u2": { "title": "前期 - たし算とひき算", "t1": "くり上がりのあるたし算", "t2": "くり下がりのあるひき算", "t3": "文章題(たし算/ひき算)" },
          "u3": { "title": "前期 - かけ算の考え方", "t1": "同じ数のたし算 → かけ算" },
          "u4": { "title": "後期 - 4桁の数", "t1": "4桁の数の読み書き" },
          "u5": { "title": "後期 - 九九", "t1": "2の段", "t2": "3の段", "t3": "4の段", "t4": "5の段", "t5": "九九の混合" }
        },
        "g3": {
          "u1": { "title": "前期 - たし算とひき算", "t1": "3桁のたし算", "t2": "3桁のひき算" },
          "u2": { "title": "前期 - 平面図形", "t1": "図形の基本的な性質" },
          "u3": { "title": "前期 - わり算", "t1": "わり算の基本" },
          "u4": { "title": "前期 - かけ算", "t1": "2桁 × 1桁", "t2": "かけ算の文章題" },
          "u5": { "title": "前期 - 分数と小数", "t1": "分数の概念" },
          "u6": { "title": "後期 - かけ算(2)", "t1": "2桁 × 2桁" },
          "u7": { "title": "後期 - わり算(2)", "t1": "あまりのあるわり算" },
          "u8": { "title": "後期 - 分数", "t1": "帯分数 → 仮分数", "t2": "仮分数 → 帯分数" }
        },
        "g4": {
          "u1": { "title": "前期 - 大きな数", "t1": "万の位の数の読み書き" },
          "u2": { "title": "前期 - かけ算とわり算", "t1": "3桁 × 2桁", "t2": "筆算のわり算", "t3": "わり算の文章題" },
          "u3": { "title": "前期 - 角度", "t1": "角度の計算" },
          "u4": { "title": "前期 - 三角形", "t1": "三角形の分類" },
          "u5": { "title": "後期 - 分数のたし算とひき算", "t1": "同分母分数のたし算", "t2": "同分母分数のひき算" },
          "u6": { "title": "後期 - 小数のたし算とひき算", "t1": "小数のたし算", "t2": "小数のひき算" }
        },
        "g5": {
          "u1": { "title": "前期 - 混合計算", "t1": "四則混合計算" },
          "u2": { "title": "前期 - 約数と倍数", "t1": "約数と倍数を求める" },
          "u3": { "title": "前期 - 約分と通分", "t1": "約分" },
          "u4": { "title": "前期 - 分数のたし算とひき算", "t1": "異分母分数のたし算", "t2": "分数の文章題" },
          "u5": { "title": "前期 - 面積", "t1": "面積を求める" },
          "u6": { "title": "後期 - 数の範囲と概算", "t1": "四捨五入" },
          "u7": { "title": "後期 - 分数のかけ算", "t1": "分数 × 整数" },
          "u8": { "title": "後期 - 小数のかけ算", "t1": "小数 × 整数" }
        },
        "g6": {
          "u1": { "title": "前期 - 分数のわり算", "t1": "分数 ÷ 整数" },
          "u2": { "title": "前期 - 小数のわり算", "t1": "小数 ÷ 整数" },
          "u3": { "title": "前期 - 比と割合", "t1": "比を分数で表す" },
          "u4": { "title": "前期 - 円の面積", "t1": "円の面積を求める" },
          "u5": { "title": "前期 - 直方体の体積", "t1": "体積を求める" },
          "u6": { "title": "後期 - 分数のわり算(2)", "t1": "分数のわり算の発展" },
          "u7": { "title": "後期 - 小数のわり算(2)", "t1": "小数のわり算の発展" },
          "u8": { "title": "後期 - 比例式と比例配分", "t1": "比例式を解く" }
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0].languageCode || 'ko',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
