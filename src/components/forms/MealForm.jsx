import { useState } from 'react';
import { Card, Button, Input } from '../common';
import './MealForm.css';

const MealForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    mealType: initialData?.mealType || 'breakfast',
    foodName: initialData?.foodName || '',
    calories: initialData?.calories || '',
    memo: initialData?.memo || ''
  });

  const [errors, setErrors] = useState({});

  const mealTypes = [
    { value: 'breakfast', label: '🌅 아침' },
    { value: 'lunch', label: '☀️ 점심' },
    { value: 'dinner', label: '🌙 저녁' },
    { value: 'snack', label: '🍪 간식' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = '날짜를 선택해주세요';
    }

    if (!formData.foodName.trim()) {
      newErrors.foodName = '음식명을 입력해주세요';
    }

    if (!formData.calories || parseInt(formData.calories) <= 0) {
      newErrors.calories = '올바른 칼로리를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const mealData = {
      ...formData,
      calories: parseInt(formData.calories),
      id: initialData?.id || Date.now(),
      createdAt: initialData?.createdAt || new Date().toISOString()
    };

    onSubmit(mealData);
    
    // 폼 초기화 (수정 모드가 아닌 경우)
    if (!initialData) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mealType: 'breakfast',
        foodName: '',
        calories: '',
        memo: ''
      });
    }
  };

  return (
    <Card className="meal-form">
      <h2 className="form-title">
        {initialData ? '📝 식단 수정' : '✏️ 식단 기록'}
      </h2>
      
      <form onSubmit={handleSubmit} className="form">
        <Input
          label="날짜"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />
        
        <div className="input-group">
          <label htmlFor="mealType" className="input-label">
            식사 시간 <span className="required">*</span>
          </label>
          <select
            id="mealType"
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            className="input select"
          >
            {mealTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="음식명"
          type="text"
          name="foodName"
          placeholder="예: 김치찌개 🍲, 삼겹살 구이 🥓"
          value={formData.foodName}
          onChange={handleChange}
          error={errors.foodName}
          required
        />

        <Input
          label="칼로리"
          type="number"
          name="calories"
          placeholder="예: 500"
          value={formData.calories}
          onChange={handleChange}
          error={errors.calories}
          required
        />

        <div className="input-group">
          <label htmlFor="memo" className="input-label">메모</label>
          <textarea
            id="memo"
            name="memo"
            placeholder="맛이나 느낌을 기록해보세요 😋 (선택사항)"
            value={formData.memo}
            onChange={handleChange}
            className="input textarea"
            rows={3}
          />
        </div>

        <div className="form-actions">
          {onCancel && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel}
            >
              취소
            </Button>
          )}
          <Button type="submit" variant="primary">
            {initialData ? '💾 수정하기' : '🎯 기록하기'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MealForm;