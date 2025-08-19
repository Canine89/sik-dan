import { useState, useEffect } from 'react';
import { getMealsByDate, createMeal, deleteMeal as deleteMealAPI, getAllFoods } from '../lib/database.js';
import { testSupabaseConnection } from '../lib/supabase.js';
import { MEAL_TYPES } from '../types/database.types.js';

const STORAGE_KEY = 'sik-dan-meals';
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000123'; // 데모용 UUID 형식 사용자 ID

export const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 음식 데이터 로드
  const loadFoods = async () => {
    try {
      const result = await getAllFoods();
      if (result.error) {
        console.error('음식 데이터 로드 실패:', result.message);
        return [];
      }
      setFoods(result.data);
      return result.data;
    } catch (error) {
      console.error('음식 데이터 로드 중 오류:', error);
      return [];
    }
  };

  // Supabase에서 특정 날짜의 식단 데이터 로드
  const loadMealsByDate = async (date) => {
    try {
      const result = await getMealsByDate(DEMO_USER_ID, date);
      if (result.error) {
        console.error('식단 데이터 로드 실패:', result.message);
        return [];
      }
      return result.data || [];
    } catch (error) {
      console.error('식단 데이터 로드 중 오류:', error);
      return [];
    }
  };

  // localStorage에서 데이터 로드 (백업용)
  const loadMealsFromStorage = () => {
    try {
      const storedMeals = localStorage.getItem(STORAGE_KEY);
      if (storedMeals) {
        const parsedMeals = JSON.parse(storedMeals);
        console.log('📱 localStorage에서 로드된 식단 데이터:', parsedMeals);
        return parsedMeals;
      }
      return [];
    } catch (error) {
      console.error('Failed to load meals from localStorage:', error);
      return [];
    }
  };

  // localStorage에 데이터 저장
  const saveMeals = (mealsData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mealsData));
    } catch (error) {
      console.error('Failed to save meals to localStorage:', error);
    }
  };

  // 초기 데이터 로드
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 식단 앱 초기 데이터 로드 시작...');
      
      // Supabase 연결 테스트
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        console.error('❌ Supabase 연결 실패:', connectionTest.error);
        setError(`데이터베이스 연결 실패: ${connectionTest.error}`);
        
        // localStorage에서 로드
        const localMeals = loadMealsFromStorage();
        setMeals(localMeals);
        setLoading(false);
        return;
      }
      
      // 음식 데이터 로드
      console.log('🍽️ 음식 데이터 로드 중...');
      await loadFoods();
      
      // 오늘 날짜의 식단 데이터 로드
      console.log('📅 오늘 식단 데이터 로드 중...');
      const today = new Date().toISOString().split('T')[0];
      const todayMeals = await loadMealsByDate(today);
      setMeals(todayMeals);
      
      // localStorage에도 백업
      saveMeals(todayMeals);
      
      console.log('✅ 초기 데이터 로드 완료!', {
        foods: foods.length,
        meals: todayMeals.length,
        date: today
      });
      
    } catch (error) {
      console.error('❌ 초기 데이터 로드 실패:', error);
      setError(`데이터 로드 실패: ${error.message}`);
      
      // Supabase 연결 실패 시 localStorage에서 로드
      const localMeals = loadMealsFromStorage();
      setMeals(localMeals);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  // 식단 추가 (간단한 로컬 저장 방식으로 변경)
  const addMeal = async (mealData) => {
    try {
      console.log('🍽️ 식단 추가 시작:', mealData);
      
      // 간단하게 로컬에만 저장하도록 임시 변경
      // TODO: 나중에 meal_items 테이블과 연동하여 완전한 Supabase 저장 구현
      const newMeal = {
        ...mealData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        // Supabase 형식도 지원
        meal_type: mealData.mealType,
        meal_date: mealData.date,
        name: mealData.foodName
      };
      
      const updatedMeals = [...meals, newMeal];
      setMeals(updatedMeals);
      saveMeals(updatedMeals);
      
      console.log('✅ 로컬 저장 완료:', newMeal);
      return newMeal;
      
    } catch (error) {
      console.error('❌ 식단 추가 중 오류:', error);
      throw error;
    }
  };

  // 식단 수정
  const updateMeal = (id, mealData) => {
    // 일단 로컬에서만 처리 (추후 Supabase 업데이트 추가 가능)
    const updatedMeals = meals.map(meal => 
      meal.id === id 
        ? { ...meal, ...mealData, updatedAt: new Date().toISOString() }
        : meal
    );
    
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
    
    return updatedMeals.find(meal => meal.id === id);
  };

  // 식단 삭제
  const deleteMeal = async (id) => {
    try {
      const result = await deleteMealAPI(id);
      
      if (result.error) {
        console.error('식단 삭제 실패:', result.message);
      }

      // 성공/실패 관계없이 로컬에서도 삭제
      const updatedMeals = meals.filter(meal => meal.id !== id);
      setMeals(updatedMeals);
      saveMeals(updatedMeals);
      
    } catch (error) {
      console.error('식단 삭제 중 오류:', error);
      // 오류 발생시에도 로컬에서는 삭제
      const updatedMeals = meals.filter(meal => meal.id !== id);
      setMeals(updatedMeals);
      saveMeals(updatedMeals);
    }
  };

  // 날짜별 식단 조회 (Supabase에서 가져오기)
  const getMealsByDateLocal = async (date) => {
    try {
      const result = await loadMealsByDate(date);
      return result;
    } catch (error) {
      console.error('날짜별 식단 조회 오류:', error);
      // 로컬 데이터로 폴백
      return meals.filter(meal => meal.meal_date === date || meal.date === date);
    }
  };

  // 날짜 범위별 식단 조회
  const getMealsByDateRange = (startDate, endDate) => {
    return meals.filter(meal => {
      const mealDate = meal.meal_date || meal.date;
      return mealDate >= startDate && mealDate <= endDate;
    });
  };

  // 식사 타입별 식단 조회
  const getMealsByType = (mealType) => {
    return meals.filter(meal => (meal.meal_type || meal.mealType) === mealType);
  };

  // 칼로리 통계 (로컬 데이터 사용)
  const getCalorieStats = (date) => {
    // 로컬 상태에서 해당 날짜의 식사 필터링
    const dayMeals = meals.filter(meal => {
      const mealDate = meal.meal_date || meal.date;
      return mealDate === date;
    });
    
    const stats = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
      total: 0
    };

    // dayMeals가 배열인지 확인
    if (Array.isArray(dayMeals)) {
      dayMeals.forEach(meal => {
        const mealType = meal.meal_type || meal.mealType || 'breakfast';
        const calories = meal.calories || 0;
        
        if (stats.hasOwnProperty(mealType)) {
          stats[mealType] += calories;
        }
        stats.total += calories;
      });
    }

    return stats;
  };

  // 주간 칼로리 통계
  const getWeeklyCalorieStats = (date) => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weeklyStats = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const dayStats = getCalorieStats(dateString);
      weeklyStats.push({
        date: dateString,
        dayOfWeek: currentDate.toLocaleDateString('ko-KR', { weekday: 'short' }),
        ...dayStats
      });
    }
    
    return weeklyStats;
  };

  // 전체 데이터 내보내기
  const exportData = () => {
    const dataToExport = {
      meals,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sik-dan-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 데이터 가져오기
  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (importedData.meals && Array.isArray(importedData.meals)) {
            setMeals(importedData.meals);
            saveMeals(importedData.meals);
            resolve(importedData.meals.length);
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // 데이터 초기화
  const clearAllData = () => {
    setMeals([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    meals,
    foods,
    loading,
    error,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealsByDate: getMealsByDateLocal,
    getMealsByDateRange,
    getMealsByType,
    getCalorieStats,
    getWeeklyCalorieStats,
    exportData,
    importData,
    clearAllData,
    reload: loadInitialData,
    loadMealsByDate
  };
};