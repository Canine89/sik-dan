import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sik-dan-meals';

export const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // localStorage에서 데이터 로드
  const loadMeals = () => {
    try {
      const storedMeals = localStorage.getItem(STORAGE_KEY);
      if (storedMeals) {
        const parsedMeals = JSON.parse(storedMeals);
        setMeals(parsedMeals);
      }
    } catch (error) {
      console.error('Failed to load meals from localStorage:', error);
      setMeals([]);
    } finally {
      setLoading(false);
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

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadMeals();
  }, []);

  // 식단 추가
  const addMeal = (mealData) => {
    const newMeal = {
      ...mealData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
    
    return newMeal;
  };

  // 식단 수정
  const updateMeal = (id, mealData) => {
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
  const deleteMeal = (id) => {
    const updatedMeals = meals.filter(meal => meal.id !== id);
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
  };

  // 날짜별 식단 조회
  const getMealsByDate = (date) => {
    return meals.filter(meal => meal.date === date);
  };

  // 날짜 범위별 식단 조회
  const getMealsByDateRange = (startDate, endDate) => {
    return meals.filter(meal => meal.date >= startDate && meal.date <= endDate);
  };

  // 식사 타입별 식단 조회
  const getMealsByType = (mealType) => {
    return meals.filter(meal => meal.mealType === mealType);
  };

  // 칼로리 통계
  const getCalorieStats = (date) => {
    const dayMeals = getMealsByDate(date);
    const stats = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
      total: 0
    };

    dayMeals.forEach(meal => {
      stats[meal.mealType] += meal.calories;
      stats.total += meal.calories;
    });

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
    loading,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealsByDate,
    getMealsByDateRange,
    getMealsByType,
    getCalorieStats,
    getWeeklyCalorieStats,
    exportData,
    importData,
    clearAllData,
    reload: loadMeals
  };
};