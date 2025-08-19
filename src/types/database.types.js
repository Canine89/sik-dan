/**
 * Supabase Database Types
 * Generated from sik-dan-app database schema
 */

// 사용자 프로필 타입
export const UserType = {
  id: 'string',
  email: 'string',
  name: 'string',
  age: 'number',
  gender: 'string',
  height: 'number',
  weight: 'number',
  activity_level: 'string',
  goal: 'string', // 'weight_loss', 'weight_gain', 'maintain'
  target_calories: 'number',
  created_at: 'string',
  updated_at: 'string'
}

// 음식 정보 타입
export const FoodType = {
  id: 'string',
  name: 'string',
  calories_per_100g: 'number',
  protein_per_100g: 'number',
  carbs_per_100g: 'number',
  fat_per_100g: 'number',
  fiber_per_100g: 'number',
  sodium_per_100g: 'number',
  category: 'string',
  created_at: 'string'
}

// 식사 기록 타입
export const MealType = {
  id: 'string',
  user_id: 'string',
  meal_type: 'string', // 'breakfast', 'lunch', 'dinner', 'snack'
  meal_date: 'string',
  name: 'string',
  created_at: 'string',
  updated_at: 'string'
}

// 식사 구성 항목 타입
export const MealItemType = {
  id: 'string',
  meal_id: 'string',
  food_id: 'string',
  quantity: 'number', // in grams
  calories: 'number',
  protein: 'number',
  carbs: 'number',
  fat: 'number',
  fiber: 'number',
  sodium: 'number',
  created_at: 'string'
}

// 일일 영양 통계 타입
export const DailyNutritionType = {
  id: 'string',
  user_id: 'string',
  date: 'string',
  total_calories: 'number',
  total_protein: 'number',
  total_carbs: 'number',
  total_fat: 'number',
  total_fiber: 'number',
  total_sodium: 'number',
  updated_at: 'string'
}

// 식사 타입 상수
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
}

// 사용자 목표 상수
export const USER_GOALS = {
  WEIGHT_LOSS: 'weight_loss',
  WEIGHT_GAIN: 'weight_gain',
  MAINTAIN: 'maintain'
}

// 활동 레벨 상수
export const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHT: 'light',
  MODERATE: 'moderate',
  ACTIVE: 'active',
  VERY_ACTIVE: 'very_active'
}