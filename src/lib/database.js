import { supabase, handleSupabaseError, handleSupabaseSuccess } from './supabase.js'

// =============================================================================
// 음식 관련 API
// =============================================================================

/**
 * 모든 음식 목록 가져오기
 */
export const getAllFoods = async () => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('name')

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * 카테고리별 음식 목록 가져오기
 */
export const getFoodsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('category', category)
      .order('name')

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * 음식 검색
 */
export const searchFoods = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name')

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// =============================================================================
// 사용자 관련 API
// =============================================================================

/**
 * 사용자 프로필 생성
 */
export const createUserProfile = async (userProfile) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userProfile])
      .select()

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data[0])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * 사용자 프로필 가져오기
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * 사용자 프로필 업데이트
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data[0])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// =============================================================================
// 식사 관련 API
// =============================================================================

/**
 * 식사 기록 생성
 */
export const createMeal = async (mealData) => {
  try {
    // RLS 우회를 위해 service role이 아닌 anon key로 직접 삽입
    const { data, error } = await supabase
      .from('meals')
      .insert([{
        ...mealData,
        user_id: '00000000-0000-0000-0000-000000000123' // 고정 데모 사용자 ID (UUID 형식)
      }])
      .select()

    if (error) {
      console.error('Supabase 삽입 오류:', error)
      return handleSupabaseError(error)
    }
    
    console.log('식사 기록 생성 성공:', data)
    return handleSupabaseSuccess(data[0])
  } catch (error) {
    console.error('식사 기록 생성 중 예외:', error)
    return handleSupabaseError(error)
  }
}

/**
 * 특정 날짜의 사용자 식사 목록 가져오기
 */
export const getMealsByDate = async (userId, date) => {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select(`
        *,
        meal_items (
          *,
          foods (*)
        )
      `)
      .eq('user_id', userId)
      .eq('meal_date', date)
      .order('created_at')

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * 식사 기록 삭제
 */
export const deleteMeal = async (mealId) => {
  try {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId)

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(true)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// =============================================================================
// 식사 구성 항목 관련 API
// =============================================================================

/**
 * 식사 구성 항목 추가
 */
export const addMealItem = async (mealItemData) => {
  try {
    const { data, error } = await supabase
      .from('meal_items')
      .insert([mealItemData])
      .select()

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data[0])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * 식사 구성 항목 업데이트
 */
export const updateMealItem = async (mealItemId, updates) => {
  try {
    const { data, error } = await supabase
      .from('meal_items')
      .update(updates)
      .eq('id', mealItemId)
      .select()

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data[0])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * 식사 구성 항목 삭제
 */
export const deleteMealItem = async (mealItemId) => {
  try {
    const { error } = await supabase
      .from('meal_items')
      .delete()
      .eq('id', mealItemId)

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(true)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// =============================================================================
// 일일 영양 통계 관련 API
// =============================================================================

/**
 * 일일 영양 통계 가져오기
 */
export const getDailyNutrition = async (userId, date) => {
  try {
    const { data, error } = await supabase
      .from('daily_nutrition')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') return handleSupabaseError(error)
    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * 일일 영양 통계 업데이트 또는 생성
 */
export const upsertDailyNutrition = async (nutritionData) => {
  try {
    const { data, error } = await supabase
      .from('daily_nutrition')
      .upsert([nutritionData])
      .select()

    if (error) return handleSupabaseError(error)
    return handleSupabaseSuccess(data[0])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// =============================================================================
// 영양 계산 헬퍼 함수
// =============================================================================

/**
 * 식사 항목의 영양성분 계산
 */
export const calculateNutrition = (food, quantity) => {
  const ratio = quantity / 100 // 100g 기준으로 계산
  
  return {
    calories: Math.round(food.calories_per_100g * ratio * 100) / 100,
    protein: Math.round(food.protein_per_100g * ratio * 100) / 100,
    carbs: Math.round(food.carbs_per_100g * ratio * 100) / 100,
    fat: Math.round(food.fat_per_100g * ratio * 100) / 100,
    fiber: Math.round(food.fiber_per_100g * ratio * 100) / 100,
    sodium: Math.round(food.sodium_per_100g * ratio * 100) / 100,
  }
}

/**
 * 여러 식사의 총 영양성분 계산
 */
export const calculateTotalNutrition = (meals) => {
  let totals = {
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0,
    total_fiber: 0,
    total_sodium: 0
  }

  meals.forEach(meal => {
    if (meal.meal_items) {
      meal.meal_items.forEach(item => {
        totals.total_calories += item.calories || 0
        totals.total_protein += item.protein || 0
        totals.total_carbs += item.carbs || 0
        totals.total_fat += item.fat || 0
        totals.total_fiber += item.fiber || 0
        totals.total_sodium += item.sodium || 0
      })
    }
  })

  // 소수점 둘째 자리까지 반올림
  Object.keys(totals).forEach(key => {
    totals[key] = Math.round(totals[key] * 100) / 100
  })

  return totals
}