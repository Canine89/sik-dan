// 데모/개발용 RLS 비활성화 스크립트
// 주의: 프로덕션에서는 사용하지 마세요!

import { supabase } from './supabase.js'

export const disableRLSForDemo = async () => {
  try {
    console.log('데모용 RLS 설정 시작...')
    
    // RLS 정책 삭제 및 재생성
    const queries = [
      // 기존 정책 삭제
      'DROP POLICY IF EXISTS users_policy ON users',
      'DROP POLICY IF EXISTS meals_policy ON meals', 
      'DROP POLICY IF EXISTS meal_items_policy ON meal_items',
      'DROP POLICY IF EXISTS daily_nutrition_policy ON daily_nutrition',
      
      // 데모용 정책 생성 (모든 접근 허용)
      'CREATE POLICY demo_users_policy ON users FOR ALL USING (true)',
      'CREATE POLICY demo_meals_policy ON meals FOR ALL USING (true)',
      'CREATE POLICY demo_meal_items_policy ON meal_items FOR ALL USING (true)', 
      'CREATE POLICY demo_daily_nutrition_policy ON daily_nutrition FOR ALL USING (true)'
    ]

    for (const query of queries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        console.error('쿼리 실행 오류:', query, error)
      }
    }
    
    console.log('데모용 RLS 설정 완료!')
    return true
  } catch (error) {
    console.error('RLS 설정 중 오류:', error)
    return false
  }
}

// 개발 환경에서만 자동 실행
if (import.meta.env.DEV) {
  console.log('개발 환경 감지 - RLS 데모 설정 시도 중...')
  // disableRLSForDemo() // 필요시 주석 해제
}