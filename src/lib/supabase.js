import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 ANON KEY가 환경 변수에 설정되지 않았습니다.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 에러 핸들링 헬퍼 함수
export const handleSupabaseError = (error) => {
  console.error('Supabase 에러:', error)
  return {
    error: true,
    message: error.message || '데이터베이스 오류가 발생했습니다.'
  }
}

// 성공 응답 헬퍼 함수
export const handleSupabaseSuccess = (data) => {
  return {
    error: false,
    data
  }
}