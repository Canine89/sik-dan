// 날짜 관련 유틸리티 함수들

// 날짜를 YYYY-MM-DD 형식으로 포맷
export const formatDate = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
export const getTodayString = () => {
  return formatDate(new Date());
};

// 날짜를 한국어 형식으로 포맷 (예: 2024년 1월 15일)
export const formatDateKorean = (date) => {
  // null, undefined 처리
  if (!date) {
    return '날짜 없음';
  }
  
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  // Invalid Date 처리
  if (isNaN(date.getTime())) {
    return '잘못된 날짜';
  }
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 요일을 한국어로 반환 (예: 월요일)
export const getDayOfWeekKorean = (date) => {
  // null, undefined 처리
  if (!date) {
    return '';
  }
  
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  // Invalid Date 처리
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleDateString('ko-KR', { weekday: 'long' });
};

// 주간 날짜 범위 계산 (일요일 시작)
export const getWeekRange = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  return {
    start: formatDate(start),
    end: formatDate(end)
  };
};

// 월간 날짜 범위 계산
export const getMonthRange = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  return {
    start: formatDate(start),
    end: formatDate(end)
  };
};

// N일 전 날짜 계산
export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

// N일 후 날짜 계산
export const getDaysAfter = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

// 두 날짜 사이의 일수 계산
export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 날짜가 오늘인지 확인
export const isToday = (date) => {
  return formatDate(date) === getTodayString();
};

// 날짜가 어제인지 확인
export const isYesterday = (date) => {
  return formatDate(date) === getDaysAgo(1);
};

// 날짜가 내일인지 확인
export const isTomorrow = (date) => {
  return formatDate(date) === getDaysAfter(1);
};