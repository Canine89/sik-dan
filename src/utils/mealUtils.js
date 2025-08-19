// 식단 관련 유틸리티 함수들

// 식사 타입을 한국어로 변환
export const getMealTypeLabel = (mealType) => {
  const labels = {
    breakfast: '🌅 아침',
    lunch: '☀️ 점심',
    dinner: '🌙 저녁',
    snack: '🍪 간식'
  };
  return labels[mealType] || mealType;
};

// 칼로리를 포맷팅 (콤마 추가)
export const formatCalories = (calories) => {
  return calories.toLocaleString('ko-KR');
};

// 식단 데이터를 날짜별로 그룹화
export const groupMealsByDate = (meals) => {
  return meals.reduce((groups, meal) => {
    const date = meal.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(meal);
    return groups;
  }, {});
};

// 식단 데이터를 식사 타입별로 그룹화
export const groupMealsByType = (meals) => {
  return meals.reduce((groups, meal) => {
    const type = meal.mealType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(meal);
    return groups;
  }, {});
};

// 일별 총 칼로리 계산
export const calculateDailyCalories = (meals) => {
  return meals.reduce((total, meal) => total + meal.calories, 0);
};

// 식사별 칼로리 합계 계산
export const calculateMealTypeCalories = (meals, mealType) => {
  return meals
    .filter(meal => meal.mealType === mealType)
    .reduce((total, meal) => total + meal.calories, 0);
};

// 평균 칼로리 계산
export const calculateAverageCalories = (dailyCalories) => {
  if (dailyCalories.length === 0) return 0;
  const total = dailyCalories.reduce((sum, calories) => sum + calories, 0);
  return Math.round(total / dailyCalories.length);
};

// 칼로리 목표 달성률 계산
export const calculateCalorieGoalProgress = (actualCalories, goalCalories) => {
  if (goalCalories === 0) return 0;
  return Math.round((actualCalories / goalCalories) * 100);
};

// 식단 검색 (음식명으로)
export const searchMealsByFoodName = (meals, searchTerm) => {
  if (!searchTerm.trim()) return meals;
  
  const term = searchTerm.toLowerCase();
  return meals.filter(meal => 
    meal.foodName.toLowerCase().includes(term) ||
    (meal.memo && meal.memo.toLowerCase().includes(term))
  );
};

// 칼로리 범위로 필터링
export const filterMealsByCalorieRange = (meals, minCalories, maxCalories) => {
  return meals.filter(meal => 
    meal.calories >= minCalories && meal.calories <= maxCalories
  );
};

// 최근 식단 N개 가져오기
export const getRecentMeals = (meals, count = 10) => {
  return meals
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, count);
};

// 가장 많이 먹은 음식 TOP N
export const getTopFoods = (meals, count = 5) => {
  const foodCounts = meals.reduce((counts, meal) => {
    const food = meal.foodName;
    counts[food] = (counts[food] || 0) + 1;
    return counts;
  }, {});

  return Object.entries(foodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([food, count]) => ({ food, count }));
};

// 식단 데이터 유효성 검사
export const validateMealData = (mealData) => {
  const errors = {};

  if (!mealData.date) {
    errors.date = '날짜는 필수입니다';
  }

  if (!mealData.mealType) {
    errors.mealType = '식사 타입은 필수입니다';
  }

  if (!mealData.foodName || !mealData.foodName.trim()) {
    errors.foodName = '음식명은 필수입니다';
  }

  if (!mealData.calories || mealData.calories <= 0) {
    errors.calories = '칼로리는 0보다 큰 숫자여야 합니다';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 식단 요약 생성
export const generateMealSummary = (meals, date) => {
  const dayMeals = meals.filter(meal => meal.date === date);
  const totalCalories = calculateDailyCalories(dayMeals);
  const mealCounts = {
    breakfast: dayMeals.filter(m => m.mealType === 'breakfast').length,
    lunch: dayMeals.filter(m => m.mealType === 'lunch').length,
    dinner: dayMeals.filter(m => m.mealType === 'dinner').length,
    snack: dayMeals.filter(m => m.mealType === 'snack').length
  };

  return {
    date,
    totalMeals: dayMeals.length,
    totalCalories,
    mealCounts,
    averageCaloriesPerMeal: dayMeals.length > 0 ? Math.round(totalCalories / dayMeals.length) : 0
  };
};