import { useState } from 'react';
import { Card, Button } from '../common';
import { getMealTypeLabel, formatCalories } from '../../utils/mealUtils';
import { formatDateKorean, getDayOfWeekKorean } from '../../utils/dateUtils';
import './MealList.css';

const MealItem = ({ meal, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(meal.id);
    setShowDeleteConfirm(false);
  };

  return (
    <Card className="meal-item" variant="light">
      <div className="meal-item-header">
        <div className="meal-info">
          <span className="meal-type">{getMealTypeLabel(meal.mealType)}</span>
          <span className="meal-date">
            {formatDateKorean(meal.date)} ({getDayOfWeekKorean(new Date(meal.date))})
          </span>
        </div>
        <div className="meal-actions">
          <Button size="small" variant="ghost" onClick={() => onEdit(meal)}>
            수정
          </Button>
          <Button 
            size="small" 
            variant="error" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            삭제
          </Button>
        </div>
      </div>
      
      <div className="meal-content">
        <h3 className="food-name">{meal.foodName}</h3>
        <p className="calories">{formatCalories(meal.calories)} kcal</p>
        {meal.memo && <p className="memo">{meal.memo}</p>}
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>정말 삭제하시겠습니까? 🤔</p>
          <div className="confirm-actions">
            <Button 
              size="small" 
              variant="ghost" 
              onClick={() => setShowDeleteConfirm(false)}
            >
              취소
            </Button>
            <Button 
              size="small" 
              variant="error" 
              onClick={handleDelete}
            >
              삭제
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

const MealList = ({ 
  meals, 
  onEdit, 
  onDelete, 
  groupBy = 'date',
  showEmpty = true 
}) => {
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  // 정렬된 식단 목록
  const sortedMeals = [...meals].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + getMealTimeOrder(a.mealType));
    const dateB = new Date(b.date + ' ' + getMealTimeOrder(b.mealType));
    
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // 식사 시간 순서 (정렬용)
  function getMealTimeOrder(mealType) {
    const times = {
      breakfast: '07:00',
      lunch: '12:00',
      dinner: '18:00',
      snack: '21:00'
    };
    return times[mealType] || '12:00';
  }

  // 날짜별 그룹화
  const groupedMeals = groupBy === 'date' ? groupMealsByDate(sortedMeals) : null;

  function groupMealsByDate(meals) {
    return meals.reduce((groups, meal) => {
      const date = meal.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(meal);
      return groups;
    }, {});
  }

  // 날짜별 칼로리 총계 계산
  const calculateDayCalories = (dayMeals) => {
    return dayMeals.reduce((total, meal) => total + meal.calories, 0);
  };

  if (meals.length === 0 && showEmpty) {
    return (
      <Card className="empty-meals">
        <div className="empty-content">
          <h3>기록된 식단이 없습니다 😅</h3>
          <p>새로운 식단을 기록해보세요! 🍽️</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="meal-list">
      <div className="meal-list-header">
        <h2>📋 식단 기록</h2>
        <div className="sort-controls">
          <Button
            size="small"
            variant={sortOrder === 'desc' ? 'primary' : 'ghost'}
            onClick={() => setSortOrder('desc')}
          >
            🕐 최신순
          </Button>
          <Button
            size="small"
            variant={sortOrder === 'asc' ? 'primary' : 'ghost'}
            onClick={() => setSortOrder('asc')}
          >
            📅 오래된순
          </Button>
        </div>
      </div>

      {groupBy === 'date' && groupedMeals ? (
        <div className="grouped-meals">
          {Object.entries(groupedMeals).map(([date, dayMeals]) => (
            <div key={date} className="day-group">
              <div className="day-header">
                <h3 className="day-title">
                  {formatDateKorean(date)} ({getDayOfWeekKorean(new Date(date))})
                </h3>
                <span className="day-calories">
                  총 {formatCalories(calculateDayCalories(dayMeals))} kcal
                </span>
              </div>
              <div className="day-meals">
                {dayMeals.map(meal => (
                  <MealItem
                    key={meal.id}
                    meal={meal}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="simple-meals">
          {sortedMeals.map(meal => (
            <MealItem
              key={meal.id}
              meal={meal}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MealList;