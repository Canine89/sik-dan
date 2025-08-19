-- 🔧 sik-dan-app 데모용 완전 설정
-- Supabase 대시보드 → SQL Editor에서 실행하세요

-- ==============================
-- 1단계: RLS 완전 비활성화
-- ==============================

-- 기존 정책들 삭제
DROP POLICY IF EXISTS users_policy ON users;
DROP POLICY IF EXISTS meals_policy ON meals;
DROP POLICY IF EXISTS meal_items_policy ON meal_items;
DROP POLICY IF EXISTS daily_nutrition_policy ON daily_nutrition;
DROP POLICY IF EXISTS foods_read_policy ON foods;

-- 데모용 정책들도 삭제 (있다면)
DROP POLICY IF EXISTS demo_users_policy ON users;
DROP POLICY IF EXISTS demo_meals_policy ON meals;
DROP POLICY IF EXISTS demo_meal_items_policy ON meal_items;
DROP POLICY IF EXISTS demo_daily_nutrition_policy ON daily_nutrition;

-- RLS 완전 비활성화
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE meals DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_nutrition DISABLE ROW LEVEL SECURITY;
ALTER TABLE foods DISABLE ROW LEVEL SECURITY;

-- ==============================
-- 2단계: 데모 사용자 생성
-- ==============================

-- 데모 사용자 삽입 (이미 존재할 수 있으므로 ON CONFLICT 사용)
INSERT INTO users (
    id,
    email,
    name,
    age,
    gender,
    height,
    weight,
    activity_level,
    goal,
    target_calories
) VALUES (
    '00000000-0000-0000-0000-000000000123',
    'demo@sikdan.app',
    '데모 사용자',
    25,
    'male',
    175.0,
    70.0,
    'moderate',
    'maintain',
    2200
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = NOW();

-- ==============================
-- 방법 2: 데모용 오픈 정책 (대안)
-- ==============================

-- 만약 RLS를 유지하고 싶다면 아래 주석을 해제하고 위의 DISABLE 명령들을 주석처리하세요
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_nutrition ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY demo_open_users ON users FOR ALL USING (true);
-- CREATE POLICY demo_open_meals ON meals FOR ALL USING (true);
-- CREATE POLICY demo_open_meal_items ON meal_items FOR ALL USING (true);
-- CREATE POLICY demo_open_daily_nutrition ON daily_nutrition FOR ALL USING (true);
-- CREATE POLICY demo_open_foods ON foods FOR ALL USING (true);

-- ==============================
-- 테스트용 데이터 확인
-- ==============================

-- 현재 데이터 확인
SELECT 'foods 테이블:' as table_name, COUNT(*) as record_count FROM foods
UNION ALL
SELECT 'meals 테이블:', COUNT(*) FROM meals
UNION ALL
SELECT 'meal_items 테이블:', COUNT(*) FROM meal_items
UNION ALL
SELECT 'users 테이블:', COUNT(*) FROM users
UNION ALL
SELECT 'daily_nutrition 테이블:', COUNT(*) FROM daily_nutrition;

-- RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '🔒 RLS 활성화'
        ELSE '🔓 RLS 비활성화'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'meals', 'meal_items', 'daily_nutrition', 'foods')
ORDER BY tablename;