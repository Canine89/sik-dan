import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 디버깅 정보 출력
console.log('🔧 Supabase 환경 변수 확인:', {
  url: supabaseUrl ? '✅ 설정됨' : '❌ 누락됨',
  key: supabaseAnonKey ? '✅ 설정됨' : '❌ 누락됨',
  urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined',
  keyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined',
  environment: import.meta.env.MODE
})

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `Supabase 환경 변수 누락: URL=${!!supabaseUrl}, KEY=${!!supabaseAnonKey}`
  console.error('❌ ' + errorMsg)
  throw new Error(errorMsg)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

// Supabase 연결 테스트 함수
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Supabase 연결 테스트 시작...')
    
    const { data, error } = await supabase
      .from('foods')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase 연결 실패:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase 연결 성공!')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Supabase 연결 테스트 중 오류:', error)
    return { success: false, error: error.message }
  }
}

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