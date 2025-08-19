import { useState } from 'react';
import { useMeals } from './hooks/useMeals';
import { Card, Button } from './components/common';
import MealForm from './components/forms/MealForm';
import MealList from './components/layout/MealList';
import { getTodayString, formatDateKorean } from './utils/dateUtils';
import './App.css';

function App() {
  const {
    meals,
    loading,
    addMeal,
    updateMeal,
    deleteMeal,
    getCalorieStats,
    exportData,
    importData
  } = useMeals();

  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit'
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  // 오늘 칼로리 통계
  const todayStats = getCalorieStats(selectedDate);

  const handleAddMeal = (mealData) => {
    addMeal(mealData);
    setCurrentView('list');
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setCurrentView('edit');
  };

  const handleUpdateMeal = (mealData) => {
    updateMeal(editingMeal.id, mealData);
    setEditingMeal(null);
    setCurrentView('list');
  };

  const handleDeleteMeal = (mealId) => {
    deleteMeal(mealId);
  };

  const handleCancelEdit = () => {
    setEditingMeal(null);
    setCurrentView('list');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      importData(file)
        .then((count) => {
          alert(`🎉 ${count}개의 맛있는 기록을 성공적으로 가져왔어요!`);
        })
        .catch((error) => {
          alert(`😅 데이터 가져오기에 실패했어요: ${error.message}`);
        });
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <Card className="loading-card">
            <div className="loading-content">
              <h2>맛있는 데이터를 불러오는 중... 🍽️</h2>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        {/* 헤더 */}
        <header className="app-header">
          <h1 className="app-title">🍎 식단 기록</h1>
          <p className="app-subtitle">건강한 식습관을 기록하고 관리하세요 🌱</p>
        </header>

        {/* 통계 카드 */}
        <Card className="stats-card">
          <div className="stats-header">
            <h3>📊 오늘의 식단 ({formatDateKorean(selectedDate)})</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker"
            />
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">🌅 아침</span>
              <span className="stat-value">{todayStats.breakfast} kcal</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">☀️ 점심</span>
              <span className="stat-value">{todayStats.lunch} kcal</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">🌙 저녁</span>
              <span className="stat-value">{todayStats.dinner} kcal</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">🍪 간식</span>
              <span className="stat-value">{todayStats.snack} kcal</span>
            </div>
            <div className="stat-item total">
              <span className="stat-label">💪 총합</span>
              <span className="stat-value">{todayStats.total} kcal</span>
            </div>
          </div>
        </Card>

        {/* 네비게이션 */}
        <Card className="nav-card">
          <div className="nav-buttons">
            <Button
              variant={currentView === 'list' ? 'primary' : 'ghost'}
              onClick={() => setCurrentView('list')}
            >
              📋 식단 목록
            </Button>
            <Button
              variant={currentView === 'add' ? 'primary' : 'ghost'}
              onClick={() => setCurrentView('add')}
            >
              ➕ 새 기록
            </Button>
            <div className="nav-actions">
              <Button variant="secondary" onClick={exportData} size="small">
                📤 내보내기
              </Button>
              <label className="import-button">
                <Button variant="secondary" size="small">
                  📥 가져오기
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </Card>

        {/* 메인 콘텐츠 */}
        <main className="main-content">
          {currentView === 'add' && (
            <MealForm
              onSubmit={handleAddMeal}
              onCancel={() => setCurrentView('list')}
            />
          )}

          {currentView === 'edit' && editingMeal && (
            <MealForm
              initialData={editingMeal}
              onSubmit={handleUpdateMeal}
              onCancel={handleCancelEdit}
            />
          )}

          {currentView === 'list' && (
            <MealList
              meals={meals}
              onEdit={handleEditMeal}
              onDelete={handleDeleteMeal}
              groupBy="date"
            />
          )}
        </main>

        {/* 푸터 */}
        <footer className="app-footer">
          <p>건강한 식생활로 더 나은 내일을 만들어보세요! 💪✨</p>
        </footer>
      </div>
    </div>
  );
}

export default App;